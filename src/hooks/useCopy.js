import { useCallback, useEffect, useRef, useState } from 'react'

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text)
  // Fallback for older browsers and non-HTTPS origins (e.g. testing over a LAN IP).
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  if (!copied) throw new Error('Copy failed')
}

/**
 * Copies text to the clipboard and exposes a short-lived status:
 * 'idle' | 'copied' | 'error'. The reset timer is cleared on unmount.
 */
export function useCopy(resetAfterMs = 2400) {
  const [state, setState] = useState('idle')
  const timer = useRef(null)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(async (value) => {
    window.clearTimeout(timer.current)
    try { await copyText(value); setState('copied') } catch { setState('error') }
    timer.current = window.setTimeout(() => setState('idle'), resetAfterMs)
  }, [resetAfterMs])

  return { state, copy }
}
