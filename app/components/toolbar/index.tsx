'use client'
import { useIsAuthPath } from '@/app/hooks/use-is-auth-path'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'
import { ToolInfo } from './tool-info'

function Toolbar() {
  const { isAuthPage } = useIsAuthPath()

  return (
    <div className='fixed right-4 top-2 z-50 flex gap-2'>
      {!isAuthPage && <ToolInfo />}
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  )
}

export { Toolbar }
