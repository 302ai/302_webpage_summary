import { produce } from 'immer'
import { create } from 'zustand'

import { storeMiddleware } from './middleware'

export type SettingKey = 'hideBrand' | 'showCost';

interface UserStore {
  _hasHydrated: boolean
  info?: string
  apiKey?: string
  modelName?: string
  region?: string
  code?: string
  language?: string,
  settings?: Record<SettingKey, boolean>
}

interface UserActions {
  updateField: <T extends keyof UserStore>(
    field: T,
    value: UserStore[T]
  ) => void
  updateAll: (fields: Partial<UserStore>) => void
  setHasHydrated: (value: boolean) => void
}

export const useUserStore = create<UserStore & UserActions>()(
  storeMiddleware<UserStore & UserActions>(
    (set) => ({
      _hasHydrated: false,
      info: '',
      apiKey: '',
      modelName: '',
      region: '',
      code: '',
      language: 'en',
      settings: {
        hideBrand: true,
        showCost: false,
      },
      updateField: (field, value) =>
        set(
          produce((state) => {
            state[field] = value
          })
        ),
      updateAll: (fields) =>
        set(
          produce((state) => {
            for (const [key, value] of Object.entries(fields)) {
              state[key as keyof UserStore] = value
            }
          })
        ),
      setHasHydrated: (value) =>
        set(
          produce((state) => {
            state._hasHydrated = value
          })
        ),
    }),
    'user_store_websum'
  )
)
