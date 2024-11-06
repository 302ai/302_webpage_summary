'use client'

import useSettings from "../hooks/use-settings"


export default function Chat302() {
  const { settings } = useSettings()

  if (settings?.hideBrand) return null
  return (
    <script
      src='https://assets.salesmartly.com/js/project_177_61_1649762323.js'
      async
    />
  )
}
