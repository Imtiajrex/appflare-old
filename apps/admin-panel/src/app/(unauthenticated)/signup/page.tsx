/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import Input from '@/components/input'
import { Button } from '@tremor/react'

import { auth } from '@/lib/appflare'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Logo from '../../../components/Logo'
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormSchema = z.infer<typeof formSchema>
export default function Signup() {
  const { handleSubmit, control, formState } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const onSubmit = useMutation({
    mutationFn: async (data: FormSchema) => {
      return await auth.signUpWithEmailAndPassword(
        data.email,
        data.password,
        data.name,
      )
    },
    onSuccess: (result) => {
      console.log(result)
      toast.success('Signup successful')

      router.push('/dashboard')
    },
    onError: (error: any) => {
      console.log(error?.cause)
      toast.error(error?.cause?.message)
    },
  })
  const router = useRouter()
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-4 p-4">
        <Logo />
        <Input
          label="Name"
          placeholder="Enter your name"
          control={control}
          name={'name'}
          containerClassName="w-full"
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          control={control}
          name={'email'}
          containerClassName="w-full"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          control={control}
          name={'password'}
          type="password"
          containerClassName="w-full"
        />
        <Button
          className="w-full"
          onClick={handleSubmit((data) => {
            onSubmit.mutate(data)
          })}
          disabled={!formState.isValid}
          type="submit"
          loading={onSubmit.isPending}
        >
          Signup
        </Button>
        <Button
          variant="light"
          className="w-full"
          type="button"
          onClick={() => {
            router.push('/')
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}
