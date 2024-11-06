'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logger } from '@/lib/logger'
import { detectUrl, isValidUrl } from '@/lib/url'
import { cn } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useClientTranslation } from '../hooks/use-client-translation'
import { useIsSharePath } from '../hooks/use-is-share-path'
import LogoIcon from './logo-icon'
import { HeaderLanguageSwitcher } from './header-language-switcher'
import { HistoryButton } from './history-button'
import { HeaderSubmitValue } from './types'
import useSettings from '../hooks/use-settings'

/**
 * 头部搜索框
 * Header Filter
 * @param props
 * @returns
 */
const Header = (props: {
  className?: string
  isSubmitting: boolean,
  defaultValue: HeaderSubmitValue,
  onSubmit: (param: HeaderSubmitValue) => void,
  onClickHistoryId: (id: string) => void
}) => {

  const { className, isSubmitting, onSubmit, defaultValue, onClickHistoryId } = props;
  const { t } = useClientTranslation()
  const { isSharePage } = useIsSharePath()
  const { settings } = useSettings();

  // const [url, setUrl] = useState<string | undefined>(originalVideoUrl)
  const [url, setUrl] = useState<string>(defaultValue.url)

  // 如果没有值，默认选择ISO639的第一个语言（英语）
  // If there is no value, the first language of ISO639 (English) is selected by default
  const [languageValue, setLanguageValue] = useState<string>(defaultValue.language)

  const handleSubmit = async () => {
    const newUrl = detectUrl(url ?? '')
    if (!newUrl || !isValidUrl(newUrl)) {
      logger.error('URL is %s', newUrl)
      toast.error(t('home:header.no_include_valid_url'))
      return
    }
    // 当URL经过检测 + 转化为正确格式，更新到state
    // When the URL is detected and converted to the correct format, it is updated to the state
    setUrl(newUrl)
    onSubmit({
      url: newUrl,
      language: languageValue,
    })
  }

  return (
    <header
      className={cn(
        'flex flex-col items-center justify-center space-y-4 px-2 mt-8 z-10',
        className
      )}
    >
      <div className='flex items-center space-x-4'>
        {!settings?.hideBrand && (
          <LogoIcon className='size-8 flex-shrink-0' />
        )}
        <h1 className='break-all text-3xl font-bold leading-tight tracking-tighter transition-all sm:text-4xl lg:leading-[1.1]'>
          {t('home:header.title')}
        </h1>
      </div>
      <div className='mx-2 flex w-full flex-shrink-0 flex-col items-center justify-center gap-2 text-xs sm:flex-row sm:gap-4'>
        <div className='w-full flex-grow sm:w-auto sm:max-w-sm'>
          <Input
            color='primary'
            className='w-full bg-white dark:bg-background'
            placeholder={t('home:header.url_input_placeholder')}
            disabled={isSubmitting || isSharePage}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className={cn('flex items-center justify-center gap-2', isSharePage && 'hidden')}>
          <HeaderLanguageSwitcher
            disabled={isSubmitting}
            className=''
            defaultValue={languageValue}
            onChange={(newValue) => setLanguageValue(newValue)}
          />
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                {t('home:header.start_button_loading')}
              </>
            ) : (
              t('home:header.start_button')
            )}
          </Button>
          <HistoryButton
            onClickId={id => onClickHistoryId(id)}
          />
        </div>
      </div>
    </header>
  )
}

Header.displayName = 'Header'

export { Header }
