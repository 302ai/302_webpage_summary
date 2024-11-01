import acceptLanguage from 'accept-language'
import { NextRequest, NextResponse } from 'next/server'
import {
  cookieName,
  fallbackLng,
  languages,
  searchParamName,
} from './app/i18n/settings'
import { logger } from './lib/logger'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*.(?:png|jpg|jpeg)).*)',
  ],
}

export function middleware(req: NextRequest) {
  // 标题栏图标、chrome查看网页图标、网站图标、网站清单等请求，直接跳过
  // Skip requests for icons, Chrome web view icons, site icons, site manifests, etc.
  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1)
    return NextResponse.next()

  let lng: string | undefined | null
  let searchLng: string | undefined | null = undefined
  let pathLng: string | undefined | null = undefined
  let headerLng: string | undefined | null = undefined

  // 1 从查询参数中获取语言
  // 1 Get language from query parameters
  if (req.nextUrl.searchParams.has(searchParamName))
    searchLng = acceptLanguage.get(req.nextUrl.searchParams.get(searchParamName))

  // 2 从cookie中获取语言
  // 2 Get language from cookies
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)

  // 3 从请求头中获取语言
  // 3 Get language from request headers
  if (!lng)
    lng = headerLng = acceptLanguage.get(req.headers.get('Accept-Language'))

  // 4 默认语言
  // 4 Default language
  if (!lng)
    lng = fallbackLng

  // 查询参数存在即删除
  // Delete if language exists in query parameters
  searchLng && req.nextUrl.searchParams.delete(searchParamName)

  // 获取路径中的语言
  // Get language from path
  pathLng = languages.find((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))

  // 如果查询参数中存在语言，则重定向到以语言为前缀的路径
  // 如果查询参数不存在，并且路径不是以语言为前缀的路径，则重定向到以语言为前缀的路径
  // If language exists in query parameters, redirect to path prefixed with language
  // If language does not exist in query parameters and path is not prefixed with language, redirect to path prefixed with language
  if (
    // 1 不存在以查询参数为前缀的路径
    // 1 Path is not prefixed with language from query parameters
    (searchLng && !req.nextUrl.pathname.startsWith(`/${searchLng}`)) ||
    // 2 不存在以语言为前缀的路径
    // 2 Path is not prefixed with any language
    !pathLng &&
    // 不是以_next为前缀的路径
    // Path is not prefixed with _next
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    logger.debug({ searchLng, pathLng, lng })
    searchLng &&
      ((lng = searchLng),
        (req.nextUrl.pathname =
          req.nextUrl.pathname.replace(`/${pathLng}`, '') || '/'))
    const url = req.nextUrl.clone()
    url.pathname = `/${lng}${url.pathname}`
    return NextResponse.redirect(url, {
      headers: {
        'Set-Cookie': `${cookieName}=${lng}; path=/; Max-Age=2147483647`,
      },
    })
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    )
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}
