'use server'

import { Resend } from 'resend'
import {
  readContactSubmission,
  validateContactSubmission,
  type ContactField,
  type ContactSubmission,
} from './contact-validation'

type ContactFormValues = Omit<ContactSubmission, 'website'>

export interface ContactFormState {
  success: boolean
  message: string
  field?: ContactField
  values?: ContactFormValues
}

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'Info@techwiseiqtechnologies.ae'
// Until the sending domain is verified in Resend, override via CONTACT_FROM_EMAIL
// (e.g. "Techwise IQ <hello@techwiseiq.com>").
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? 'Techwise IQ Website <onboarding@resend.dev>'

const DELIVERY_FAILED_MESSAGE =
  'Something went wrong on our end and your message was NOT sent. ' +
  'Please email Info@techwiseiqtechnologies.ae or WhatsApp +971 56 776 0667 instead.'

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const submission = readContactSubmission(formData)
  const values: ContactFormValues = {
    name: submission.name,
    email: submission.email,
    company: submission.company,
    message: submission.message,
    budget: submission.budget,
  }
  const result = validateContactSubmission(submission)

  if (!result.ok) {
    return {
      success: false,
      message: result.message,
      field: result.field,
      values,
    }
  }

  const { name, email, company, message, budget, website } = result.data

  // Treat a populated honeypot as handled without disclosing the filter to bots.
  if (website) {
    return {
      success: true,
      message: 'Message sent. We’ll reply within 24 hours.',
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      'Contact form: RESEND_API_KEY is not set — submission was NOT delivered.',
    )
    return { success: false, message: DELIVERY_FAILED_MESSAGE, values }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New project inquiry — ${name} (${budget})`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || '—'}`,
        `Budget: ${budget}`,
        '',
        message,
        '',
        `Sent ${new Date().toISOString()} via techwiseiq.com contact form`,
      ].join('\n'),
    })

    if (error) {
      console.error('Contact form: Resend rejected the send:', error)
      return { success: false, message: DELIVERY_FAILED_MESSAGE, values }
    }
  } catch (err) {
    console.error('Contact form: delivery failed:', err)
    return { success: false, message: DELIVERY_FAILED_MESSAGE, values }
  }

  return {
    success: true,
    message: 'Message sent. We’ll reply within 24 hours.',
  }
}
