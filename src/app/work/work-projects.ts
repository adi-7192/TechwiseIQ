export function partitionProjects<T extends { featured?: boolean }>(
  projects: readonly T[],
) {
  const explicitlyFeatured = projects.filter((project) => project.featured)
  const featured = (
    explicitlyFeatured.length > 0 ? explicitlyFeatured : projects
  ).slice(0, 3)
  const featuredSet = new Set(featured)

  return {
    featured,
    remaining: projects.filter((project) => !featuredSet.has(project)),
  }
}

type MetricProject = {
  timeline: string
  liveUrl?: string
  workSummary: { proof: { value: string; label: string }[] }
}

/** Hero totals: live client sites only. Previews are shown, never counted. */
export function getDeliveryMetrics(allProjects: readonly MetricProject[]) {
  const projects = allProjects.filter((project) => project.liveUrl)
  if (projects.length === 0) return []

  const pageTotal = projects.reduce((total, project) => {
    const pages = project.workSummary.proof.find(
      (item) => item.label === 'pages',
    )
    return total + Number.parseInt(pages?.value ?? '0', 10)
  }, 0)
  const deliveryWeeks = projects
    .map((project) => Number.parseInt(project.timeline, 10))
    .filter(Number.isFinite)
  const weekRange =
    deliveryWeeks.length > 0
      ? `${Math.min(...deliveryWeeks)}–${Math.max(...deliveryWeeks)}`
      : '—'

  return [
    { value: String(projects.length), label: 'Live client sites' },
    { value: String(pageTotal), label: 'Pages shipped' },
    { value: weekRange, label: 'Weeks, brief to launch' },
  ]
}

export function getProjectStatus(project: {
  liveUrl?: string
  awaitingLaunch?: boolean
}) {
  if (project.liveUrl) return 'Live'
  return project.awaitingLaunch ? 'Awaiting launch' : 'Preview build'
}

const CITY_COUNTRY: Record<string, string> = { Dubai: 'UAE' }

/** Client countries with build counts, most builds first. Reads the `industry` suffix ("… / Dubai"). */
export function getClientCountries(projects: readonly { industry: string }[]) {
  const counts = new Map<string, number>()
  for (const { industry } of projects) {
    const place = industry.split(' / ').at(-1)?.trim() ?? ''
    const country = CITY_COUNTRY[place] ?? place
    counts.set(country, (counts.get(country) ?? 0) + 1)
  }
  return [...counts]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
}
