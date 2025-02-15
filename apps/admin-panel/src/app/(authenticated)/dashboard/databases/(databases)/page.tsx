/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Table } from '@/components/table'
import { db } from '@/lib/appflare'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Badge, Button, Dialog, DialogPanel } from '@tremor/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { dataBaseSchema, DataBaseType } from '@appflare/schemas/src/db'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import Input from '@/components/input'

export default function DatabasesPage() {
  const router = useRouter()
  const databasesQuery = useQuery({
    queryKey: ['listDatabases'],
    queryFn: async () => {
      const databases = await db.listDatabases()
      return databases
    },
  })
  const databases = databasesQuery.data?.databases ?? []

  return (
    <div className="container flex flex-1 flex-col p-4">
      <div className="flex items-center justify-end">
        <CreateDatabaseButton />
      </div>
      <Table
        data={databases}
        loading={databasesQuery.isFetching}
        columns={[
          {
            render: (item) => <Badge>{item.id}</Badge>,
            title: 'Database Id',
          },
          {
            render: (item) => item.name,
            title: 'Name',
          },
          {
            render: (item) =>
              item.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            title: 'Created At',
          },
          {
            render: (item) =>
              item.updatedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            title: 'Updated At',
          },
        ]}
        onRowClick={(item) => {
          router.push('/dashboard/databases/database?databaseId=' + item._id)
        }}
      />
    </div>
  )
}

const CreateDatabaseButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel title="Create Database">
          <h1 className="text-tremor-content text-xl font-medium">
            Create Database
          </h1>
          <h3 className="text-tremor-content-subtle text-sm">
            Create a new database to store your data
          </h3>
          <CreateDatabaseForm closeDialog={() => setIsOpen(false)} />
        </DialogPanel>
      </Dialog>
      <Button onClick={() => setIsOpen(true)}>Create Database</Button>
    </>
  )
}

const CreateDatabaseForm = ({ closeDialog }: { closeDialog: () => void }) => {
  const { control, handleSubmit } = useForm<DataBaseType['insert']>({
    resolver: zodResolver(dataBaseSchema.insert),
  })
  const addDatabase = useMutation({
    mutationFn: async (data: DataBaseType['insert']) => {
      await db.createDatabase(data)
    },
    onSuccess: () => {
      // Close the dialog
      closeDialog()
      toast.success('Database created successfully')
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to create database')
    },
  })
  const onSubmit = handleSubmit(async (data) => {
    addDatabase.mutate(data)
  })
  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
      <Input label="Name" name="name" control={control} />
      <Input label="Id" name="id" control={control} />
      <div className="flex w-full flex-row items-center justify-end">
        <Button
          type="submit"
          className="mt-2 w-max"
          loading={addDatabase.isLoading}
        >
          Create
        </Button>
      </div>
    </form>
  )
}
