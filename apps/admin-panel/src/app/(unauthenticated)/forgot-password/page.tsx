'use client'
import Input from '@/components/input'
import { Button } from '@tremor/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Logo from '../../../components/Logo'
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
type FormSchema = z.infer<typeof formSchema>
export default function ForgotPassword() {
  const { handleSubmit, control, formState } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })
  const onSubmit = async () => {
    toast.success('Login successful')
  }
  const router = useRouter()
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto flex w-full max-w-sm flex-col items-center space-y-4 p-4">
        <Logo />
        <Input
          label="Email"
          placeholder="Enter your email"
          control={control}
          name={'email'}
          containerClassName="w-full"
        />
        <Button
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={!formState.isValid}
          type="submit"
        >
          Send Reset Email
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
