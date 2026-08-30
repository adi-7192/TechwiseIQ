import type { ProofVariant } from '@/components/immersive/home/home-content'
import WebsiteProof from './WebsiteProof'
import AutomationFlowDemo from './AutomationFlowDemo'
import OperationsConsoleDemo from './OperationsConsoleDemo'
import OpportunityMapDemo from './OpportunityMapDemo'

export { default as ProofFrame } from './ProofFrame'
export { default as WebsiteProof } from './WebsiteProof'
export { default as AutomationFlowDemo } from './AutomationFlowDemo'
export { default as OperationsConsoleDemo } from './OperationsConsoleDemo'
export { default as OpportunityMapDemo } from './OpportunityMapDemo'

const COMPONENTS = {
  website: WebsiteProof,
  automation: AutomationFlowDemo,
  console: OperationsConsoleDemo,
  opportunity: OpportunityMapDemo,
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
}: {
  variant: ProofVariant
  caption?: string
  className?: string
}) {
  const Component = COMPONENTS[variant]
  return <Component caption={caption} className={className} />
}
