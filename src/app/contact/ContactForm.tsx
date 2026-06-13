'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui'
import { submitContact, type ContactFormState } from './actions'
import styles from './contact.module.css'

const BUDGETS = [
  'Under AED 10,000',
  'AED 10,000 \u2013 25,000',
  'AED 25,000 \u2013 50,000',
  'AED 50,000 \u2013 100,000',
  'AED 100,000+',
  'Not sure yet',
]

const initialState: ContactFormState = { success: false, message: '' }

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContact,
    initialState,
  )

  if (state.success) {
    return <div className={styles.success}>{state.message}</div>
  }

  return (
    <form action={formAction} className={styles.form}>
      {state.message && !state.success && (
        <p className={styles.error}>{state.message}</p>
      )}

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
        />
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
        />
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
        />
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
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="budget" className={styles.fieldLabel}>
          Budget range <span className={styles.required}>*</span>
        </label>
        <select
          id="budget"
          name="budget"
          required
          className={styles.select}
          defaultValue=""
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
      </div>

      <Button
        type="submit"
        variant="primary"
        className={styles.submit}
        disabled={isPending}
      >
        {isPending ? 'Sending\u2026' : 'Send message'}
      </Button>
    </form>
  )
}
