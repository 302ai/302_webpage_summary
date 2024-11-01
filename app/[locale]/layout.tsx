import '@/lib/check-env'
import { logger } from '@/lib/logger'
import { env, PublicEnvScript } from 'next-runtime-env'
import '../globals.css'

import ClientOnly from '@/app/components/client-only'
import { ErrorHandler } from '@/app/components/error-handler'
import { languages } from '@/app/i18n/settings'
import { dir } from 'i18next'
import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import { cache } from 'react'
import { Toaster } from 'react-hot-toast'
import { Providers } from '../components/providers'
import { Toolbar } from '../components/toolbar'

export async function generateStaticParams() {
  return languages.map((locale) => ({ locale }))
}

type Props = {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const getSEOData = cache(async () => {
  const seoUrl = env('NEXT_PUBLIC_SEO_URL') || ''
  try {
    const res = await fetch(seoUrl, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('Failed to fetch SEO data')
    return await res.json()
  } catch (e) {
    logger.error(e)
    return null
  }
})

export async function generateMetadata(
  { params: { locale } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const headers_ = headers()
  const hostname = headers_.get('host')

  const previousImages = (await parent).openGraph?.images || []
  // const seoRes = await getSEOData()
  const seoRes = {
    data: {
      id: 'videosum',
      supportLanguages: ['zh', 'en', 'ja'],
      fallbackLanguage: 'en',
      languages: {
        zh: {
          title: 'AI网页总结',
          description: '一键概括网页重点信息',
          image: '/images/desc_zh.png',
          _id: '66d2de547e3b177ca1c3b490',
        },
        en: {
          title: 'AI Webpage Summary',
          description:
            'Summarize the key information of a web page with one click',
          image: '/images/desc_en.png',
          _id: '66d2de547e3b177ca1c3b491',
        },
        ja: {
          title: 'AIウェブサマリー',
          description:
            'ワンクリックで Web ページ上の重要な情報を要約する',
          image: '/images/desc_ja.png',
          _id: '66d2de547e3b177ca1c3b492',
        },
      },
    },
  }

  const defaultSEO = {
    title: 'Default Title',
    description: 'Default Description',
    image: '/default-image.jpg',
  }

  const info = seoRes?.data?.languages || { [locale]: defaultSEO }
  // @ts-ignore
  const images = [info[locale].image || defaultSEO.image, ...previousImages]

  return {
    // @ts-ignore
    title: info[locale].title || defaultSEO.title,
    // @ts-ignore
    description: info[locale].description || defaultSEO.description,
    metadataBase: new URL(`https://${hostname}`),
    alternates: {
      canonical: `/${locale}`,
      languages: languages
        .filter((item) => item !== locale)
        .map((item) => ({
          [item]: `/${item}`,
        }))
        .reduce((acc, curr) => Object.assign(acc, curr), {}),
    },
    openGraph: {
      url: `/${locale}`,
      images,
    },
    twitter: {
      site: `https://${hostname}/${locale}`,
      images,
    },
  }
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  return (
    <html lang={locale} dir={dir(locale)}>
      <head>
        <PublicEnvScript />
      </head>
      <body className='bg-[#fafafa] dark:bg-background'>
        <ClientOnly>
          <Providers>
            <Toaster />
            <ErrorHandler />
            <Toolbar />
            {children}
            <script
              src='https://assets.salesmartly.com/js/project_177_61_1649762323.js'
              async
            />
          </Providers>
        </ClientOnly>
      </body>
    </html>
  )
}
