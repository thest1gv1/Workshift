import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WorkShift',
    short_name: 'WS',
    description: 'Мобильное приложение для учёта клиентов и формирования сменного отчёта сотрудника',
    start_url: '/workshift',
    display: 'standalone',
    background_color: '#0a0e1a',
    theme_color: '#0a0e1a',
    icons: [
      {
        src: '/workshift/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/workshift/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}