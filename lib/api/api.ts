'use client'
import { useUserStore } from '@/app/stores/use-user-store'
import { emitter } from '@/lib/mitt'
import ky from 'ky'
import { env } from 'next-runtime-env'
import { isEmpty } from 'radash'
import { langToCountry } from './lang-to-country'
import { getApiKey } from '../utils'

const apiKy = ky.create({
  prefixUrl: env('NEXT_PUBLIC_API_URL'),
  timeout: 300000,
  hooks: {
    beforeRequest: [
      (request) => {
        const apiKey = getApiKey()
        if (apiKey) {
          request.headers.set('Authorization', `Bearer ${apiKey}`)
        }
        const lang = useUserStore.getState().language
        if (lang) {
          request.headers.set('Lang', langToCountry(lang))
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const res = await response.json<{ error: { err_code: number } }>()
          if (!isEmpty(res.error?.err_code)) {
            emitter.emit('ToastError', res.error.err_code)
          }
        }
      },
    ],
  },
})

const authKy = ky.create({
  prefixUrl: env('NEXT_PUBLIC_AUTH_API_URL'),
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const lang = useUserStore.getState().language
        if (lang) {
          request.headers.set('Lang', langToCountry(lang))
        }
      },
    ],
  },
})

export { apiKy, authKy }
