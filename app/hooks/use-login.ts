import { useUserStore } from '@/app/stores/use-user-store'
import { login } from '@/lib/api/auth'
import { logger } from '@/lib/logger'
import { UseTranslationReturnType } from '@/types/auth'
import { env } from 'next-runtime-env'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useIsAuthPath } from './use-is-auth-path'
import { getUse302Auth } from '@/lib/utils'
const authPath = env('NEXT_PUBLIC_AUTH_PATH')!
export const useLogin = (t: UseTranslationReturnType) => {
  const router = useRouter()
  const { isAuthPage } = useIsAuthPath()
  const [code, setCode] = useState('')
  const [errMessage, setErrMessage] = useState<string | undefined>('')
  const {
    apiKey,
    code: sessionCode,
    hasHydrated,
    updateAll,
  } = useUserStore((state) => ({
    apiKey: state.apiKey,
    code: state.code,
    hasHydrated: state._hasHydrated,
    updateAll: state.updateAll,
  }))
  // 登录
  const handleLogin = useCallback(
    async (loginCode?: string, rememberCode?: boolean) => {
      const result = await login(t, loginCode)
      if (result.success) {
        if (isAuthPage) {
          if (rememberCode && loginCode) {
            localStorage.setItem('code', loginCode)
          } else {
            localStorage.setItem('code', '')
          }
        }
        updateAll({
          ...result.data,
          code: loginCode,
        })
        return result
      }
      setErrMessage(result.errorMessage)
      return result
    },
    [t, isAuthPage, updateAll]
  )
  useEffect(() => {
    if (!getUse302Auth()) {
      return;
    }
    const performLogin = async () => {
      if (isAuthPage) return
      const urlParams = new URLSearchParams(window.location.search)
      const urlCode = urlParams.get('pwd')
      if (!apiKey) {
        const urlRegion =
          urlParams.get('region') || env('NEXT_PUBLIC_DEFAULT_REGION')!
        updateAll({ region: urlRegion })
      }
      let result = await handleLogin()
      if (result.success) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
        return
      }
      const storageCode = localStorage.getItem('code')
      if (urlCode) {
        result = await handleLogin(urlCode)
      } else if (sessionCode) {
        result = await handleLogin(sessionCode)
      } else if (storageCode) {
        result = await handleLogin(storageCode)
      }
      if (result.success) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        )
        return
      }
      toast.error(result.errorMessage || t('auth:errors.unknown_error'))
      router.push(authPath, { scroll: false })
    }
    if (hasHydrated) {
      performLogin().catch((e) => {
        logger.error(`Login error: ${JSON.stringify(e)}`)
      })
    }
  }, [
    handleLogin,
    hasHydrated,
    isAuthPage,
    updateAll,
    router,
    t,
    apiKey,
    sessionCode,
  ])
  useEffect(() => {
    if (!isAuthPage) {
      return
    }
    const urlParams = new URLSearchParams(window.location.search)
    const urlCode = urlParams.get('pwd') || localStorage.getItem('code')
    if (urlCode) {
      setCode(urlCode)
    }
  }, [isAuthPage])
  return {
    code,
    setCode,
    errMessage,
    setErrMessage,
    handleLogin,
  }
}
