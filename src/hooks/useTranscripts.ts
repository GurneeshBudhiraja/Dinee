import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Custom hook to fetch transcripts for a specific call
 * Returns transcripts array and loading state
 */
export const useTranscripts = (callId: string) => {
  const transcripts = useQuery(api.calls.getTranscriptsByCallId, { callId });

  return {
    transcripts: transcripts || [],
    loading: transcripts === undefined,
  };
};