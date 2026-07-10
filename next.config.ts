import type { NextConfig } from "next";

// cacheComponents + unstable_instant evaluated 2026-07-10 and deferred:
// the draft instant-validation rejects file-based metadata routes
// (icon/apple-icon/opengraph-image with fs reads). All routes are fully
// static, so default <Link> prefetching already navigates instantly.
// Re-evaluate when the instant API leaves draft status.
const nextConfig: NextConfig = {};

export default nextConfig;
