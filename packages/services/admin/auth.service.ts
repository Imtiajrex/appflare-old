import { AdminSessionType, AdminType } from '@appflare/db/schemas'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import DBService from '../db/db.service'
import { err, Result, ResultAsync, ok } from 'neverthrow'
type SignInResult = {
  token: string
  user: AdminType['select']
}
type CreateAccountResult = {
  token: string
}

const adminCollection = new DBService<AdminType>('settings', 'admins')
const sessionCollection = new DBService<AdminSessionType>(
  'settings',
  'adminSessions',
)
export class AuthService {
  async createAccountWithEmailAndPassword({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<ResultType<CreateAccountResult>> {
    const user: AdminType['insert'] = {
      name,
      email,
      password,
    }
    const existingUser = await adminCollection.findOne({ email })
    if (existingUser) {
      return err('User already exists')
    }
    const insertedUser = await adminCollection.insertOne(user)

    const token = this.generateSessionToken()
    await this.createSession(token, insertedUser?.insertedId?.toString())
    return ok({
      token,
    })
  }
  async signInWithEmailAndPassword({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<ResultType<SignInResult>> {
    const admin = await adminCollection.findOne({ email, password })

    if (!admin) {
      return err('Invalid email or password')
    }

    const token = this.generateSessionToken()
    await this.createSession(token, admin.id)
    return ok({
      token,
      user: admin,
    })
  }
  generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }
  async createSession(
    token: string,
    userId: string,
  ): Promise<ResultType<AdminSessionType['select']>> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )
    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    } as const
    const sessionCreationResult = await ResultAsync.fromPromise(
      sessionCollection.insertOne(session),
      () => 'Failed to insert session',
    )
    if (sessionCreationResult.isErr()) return err(sessionCreationResult.error)
    return ok(session)
  }
  async validateSessionToken(
    token: string,
  ): Promise<ResultType<SessionValidationResult>> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )
    const session = await sessionCollection.findOne({ id: sessionId })!
    if (!session) {
      return err('Session not found')
    }
    const user = await adminCollection.findOne({ id: session.userId })!
    if (!user) {
      return err('User not found')
    }
    if (Date.now() >= session.expiresAt.getTime()) {
      await sessionCollection.deleteOne({ id: sessionId })
      return err('Session expired')
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await sessionCollection.updateOne({ id: sessionId }, session)
    }
    return ok({ session, user })
  }
  async invalidateSession(sessionId: string): Promise<void> {
    await sessionCollection.deleteOne({ id: sessionId })
  }
  async invalidateAllSessions(userId: string): Promise<void> {
    await sessionCollection.deleteMany({
      userId,
    })
  }
}

export type SessionValidationResult =
  | { session: AdminSessionType['select']; user: AdminType['select'] }
  | { session: null; user: null }
