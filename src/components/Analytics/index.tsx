'use client'

import { useEffect } from 'react'
import {
  trackEvent,
  type AnalyticsEventName,
} from '@/lib/analytics'

type EventMatch = {
  name: AnalyticsEventName
  item?: string
}

function eventForElement(element: Element): EventMatch | null {
  const explicit = element.closest<HTMLElement>('[data-analytics-event]')
  if (explicit?.dataset.analyticsEvent) {
    return {
      name: explicit.dataset.analyticsEvent as AnalyticsEventName,
      item: explicit.dataset.analyticsItem,
    }
  }

  const anchor = element.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) return null

  const concept = anchor.closest<HTMLElement>('[data-concept-slug]')
  if (concept?.dataset.conceptSlug) {
    return { name: 'concept_open', item: concept.dataset.conceptSlug }
  }

  const url = new URL(anchor.href, window.location.href)
  if (url.hostname === 'wa.me') {
    return { name: 'cta_whatsapp', item: 'whatsapp' }
  }

  if (url.origin !== window.location.origin) return null

  const work = url.pathname.match(/^\/work\/([^/]+)\/?$/)
  if (work) return { name: 'work_open', item: work[1] }

  const service = url.pathname.match(/^\/services\/(web|software|ai)\/?$/)
  if (service) return { name: 'service_open', item: service[1] }

  return null
}

/**
 * One delegated client boundary for meaningful Plausible events. This keeps
 * content components server-rendered and avoids one analytics wrapper per link.
 */
export default function Analytics() {
  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>()

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const match = eventForElement(event.target)
      if (!match) return
      trackEvent(match.name, {
        path: window.location.pathname,
        ...(match.item ? { item: match.item } : {}),
      })
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      if (event.target.getAttribute('name') === 'website') return
      const form = event.target.closest<HTMLFormElement>(
        'form[data-analytics-form="contact"]',
      )
      if (!form || startedForms.has(form)) return
      startedForms.add(form)
      trackEvent('contact_form_start', { path: window.location.pathname })
    }

    const onSubmit = (event: SubmitEvent) => {
      if (!(event.target instanceof HTMLFormElement)) return
      if (event.target.dataset.analyticsForm !== 'contact') return
      trackEvent('contact_form_submit', { path: window.location.pathname })
    }

    document.addEventListener('click', onClick)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('submit', onSubmit)
    document.documentElement.dataset.analyticsReady = 'true'

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('submit', onSubmit)
      delete document.documentElement.dataset.analyticsReady
    }
  }, [])

  return null
}
