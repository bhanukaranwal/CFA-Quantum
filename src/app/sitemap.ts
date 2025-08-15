import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cfaquantum.netlify.app'
  
  const routes = [
    '',
    '/login',
    '/register',
    '/forgot-password',
    '/dashboard',
    '/dashboard/practice',
    '/dashboard/mock-exam',
    '/dashboard/battles',
    '/dashboard/analytics',
    '/dashboard/study-plan',
    '/dashboard/flashcards',
    '/dashboard/community',
    '/dashboard/achievements',
    '/dashboard/leaderboard',
    '/dashboard/profile',
    '/dashboard/settings',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 
                    route.includes('/dashboard') ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 
             route === '/dashboard' ? 0.9 :
             route.includes('/login') || route.includes('/register') ? 0.8 : 0.7,
  }))
}