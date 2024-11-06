'use client'
import { use302Url } from '@/app/hooks/use-302url'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { useIsDark } from '@/app/hooks/use-is-dark'
import { useLogin } from '@/app/hooks/use-login'
import useSettings from '@/app/hooks/use-settings'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { getUse302Auth } from '@/lib/utils'
import darkLogo from '@/public/images/logo-dark.png'
import lightLogo from '@/public/images/logo-light.png'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Page() {
  const { t } = useClientTranslation()

  const { theme } = useTheme()
  const { isDark } = useIsDark()

  const router = useRouter()

  const { code, errMessage, handleLogin, setCode } = useLogin(t)
  const { href } = use302Url()

  const { settings } = useSettings()

  const [rememberCode, setRememberCode] = useState(false)
  const handleChangeRememberCode = (state: CheckedState) => {
    setRememberCode(state === 'indeterminate' ? false : state)
  }

  useEffect(() => {
    if (!getUse302Auth()) {
      router.push('/', { scroll: false })
    }
  }, [])

  return (
    <div className='flex h-fit min-h-screen w-full min-w-[375px] flex-col items-center justify-center p-0 transition-[padding] ease-in-out lg:px-32 lg:py-16 xl:px-64'>
      <div className='flex w-full flex-1 flex-col rounded-none border border-gray-300 bg-white p-9 shadow-xl dark:border-gray-700 dark:bg-background dark:shadow-none lg:rounded-3xl'>
        <div className='flex flex-1 flex-col gap-4 justify-center'>
          {!settings?.hideBrand && (
            <Image
              alt='ai-302'
              className='mx-auto h-[36px] w-[128px] mb-12'
              src={isDark ? darkLogo : lightLogo}
              quality={100}
              height={72}
              width={256}
            />
          )}
          <div className='mx-auto flex w-full flex-col gap-2 text-center transition-all ease-in-out md:w-4/5 lg:w-72'>
            <div className='flex justify-center'>
              <svg
                className='size-8 text-current'
                viewBox='0 0 1024 1024'
                xmlns='http://www.w3.org/2000/svg'
              >
                <title>{t('auth:logo_title')}</title>
                <path
                  d='M153.6 469.312v469.376h716.8V469.312H153.6zM64 384h896v640H64V384zm403.2 329.92c-26.752-14.72-44.8-42.304-44.8-73.92 0-47.104 40.128-85.312 89.6-85.312 49.472 0 89.6 38.208 89.6 85.312 0 31.616-18.048 59.136-44.8 73.92v115.968a44.8 44.8 0 0 1-89.6 0V713.92zM332.8 384h358.4V256c0-94.272-80.256-170.688-179.2-170.688-98.944 0-179.2 76.416-179.2 170.688v128zM512 0c148.48 0 268.8 114.56 268.8 256v128H243.2V256C243.2 114.56 363.52 0 512 0z'
                  fill='currentColor'
                />
              </svg>
            </div>
            <div className='mt-4 text-xl font-bold'>{t('auth:title')}</div>
            <div className='mb-5'>{t('auth:description')}</div>
            <div className='mb-1 flex justify-center'>
              <Input
                className='w-3/4 bg-background text-center'
                defaultValue={code}
                placeholder={t('auth:code_input.placeholder')}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCode(e.target.value)
                }
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const result = await handleLogin(code, rememberCode)

                    if (result.success) {
                      router.push('/', { scroll: false })
                    }
                  }
                }}
              />
            </div>
            {errMessage && (
              <div className='text-red-600 dark:text-red-400'>
                <span>{errMessage}</span>
                {`，${t('auth:error_message')} `}
                <a
                  className='text-blue-500 underline dark:text-blue-300'
                  href={href}
                  rel='noreferrer'
                  target='_blank'
                >
                  302.AI
                </a>
              </div>
            )}
            <div className='mt-1 flex justify-center'>
              <Button
                className='w-3/4'
                onClick={async () => {
                  const result = await handleLogin(code, rememberCode)

                  if (result.success) {
                    router.push('/', { scroll: false })
                  }
                }}
              >
                {t('auth:confirm_button')}
              </Button>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <Checkbox
                id='remember_code'
                defaultChecked
                checked={rememberCode}
                onCheckedChange={handleChangeRememberCode}
                className='transition-all ease-in-out'
              />
              <label className='cursor-pointer' htmlFor='remember_code'>
                {t('auth:remember_code')}
              </label>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
