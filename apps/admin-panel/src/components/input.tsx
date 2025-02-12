import { TextInput, TextInputProps } from '@tremor/react'
import React from 'react'
import InputContainer, { InputContainerProps } from './input-container'
import { FormProps } from './form'
import { Controller, FieldValues } from 'react-hook-form'

export type InputProps<T extends FieldValues> = TextInputProps &
  Omit<InputContainerProps, 'children'> &
  FormProps<T>
export default function Input<T extends FieldValues>(props: InputProps<T>) {
  if (props.control && props.name) {
    return (
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <InputContainer {...props}>
            <TextInput
              {...props}
              value={field.value}
              onChange={field.onChange}
            />
          </InputContainer>
        )}
      />
    )
  }
  return (
    <InputContainer {...props}>
      <TextInput {...props} />
    </InputContainer>
  )
}
