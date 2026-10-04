import type { ProofVariant } from '@/components/immersive/home/home-content'
import type { ProofSurface } from './ProofFrame'
import WebsiteProof from './WebsiteProof'
import AutomationFlowDemo from './AutomationFlowDemo'
import OperationsConsoleDemo from './OperationsConsoleDemo'
import OpportunityMapDemo from './OpportunityMapDemo'
import BuildProof from './BuildProof'

export { default as ProofFrame } from './ProofFrame'
export { default as WebsiteProof } from './WebsiteProof'
export { default as AutomationFlowDemo } from './AutomationFlowDemo'
export { default as OperationsConsoleDemo } from './OperationsConsoleDemo'
export { default as OpportunityMapDemo } from './OpportunityMapDemo'
export { default as BuildProof } from './BuildProof'

const COMPONENTS = {
  website: WebsiteProof,
  automation: AutomationFlowDemo,
  console: OperationsConsoleDemo,
  opportunity: OpportunityMapDemo,
  build: BuildProof,
} as const

/**
 * Dispatches a homepage chapter's proof variant to its component. Each proof
 * object is independently reusable (drop `<WebsiteProof />` on a service page);
 * this just routes the homepage's data-driven `variant`.
 */
export default function ProofObject({
  variant,
  caption,
  className,
  surface = 'dark',
}: {
  variant: ProofVariant
  caption?: string
  className?: string
  surface?: ProofSurface
}) {
  const Component = COMPONENTS[variant]
  return <Component caption={caption} className={className} surface={surface} />
}
