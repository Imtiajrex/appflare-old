import {
  Select as SelectInput,
  SelectProps as SelectInputProps,
} from '@tremor/react'
import { Controller, FieldValues } from 'react-hook-form'
import { FormProps } from './form'
import InputContainer, { InputContainerProps } from './input-container'

export type SelectProps<T extends FieldValues> = SelectInputProps &
  Omit<InputContainerProps, 'children'> &
  FormProps<T>
export default function Select<T extends FieldValues>(props: SelectProps<T>) {
  if (props.control && props.name) {
    return (
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <InputContainer {...props}>
            <SelectInput
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
      <SelectInput {...props} />
    </InputContainer>
  )
}
