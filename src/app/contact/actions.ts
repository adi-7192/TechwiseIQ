'use server'

export interface ContactFormState {
  success: boolean
  message: string
}

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

  // TODO: Wire to Resend / SendGrid / webhook for delivery
  // For now, log the submission (visible in server logs)
  console.log('Contact form submission:', {
    name: name.trim(),
    email: email.trim(),
    company: company?.trim() || '—',
    message: message.trim(),
    budget,
    timestamp: new Date().toISOString(),
  })

  return {
    success: true,
    message: 'Message sent. We\u2019ll reply within 24 hours.',
  }
}
