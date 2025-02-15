/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, FieldValues, Path } from 'react-hook-form'

export type FormProps<T extends FieldValues> = {
  control?: Control<any, any>
  name?: Path<T>
}
