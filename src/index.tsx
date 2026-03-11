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

const safelyReloadAfterChunkError = (message: string, source: 'error' | 'unhandledrejection') => {
  if (!isChunkLoadError(message)) {
    return
  }

  const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY) === '1'

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
    sessionStorage.removeItem(CHUNK_RELOAD_KEY)
    return
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  window.location.reload()
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
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enableLogs: true,
})

render(<App />, document.getElementById('root'))

SpeedInsights.injectSpeedInsights()
