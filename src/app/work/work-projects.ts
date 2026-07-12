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
