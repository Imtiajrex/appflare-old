/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react/dist/iconify.js'
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react'

export type TableProps<T extends any> = {
  data: T[]
  columns: {
    title: string
    render: (item: T) => React.ReactNode
  }[]
  containerClassName?: string
  wrapperClassName?: string
  onRowClick?: (item: T) => void
  loading?: boolean
}
export function Table<T>(props: TableProps<T>) {
  return (
    <div
      className={cn(
        'bg-tremor-background w-full rounded-xl p-2',
        props.wrapperClassName,
      )}
    >
      <TableComponent className={cn('w-full', props.containerClassName)}>
        <TableHead className="border-tremor-border border-b">
          <TableRow>
            {props.columns.map((column, index) => (
              <TableHeaderCell
                key={`header-${index}`}
                className={cn('text-xs font-bold uppercase')}
              >
                {column.title}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.loading && (
            <TableRow>
              <TableCell colSpan={props.columns.length}>
                <Icon
                  icon="tabler:circle-dashed"
                  className="text-tremor-brand mx-auto animate-spin text-xl"
                />
              </TableCell>
            </TableRow>
          )}
          {props.data.map((item, index) => (
            <TableRow
              key={`row-${index}`}
              onClick={() => props.onRowClick?.(item)}
              className="hover:bg-tremor-background-subtle bg-tremor-background transitiona-all cursor-pointer"
            >
              {props.columns.map((column, index) => (
                <TableCell key={`cell-${index}`}>
                  {column.render?.(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </div>
  )
}
