export const SITE_URL = 'https://techwiseiq.com'
export const CONTACT_EMAIL = 'Info@techwiseiqtechnologies.ae'
export const WHATSAPP_URL = 'https://wa.me/971567760667'

// TODO(Adi): swap for the real Cal.com/Calendly URL when it exists.
// Until then booking requests route through WhatsApp so no CTA is a dead link.
export const BOOKING_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  'Hi! I’d like to book a 20-minute intro call.',
)}`
