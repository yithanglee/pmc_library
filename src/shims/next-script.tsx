import React, { useEffect } from 'react'

export interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload' | 'worker'
  onLoad?: () => void
  onError?: (e: any) => void
}

export default function Script({
  src,
  strategy,
  onLoad,
  onError,
  async = true,
  defer = true,
  ...props
}: ScriptProps) {
  useEffect(() => {
    if (!src) return

    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      if (onLoad) {
        // Already loaded
        onLoad()
      }
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = async
    script.defer = defer

    if (onLoad) {
      script.addEventListener('load', onLoad)
    }
    if (onError) {
      script.addEventListener('error', onError)
    }

    document.head.appendChild(script)

    return () => {
      // Keep script
    }
  }, [src, onLoad, onError, async, defer])

  return null
}
