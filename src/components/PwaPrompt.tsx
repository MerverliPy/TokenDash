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
    <section
      aria-label="PWA install status"
      style={{
        position: 'sticky',
        top: '1rem',
        zIndex: 20,
        margin: '1rem auto 0',
        width: 'min(1120px, calc(100% - 2rem))',
        border: '1px solid rgba(139, 180, 255, 0.2)',
        borderRadius: '1rem',
        padding: '1rem',
        background: 'rgba(8, 17, 31, 0.92)',
        boxShadow: '0 18px 40px rgba(3, 7, 18, 0.28)',
      }}
    >
      <div style={{ display: 'grid', gap: '0.85rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9fb7ff' }}>PWA shell</p>
          <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>Installable offline shell</h2>
        </div>

        {registrationError ? <p style={{ margin: 0 }}>Service worker registration failed: {registrationError}</p> : null}
        {offlineReady ? <p style={{ margin: 0 }}>The dashboard shell is cached for offline viewing. Fresh analyzer runs still require the local backend.</p> : null}
        {needRefresh ? <p style={{ margin: 0 }}>A refreshed app shell is ready. Reload to swap to the latest cached assets.</p> : null}
        {isInstalled ? <p style={{ margin: 0 }}>TokenDash is running as an installed app or standalone window on this device.</p> : null}
        {!isInstalled && !deferredPrompt && !registrationError ? (
          <p style={{ margin: 0 }}>If your browser does not expose the install prompt automatically, use its install menu once the shell is cached.</p>
        ) : null}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              void handleInstallClick()
            }}
            disabled={!deferredPrompt || isInstalled}
            style={{
              border: '1px solid rgba(139, 180, 255, 0.3)',
              borderRadius: '999px',
              padding: '0.75rem 1rem',
              background: !deferredPrompt || isInstalled ? 'rgba(15, 23, 42, 0.7)' : 'rgba(74, 115, 255, 0.24)',
              color: !deferredPrompt || isInstalled ? 'rgba(236, 242, 255, 0.6)' : '#ecf2ff',
              cursor: !deferredPrompt || isInstalled ? 'not-allowed' : 'pointer',
            }}
          >
            {isInstalled ? 'Installed' : deferredPrompt ? 'Install app shell' : 'Install prompt unavailable'}
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={!needRefresh}
            style={{
              border: '1px solid rgba(139, 180, 255, 0.22)',
              borderRadius: '999px',
              padding: '0.75rem 1rem',
              background: needRefresh ? 'rgba(16, 185, 129, 0.18)' : 'rgba(15, 23, 42, 0.7)',
              color: needRefresh ? '#ecfdf5' : 'rgba(236, 242, 255, 0.6)',
              cursor: needRefresh ? 'pointer' : 'not-allowed',
            }}
          >
            Reload cached shell
          </button>
        </div>
      </div>
    </section>
  )
}
