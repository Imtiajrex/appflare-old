'use client'
import Logo from '@/components/Logo'
import React, { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'
import { Button } from '@tremor/react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
export const sidebarAtom = atom(false)

export default function Sidebar() {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom)
  const [initiated, setInitiated] = useState(false)
  useEffect(() => {
    if (initiated) localStorage.setItem('sidebar', JSON.stringify(isOpen))
  }, [isOpen, initiated])
  useEffect(() => {
    const sidebar = localStorage.getItem('sidebar')
    if (sidebar) {
      setIsOpen(JSON.parse(sidebar))
    }
    setInitiated(true)
  }, [])
  return (
    <div
      className={cn(
        'border-tremor-border bg-tremor-background-subtle relative flex min-h-screen w-full flex-col gap-4 border-r p-4 pt-8 transition-all',
        isOpen ? 'max-w-[250px] items-start' : 'max-w-[75px] items-center',
      )}
    >
      <Logo textClassName={cn('text-lg', isOpen ? 'block' : 'hidden')} />
      <ToggleButton />
      <Routes />
    </div>
  )
}
const routes = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'akar-icons:home',
  },
  {
    name: 'Users',
    path: '/dashboard/users',
    icon: 'akar-icons:person',
  },
  {
    name: 'Database',
    path: '/dashboard/databases',
    icon: 'akar-icons:data',
  },
  {
    name: 'Storage',
    path: '/dashboard/storage',
    icon: 'akar-icons:shipping-box-02',
  },
  {
    name: 'Logs',
    path: '/dashboard/logs',
    icon: 'akar-icons:statistic-up',
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: 'akar-icons:settings-horizontal',
  },
]
const Routes = () => {
  const [isOpen] = useAtom(sidebarAtom)
  const pathname = usePathname()

  const renderRoutes = routes.map((route) => {
    const isActive = pathname === route.path
    return (
      <Link
        href={route.path}
        key={route.path}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-md p-2',
          isOpen ? 'justify-start' : 'justify-center',
          isActive
            ? 'text-tremor-brand-emphasis bg-tremor-brand-faint'
            : 'text-tremor-content-emphasis',
        )}
      >
        <Icon icon={route.icon} className={cn('text-xl')} />
        <span className={cn('text-sm', isOpen ? 'block' : 'hidden')}>
          {route.name}
        </span>
      </Link>
    )
  })
  return (
    <div className="flex w-full flex-col items-center gap-2">
      {renderRoutes}
    </div>
  )
}
const ToggleButton = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom)
  return (
    <Button
      onClick={() => setIsOpen((prev) => !prev)}
      className={cn('absolute top-8', isOpen ? 'right-4' : 'right-[-65%]')}
      variant="secondary"
      size="xs"
    >
      <Icon
        icon={'akar-icons:chevron-right'}
        className={cn(
          'text-lg transition-transform',
          isOpen ? 'rotate-180 transform' : 'rotate-0 transform',
        )}
      />
    </Button>
  )
}
