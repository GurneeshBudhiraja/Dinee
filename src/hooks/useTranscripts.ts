import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useTranscripts = (callId: string) => {
  const transcripts = useQuery(api.calls.getTranscriptsByCallId, { callId });

  return {
    transcripts: transcripts || [],
    loading: transcripts === undefined,
  };
};