"use client";

import { useEffect, useRef } from "react";

type ViewTrackerProps = {
  postId: string;
};

/**
 * Fires a single best-effort request to record a view for this
 * article. Runs client-side (rather than during server rendering)
 * because cookies can only be written from a Route Handler or
 * Server Action, not while rendering a page — this keeps the
 * dedup cookie logic in one place in the API route.
 *
 * Renders nothing. A failed or blocked request just means the view
 * isn't counted; it never affects what the reader sees.
 */
export function ViewTracker({ postId }: ViewTrackerProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    fetch(`/api/posts/${postId}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Best-effort — view tracking should never disrupt reading.
    });
  }, [postId]);

  return null;
}
