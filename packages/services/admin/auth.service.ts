import {
  initializeDB,
  Session,
  sessionTable,
  User,
  userTable,
  UserTypes,
} from '@appflare/db'
import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { and, eq } from 'drizzle-orm'
type SignInResult = {
  token: string
  user: User
} | null
type CreateAccountResult = {
  token: string
  user: User
}

export class AuthService {
  async createAccountWithEmailAndPassword({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<CreateAccountResult> {
    const db = initializeDB()
    const user: UserTypes['insert'] = {
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const insertedUser = await db
      .insert(userTable)
      .values(user)
      .returning()
      .execute()
    const token = this.generateSessionToken()
    await this.createSession(token, insertedUser[0]!.id)
    return {
      user: insertedUser[0]!,
      token,
    }
  }
  async signInWithEmailAndPassword({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<SignInResult> {
    const db = initializeDB()
    const result = await db
      .select()
      .from(userTable)
      .where(and(eq(userTable.email, email), eq(userTable.password, password)))
    if (result.length < 1) {
      return null
    }
    const user = result[0]!

    const token = this.generateSessionToken()
    await this.createSession(token, user.id)
    return {
      token,
      user,
    }
  }
  generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }
  async createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )
    const session: Session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    }
    const db = initializeDB()
    await db.insert(sessionTable).values(session)
    return session
  }
  async validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )
    const db = initializeDB()

    const result = await db
      .select({ user: userTable, session: sessionTable })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.id, sessionId))
    if (result.length < 1) {
      return { session: null, user: null }
    }
    const { user, session } = result[0]!
    if (Date.now() >= session.expiresAt.getTime()) {
      await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
      return { session: null, user: null }
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      await db
        .update(sessionTable)
        .set({
          expiresAt: session.expiresAt,
        })
        .where(eq(sessionTable.id, session.id))
    }
    return { session, user }
  }
  async invalidateSession(sessionId: string): Promise<void> {
    const db = initializeDB()
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
  }
  async invalidateAllSessions(userId: number): Promise<void> {
    const db = initializeDB()
    await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
  }
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }
