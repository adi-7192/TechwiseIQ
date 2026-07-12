export type ConceptPresentationStatus = 'draft' | 'published' | 'unavailable'

type ConceptPresentationInput = {
  status: 'draft' | 'published'
  previewImage?: string
  demoPath?: string
}

export function getConceptPresentationStatus(
  concept: ConceptPresentationInput,
): ConceptPresentationStatus {
  if (concept.status === 'draft') return 'draft'
  return concept.previewImage && concept.demoPath ? 'published' : 'unavailable'
}
