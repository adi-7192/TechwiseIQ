export type AnalyticsEventName =
  | 'cta_start_project'
  | 'cta_whatsapp'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'work_open'
  | 'service_open'
  | 'concept_open'

type EventProps = Record<string, string | number | boolean>

type Plausible = (
  eventName: string,
  options?: { props?: EventProps; interactive?: boolean },
) => void

declare global {
  interface Window {
    plausible?: Plausible & { q?: unknown[][] }
  }
}

/** Send one privacy-safe event through the site's existing Plausible provider. */
export function trackEvent(
  eventName: AnalyticsEventName,
  props?: EventProps,
) {
  if (typeof window === 'undefined' || !window.plausible) return
  window.plausible(eventName, props ? { props } : undefined)
}
