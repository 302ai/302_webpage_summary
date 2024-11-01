'use client'

import { ThemeProvider } from './theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='light'>
      {children}
    </ThemeProvider>
  )
}
