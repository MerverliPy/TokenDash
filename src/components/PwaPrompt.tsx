import { useEffect, useMemo, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(display-mode: standalone)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
}

export default function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)
  const [needRefresh, setNeedRefresh] = useState(false)
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  useEffect(() => {
    setIsInstalled(isStandaloneMode())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    function handleBeforeInstallPrompt(event: Event) {
      const installEvent = event as BeforeInstallPromptEvent
      installEvent.preventDefault()
      setDeferredPrompt(installEvent)
    }

    function handleAppInstalled() {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    setServiceWorkerSupported(true)
    let isCancelled = false

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')

        if (isCancelled) {
          return
        }

        const watchWorker = (worker: ServiceWorker | null) => {
          if (!worker) {
            return
          }

          worker.addEventListener('statechange', () => {
            if (worker.state !== 'installed' || isCancelled) {
              return
            }

            if (navigator.serviceWorker.controller) {
              setNeedRefresh(true)
              return
            }

            setOfflineReady(true)
          })
        }

        watchWorker(registration.installing)
        registration.addEventListener('updatefound', () => {
          watchWorker(registration.installing)
        })

        if (registration.active) {
          setOfflineReady(true)
        }
      } catch (error) {
        if (!isCancelled) {
          setRegistrationError(error instanceof Error ? error.message : 'Unknown service worker registration error')
        }
      }
    }

    void registerServiceWorker()

    return () => {
      isCancelled = true
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) {
      return
    }

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome !== 'accepted') {
      setDeferredPrompt(null)
      return
    }

    setIsInstalled(true)
    setDeferredPrompt(null)
  }

  const showPanel = useMemo(
    () => serviceWorkerSupported || deferredPrompt !== null || offlineReady || needRefresh || isInstalled || registrationError !== null,
    [deferredPrompt, isInstalled, needRefresh, offlineReady, registrationError, serviceWorkerSupported],
  )

  if (!showPanel) {
    return null
  }

  return (
    <section aria-label="PWA install status" className="pwa-banner">
      <div className="pwa-banner__content">
        <div>
          <p className="pwa-banner__eyebrow">PWA shell</p>
          <h2 className="pwa-banner__title">Installable offline shell</h2>
        </div>

        {registrationError ? <p className="pwa-banner__message">Service worker registration failed: {registrationError}</p> : null}
        {offlineReady ? (
          <p className="pwa-banner__message">The dashboard shell is cached for offline viewing. Fresh analyzer runs still require the local backend.</p>
        ) : null}
        {needRefresh ? <p className="pwa-banner__message">A refreshed app shell is ready. Reload to swap to the latest cached assets.</p> : null}
        {isInstalled ? <p className="pwa-banner__message">TokenDash is running as an installed app or standalone window on this device.</p> : null}
        {!isInstalled && !deferredPrompt && !registrationError ? (
          <p className="pwa-banner__message">If your browser does not expose the install prompt automatically, use its install menu once the shell is cached.</p>
        ) : null}

        <div className="button-row button-row--stack-mobile pwa-banner__actions">
          <button
            type="button"
            onClick={() => {
              void handleInstallClick()
            }}
            disabled={!deferredPrompt || isInstalled}
            className="touch-button touch-button--secondary"
          >
            {isInstalled ? 'Installed' : deferredPrompt ? 'Install app shell' : 'Install prompt unavailable'}
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={!needRefresh}
            className="touch-button touch-button--success"
          >
            Reload cached shell
          </button>
        </div>
      </div>
    </section>
  )
}
