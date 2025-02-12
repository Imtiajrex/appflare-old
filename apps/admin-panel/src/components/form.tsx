import { Control, FieldValues, Path } from 'react-hook-form'

export type FormProps<T extends any> = {
  control?: Control<any, any>
  name?: Path<T>
}
