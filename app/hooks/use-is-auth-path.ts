import { env } from 'next-runtime-env'
import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'

const authPath = env('NEXT_PUBLIC_AUTH_PATH')!

function useIsAuthPath() {
  const { locale } = useParams()
  const pathname = usePathname()

  const isAuthPage = useMemo(
    () => pathname === `/${locale}${authPath}`,
    [pathname, locale]
  )

  return { isAuthPage }
}

export { useIsAuthPath }
