"use client";

import { useEffect, useRef } from "react";
import { addToHistory } from "@/src/services/history";
import { useUser } from "@/src/contexts/UserContext";

export default function HistoryRecorder({ mediaId }: { mediaId: string }) {
  const { user } = useUser();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (user && mediaId && !hasRecorded.current) {
      hasRecorded.current = true; // Prevent double recording in strict mode or re-renders
      addToHistory(mediaId).catch((err) =>
        console.error("Failed to record history:", err)
      );
    }
  }, [user, mediaId]);

  return null;
}
