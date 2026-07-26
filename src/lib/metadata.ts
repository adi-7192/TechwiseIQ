import type { Metadata } from 'next'

interface SocialMetadataInput {
  title: string
  description: string
  url: string
}

const socialImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Techwise IQ — Web, Software and AI Engineering',
}

export function socialMetadata({
  title,
  description,
  url,
}: SocialMetadataInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      title,
      description,
      url,
      siteName: 'Techwise IQ',
      type: 'website',
      locale: 'en_AE',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  }
}
