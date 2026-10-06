import React from 'react'
import * as Sentry from '@sentry/react'
import SpeedInsights from '@vercel/speed-insights'
import './index.css'
import { render } from 'react-dom'
import { App } from './App'

const CHUNK_RELOAD_KEY = 'lb:chunk-reload-attempted'

const getErrorMessage = (reason: unknown): string => {
  if (typeof reason === 'string') {
    return reason
  }

  if (reason instanceof Error) {
    return reason.message
  }

  if (typeof reason === 'object' && reason !== null && 'message' in reason) {
    const maybeMessage = (reason as { message: unknown }).message
    return typeof maybeMessage === 'string' ? maybeMessage : String(maybeMessage)
  }

  return String(reason)
}

const isChunkLoadError = (message: string): boolean => {
  const normalizedMessage = message.toLowerCase()

  return (
    normalizedMessage.includes('importing a module script failed')
    || normalizedMessage.includes('failed to fetch dynamically imported module')
    || normalizedMessage.includes('loading chunk')
    || normalizedMessage.includes('chunkloaderror')
  )
}

// Some in-app browsers block sessionStorage or set it to null, so every access is guarded
const readReloadFlag = (): boolean => {
  try {
    return window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1'
  } catch {
    return false
  }
}

const writeReloadFlag = (isSet: boolean): boolean => {
  try {
    if (isSet) {
      window.sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
    } else {
      window.sessionStorage.removeItem(CHUNK_RELOAD_KEY)
    }
    return true
  } catch {
    return false
  }
}

const safelyReloadAfterChunkError = (message: string, source: 'error' | 'unhandledrejection') => {
  if (!isChunkLoadError(message)) {
    return
  }

  const hasReloaded = readReloadFlag()

  Sentry.captureMessage('Chunk/module import failed in browser', {
    level: 'error',
    tags: {
      operation: 'chunk_load_error',
      source,
      has_reloaded_once: String(hasReloaded),
    },
    extra: {
      message,
      pathname: window.location.pathname,
      userAgent: window.navigator.userAgent,
    },
  })

  if (hasReloaded) {
    writeReloadFlag(false)
    return
  }

  // Without a saved flag we can't tell a second failure apart, so don't risk a reload loop
  if (writeReloadFlag(true)) {
    window.location.reload()
  }
}

window.addEventListener('error', (event) => {
  const message = event.message || getErrorMessage(event.error)
  safelyReloadAfterChunkError(message, 'error')
})

window.addEventListener('unhandledrejection', (event) => {
  const message = getErrorMessage(event.reason)
  safelyReloadAfterChunkError(message, 'unhandledrejection')
})

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // Vercel sets this to production or preview, so preview testing can be filtered out
  environment: import.meta.env.VITE_VERCEL_ENV || import.meta.env.MODE,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enableLogs: true,
  // Extension errors reach our global handlers but are not our code.
  ignoreErrors: [
    /Invalid call to runtime\.sendMessage/,
    /runtime\.sendMessage/,
  ],
  denyUrls: [
    // Vercel's comment toolbar on preview deployments
    /\/_next-live\//i,
    /^https:\/\/vercel\.live\//i,
    /^safari-(web-)?extension:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],
})

render(<App />, document.getElementById('root'))

// Clear on boot, else a stuck flag blocks the next chunk error's reload.
writeReloadFlag(false)

SpeedInsights.injectSpeedInsights()
