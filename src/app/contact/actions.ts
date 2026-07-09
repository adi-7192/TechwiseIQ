'use server'

import { Resend } from 'resend'

export interface ContactFormState {
  success: boolean
  message: string
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
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const company = formData.get('company') as string
  const message = formData.get('message') as string
  const budget = formData.get('budget') as string

  if (!name?.trim() || !email?.trim() || !message?.trim() || !budget?.trim()) {
    return { success: false, message: 'Please fill in all required fields.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      'Contact form: RESEND_API_KEY is not set — submission was NOT delivered.',
    )
    return { success: false, message: DELIVERY_FAILED_MESSAGE }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email.trim(),
      subject: `New project inquiry — ${name.trim()} (${budget})`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Company: ${company?.trim() || '—'}`,
        `Budget: ${budget}`,
        '',
        message.trim(),
        '',
        `Sent ${new Date().toISOString()} via techwiseiq.com contact form`,
      ].join('\n'),
    })

    if (error) {
      console.error('Contact form: Resend rejected the send:', error)
      return { success: false, message: DELIVERY_FAILED_MESSAGE }
    }
  } catch (err) {
    console.error('Contact form: delivery failed:', err)
    return { success: false, message: DELIVERY_FAILED_MESSAGE }
  }

  return {
    success: true,
    message: 'Message sent. We’ll reply within 24 hours.',
  }
}
