import React, { useEffect, useRef } from "react";
import { User, Bot, Clock, Mic, MicOff, MessageSquare } from "lucide-react";
import { useTranscripts } from "@/hooks/useTranscripts";

interface TranscriptDisplayProps {
  callId: string;
  callStartTime: number;
  isActive?: boolean;
}

interface TranscriptEntry {
  _id: string;
  _creationTime: number;
  callId: string;
  dialogue: string;
  speaker: "human" | "ai";
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  callId,
  callStartTime,
  isActive = true,
}) => {
  const { transcripts, loading } = useTranscripts(callId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message when new transcripts are added
  useEffect(() => {
    if (lastMessageRef.current && transcripts.length > 0) {
      const timeoutId = setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [transcripts.length]);

  // Also scroll when the component first loads with existing transcripts
  useEffect(() => {
    if (!loading && transcripts.length > 0 && lastMessageRef.current) {
      const timeoutId = setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, transcripts.length]);

  const formatMessageTime = (creationTime: number): string => {
    const date = new Date(creationTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-black border border-white/10 rounded-lg p-4 min-h-[200px]">
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-pulse"></div>
            <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-emerald-500/50 animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">
              Connecting to conversation...
            </p>
            <p className="text-white/70 text-xs mt-1">
              Loading transcript data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (transcripts.length === 0) {
    return (
      <div className="bg-black border border-white/10 rounded-lg p-6 min-h-[200px]">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <MessageSquare className="w-6 h-6 text-white/60" />
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-1">
              {isActive
                ? "Listening for conversation"
                : "No transcripts available"}
            </h4>
            <p className="text-white/70 text-xs max-w-sm">
              {isActive
                ? "The AI assistant is ready to engage with the customer. Transcript will appear here in real-time."
                : "This call did not generate any transcript data."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              {isActive ? (
                <>
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium text-xs">
                    Live Transcript
                  </span>
                </>
              ) : (
                <span className="text-white font-medium text-xs">
                  Call Transcript
                </span>
              )}
            </div>
            <div className="h-3 w-px bg-white/20"></div>
            <div className="flex items-center space-x-1 text-white/60 text-xs">
              <Clock className="w-3 h-3" />
              <span>{transcripts.length} messages</span>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center space-x-2">
              <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-md text-xs font-medium border border-emerald-500/30">
                Active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="max-h-64 overflow-y-auto p-3 space-y-2 bg-black"
      >
        {transcripts.map((transcript: TranscriptEntry, index: number) => {
          const isLastMessage = index === transcripts.length - 1;
          const isHuman = transcript.speaker === "human";
          const isFirstFromSpeaker =
            index === 0 ||
            transcripts[index - 1].speaker !== transcript.speaker;

          return (
            <div
              key={transcript._id}
              ref={isLastMessage ? lastMessageRef : null}
              className={`flex ${isHuman ? "justify-end" : "justify-start"} ${
                isLastMessage
                  ? "animate-[messageAppear_0.5s_ease-out]"
                  : "animate-fade-in"
              }`}
              style={{
                animationDelay: isLastMessage ? "0ms" : `${index * 50}ms`,
              }}
            >
              <div
                className={`flex items-end space-x-2 max-w-[85%] ${isHuman ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {/* Avatar */}
                {isFirstFromSpeaker && (
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                      isHuman
                        ? "bg-white/10 border-white/20"
                        : "bg-emerald-500 border-emerald-400"
                    }`}
                  >
                    {isHuman ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-white" />
                    )}
                  </div>
                )}
                {!isFirstFromSpeaker && <div className="w-6"></div>}

                {/* Message Bubble */}
                <div className="flex flex-col space-y-1">
                  {/* Speaker Label & Time (only for first message from speaker) */}
                  {isFirstFromSpeaker && (
                    <div
                      className={`flex items-center space-x-1.5 px-1 ${isHuman ? "justify-end" : "justify-start"}`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isHuman ? "text-white/60" : "text-emerald-500"
                        }`}
                      >
                        {isHuman ? "Customer" : "AI Assistant"}
                      </span>
                      <span className="text-white/60 text-xs">
                        {formatMessageTime(transcript._creationTime)}
                      </span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                      isHuman
                        ? "bg-white/5 text-white border border-white/10"
                        : "bg-black text-white border border-white/10"
                    } ${
                      isFirstFromSpeaker
                        ? isHuman
                          ? "rounded-tr-md"
                          : "rounded-tl-md"
                        : ""
                    }`}
                  >
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                      {transcript.dialogue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - Only show for active calls */}
      {isActive && (
        <div className="bg-white/5 border-t border-white/10 px-3 py-1.5">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-1.5 text-white/60 text-xs">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Real-time conversation monitoring</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;
