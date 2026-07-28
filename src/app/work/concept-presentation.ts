export type ConceptPresentationStatus = 'draft' | 'published' | 'unavailable'

type ConceptPresentationInput = {
  status: 'draft' | 'published'
  previewMode?: 'live-auto-scroll'
  demoPath?: string
}

export function getConceptPresentationStatus(
  concept: ConceptPresentationInput,
): ConceptPresentationStatus {
  if (concept.status === 'draft') return 'draft'
  return concept.previewMode === 'live-auto-scroll' && concept.demoPath
    ? 'published'
    : 'unavailable'
}
