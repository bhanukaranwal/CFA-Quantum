'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  Users,
  Target,
  Settings,
  Zap,
  MessageSquare,
  Award,
  CreditCard,
  FileText,
  Home,
  Star
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    current: false,
  },
  {
    name: 'Practice',
    href: '/dashboard/practice',
    icon: Target,
    current: false,
  },
  {
    name: 'Mock Exams',
    href: '/dashboard/mock-exam',
    icon: Clock,
    current: false,
  },
  {
    name: 'Battle Arena',
    href: '/dashboard/battles',
    icon: Zap,
    current: false,
    badge: '2 active',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Study Plan',
    href: '/dashboard/study-plan',
    icon: Calendar,
    current: false,
  },
  {
    name: 'Flashcards',
    href: '/dashboard/flashcards',
    icon: CreditCard,
    current: false,
  },
  {
    name: 'Community',
    href: '/dashboard/community',
    icon: MessageSquare,
    current: false,
  },
  {
    name: 'Achievements',
    href: '/dashboard/achievements',
    icon: Award,
    current: false,
  },
]

const secondaryNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-16">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-4 pb-4">
        {/* User Progress Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-cfa-blue to-cfa-gold rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Your Progress</span>
            <Star className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Level 12</span>
              <span>2,450 XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-xs opacity-90">
              550 XP to Level 13
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                Study
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {navigationItems.slice(0, 7).map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-cfa-blue text-white'
                            : 'text-gray-700 hover:text-cfa-blue hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-cfa-blue',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs",
                              isActive ? "bg-white/20 text-white border-white/20" : ""
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                Community
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {navigationItems.slice(7).map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-cfa-blue text-white'
                            : 'text-gray-700 hover:text-cfa-blue hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-cfa-blue',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Secondary Navigation */}
            <li className="mt-auto">
              <ul role="list" className="-mx-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gray-100 text-cfa-blue'
                            : 'text-gray-700 hover:text-cfa-blue hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-cfa-blue' : 'text-gray-400 group-hover:text-cfa-blue',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide mb-2">
            Quick Stats
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Study Streak</span>
              <span className="font-medium text-orange-600 flex items-center">
                7 🔥
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Questions Today</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-medium text-green-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Global Rank</span>
              <span className="font-medium text-blue-600">#47</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}