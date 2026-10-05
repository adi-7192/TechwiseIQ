export const BUDGETS = [
  'Under AED 10,000',
  'AED 10,000 – 25,000',
  'AED 25,000 – 50,000',
  'AED 50,000 – 100,000',
  'AED 100,000+',
  'Not sure yet',
] as const

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  company: 160,
  message: 5000,
} as const

export type ContactField = 'name' | 'email' | 'company' | 'message' | 'budget'

export interface ContactSubmission {
  name: string
  email: string
  company: string
  message: string
  budget: string
  website: string
}

type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; field: ContactField; message: string }

const requiredMessages: Record<'name' | 'email' | 'message' | 'budget', string> =
  {
    name: 'Please enter your name.',
    email: 'Please enter your email address.',
    message: 'Please tell us a little about your project.',
    budget: 'Please select a budget range.',
  }

const lengthMessages = {
  name: 'Name is too long.',
  email: 'Email is too long.',
  company: 'Company is too long.',
  message: 'Message is too long.',
} as const

export function readContactSubmission(formData: FormData): ContactSubmission {
  const read = (name: string) => {
    const value = formData.get(name)
    return typeof value === 'string' ? value : ''
  }

  return {
    name: read('name'),
    email: read('email'),
    company: read('company'),
    message: read('message'),
    budget: read('budget'),
    website: read('website'),
  }
}

// Set by the /bottleneck-review form. Only the exact value counts; anything else is a normal inquiry.
export function isReviewRequest(formData: FormData): boolean {
  return formData.get('inquiry') === 'review'
}

export function inquirySubject(review: boolean, name: string, budget: string) {
  return `${review ? 'Free bottleneck review request' : 'New project inquiry'} — ${name} (${budget})`
}

export function validateContactSubmission(
  input: ContactSubmission,
): ValidationResult {
  const data = {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    message: input.message.trim(),
    budget: input.budget.trim(),
    website: input.website.trim(),
  }

  for (const field of ['name', 'email', 'message', 'budget'] as const) {
    if (!data[field]) {
      return { ok: false, field, message: requiredMessages[field] }
    }
  }

  for (const field of ['name', 'email', 'company', 'message'] as const) {
    if (data[field].length > CONTACT_LIMITS[field]) {
      return {
        ok: false,
        field,
        message: lengthMessages[field],
      }
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return {
      ok: false,
      field: 'email',
      message: 'Please enter a valid email address.',
    }
  }

  if (!(BUDGETS as readonly string[]).includes(data.budget)) {
    return {
      ok: false,
      field: 'budget',
      message: 'Please select a valid budget range.',
    }
  }

  return { ok: true, data }
}
