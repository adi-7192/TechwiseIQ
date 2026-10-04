'use client'

import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { trackEvent } from '@/lib/analytics'
import { submitContact, type ContactFormState } from './actions'
import { BUDGETS, CONTACT_LIMITS } from './contact-validation'
import styles from './contact.module.css'

const initialState: ContactFormState = { success: false, message: '' }

const NEXT_STEPS = [
  ['We reply.', 'A real person reads your message and replies within 24 hours.'],
  ['20-minute call.', 'We dig into the problem, your tools and your deadline. No pitch deck.'],
  ['Written scope.', 'What we\u2019ll build, the price and the timeline, in writing. Then you decide.'],
] as const

export function NextSteps() {
  return (
    <div className={styles.next}>
      <h2 className={styles.nextTitle}>What happens next</h2>
      {/* role="list": Safari drops list semantics when list-style is none */}
      <ol className={styles.steps} role="list">
        {NEXT_STEPS.map(([title, line]) => (
          <li key={title}>
            <span>
              <strong>{title}</strong> {line}
            </span>
          </li>
        ))}
      </ol>
      <p className={styles.nextNote}>
        No packages or price lists: every quote is for your requirement.{' '}
        <Link href="/services#engage">How we engage</Link>
      </p>
    </div>
  )
}

export default function ContactForm() {
  const successTracked = useRef(false)
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  )

  useEffect(() => {
    // The form unmounts on success, so move focus to the confirmation.
    const target = state.success ? 'form-success' : state.field
    if (!target) return
    document.getElementById(target)?.focus()
  }, [state])

  useEffect(() => {
    if (!state.success || successTracked.current) return
    successTracked.current = true
    trackEvent('contact_form_success', { path: window.location.pathname })
  }, [state.success])

  const errorFor = (field: string) =>
    state.field === field ? `${field}-error` : undefined

  if (state.success) {
    return (
      <>
        <div
          id="form-success"
          className={styles.success}
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {state.message}
        </div>
        <NextSteps />
      </>
    )
  }

  return (
    <form
      action={formAction}
      className={styles.form}
      data-analytics-form="contact"
      data-testid="contact-form"
      noValidate
    >
      <div role="alert" aria-live="assertive">
        {state.message && !state.success && (
          <p id="form-error" className={styles.error}>
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="name" className={styles.fieldLabel}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={styles.input}
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name}
          defaultValue={state.values?.name}
          aria-invalid={state.field === 'name' || undefined}
          aria-describedby={errorFor('name')}
        />
        {state.field === 'name' && (
          <p id="name-error" className={styles.fieldError}>
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.fieldLabel}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={styles.input}
          autoComplete="email"
          maxLength={CONTACT_LIMITS.email}
          defaultValue={state.values?.email}
          aria-invalid={state.field === 'email' || undefined}
          aria-describedby={errorFor('email')}
        />
        {state.field === 'email' && (
          <p id="email-error" className={styles.fieldError}>
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="company" className={styles.fieldLabel}>
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className={styles.input}
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.company}
          defaultValue={state.values?.company}
          aria-invalid={state.field === 'company' || undefined}
          aria-describedby={errorFor('company')}
        />
        {state.field === 'company' && (
          <p id="company-error" className={styles.fieldError}>
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.fieldLabel}>
          What&apos;s slowing you down?{' '}
          <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          className={styles.textarea}
          rows={5}
          maxLength={CONTACT_LIMITS.message}
          defaultValue={state.values?.message}
          aria-invalid={state.field === 'message' || undefined}
          aria-describedby={errorFor('message')}
        />
        {state.field === 'message' && (
          <p id="message-error" className={styles.fieldError}>
            {state.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="budget" className={styles.fieldLabel}>
          Budget range <span className={styles.required}>*</span>
        </label>
        <select
          key={`${state.message}:${state.values?.budget ?? ''}`}
          id="budget"
          name="budget"
          required
          className={styles.select}
          defaultValue={state.values?.budget ?? ''}
          aria-invalid={state.field === 'budget' || undefined}
          aria-describedby={errorFor('budget')}
        >
          <option value="" disabled>
            Select a range
          </option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {state.field === 'budget' && (
          <p id="budget-error" className={styles.fieldError}>
            {state.message}
          </p>
        )}
      </div>

      <PrimaryCTA
        type="submit"
        variant="primary"
        className={styles.submit}
        disabled={isPending}
      >
        {isPending ? 'Sending\u2026' : 'Send message'}
      </PrimaryCTA>
    </form>
  )
}
