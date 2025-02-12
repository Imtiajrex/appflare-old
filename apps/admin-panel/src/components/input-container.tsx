import { cn } from '@/lib/utils'
import React from 'react'

export type InputContainerProps = {
  label?: string
  description?: string
  containerClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  helperText?: string
  message?: string
  helperTextClassName?: string
  messageClassName?: string
  error?: string
  errorClassName?: string
  children: React.ReactNode
}
export default function InputContainer(props: InputContainerProps) {
  return (
    <div className="flex flex-col gap-1">
      {props.label && (
        <label className={cn('text-sm font-medium', props.labelClassName)}>
          {props.label}
        </label>
      )}
      {props.description && (
        <p className={cn('text-sm text-gray-500', props.descriptionClassName)}>
          {props.description}
        </p>
      )}
      {props.children}
      {props.helperText && (
        <p className={cn('text-sm text-gray-500', props.helperTextClassName)}>
          {props.helperText}
        </p>
      )}
      {props.message && (
        <p className={cn('text-sm text-gray-500', props.messageClassName)}>
          {props.message}
        </p>
      )}
      {props.error && (
        <p className={cn('text-sm text-red-500', props.errorClassName)}>
          {props.error}
        </p>
      )}
    </div>
  )
}
