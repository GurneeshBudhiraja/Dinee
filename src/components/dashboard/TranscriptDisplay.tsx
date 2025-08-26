import React, { useEffect, useRef } from "react";
import { User, Bot, Clock, Mic, MicOff } from "lucide-react";
import { useTranscripts } from "@/hooks/useTranscripts";

interface TranscriptDisplayProps {
  callId: string;
  callStartTime: number;
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
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6 min-h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="relative flex flex-col items-center justify-center h-full space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-blue-300 animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 font-medium">
              Connecting to conversation...
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Loading transcript data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (transcripts.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-8 min-h-[280px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-blue-50/30"></div>
        <div className="relative flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h4 className="text-slate-800 font-semibold text-lg mb-2">
              Listening for conversation
            </h4>
            <p className="text-slate-600 max-w-sm">
              The AI assistant is ready to engage with the customer. Transcript
              will appear here in real-time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-slate-700 font-medium text-sm">
                Live Transcript
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center space-x-1 text-slate-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{transcripts.length} messages</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="max-h-80 overflow-y-auto scrollbar-thin p-4 space-y-3"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.9))",
        }}
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
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white ${
                      isHuman
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
                        : "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
                    }`}
                  >
                    {isHuman ? (
                      <User className="w-4 h-4 text-white drop-shadow-sm" />
                    ) : (
                      <Bot className="w-4 h-4 text-white drop-shadow-sm" />
                    )}
                  </div>
                )}
                {!isFirstFromSpeaker && <div className="w-8"></div>}

                {/* Message Bubble */}
                <div className="flex flex-col space-y-1">
                  {/* Speaker Label & Time (only for first message from speaker) */}
                  {isFirstFromSpeaker && (
                    <div
                      className={`flex items-center space-x-2 px-1 ${isHuman ? "justify-end" : "justify-start"}`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          isHuman ? "text-blue-700" : "text-emerald-700"
                        }`}
                      >
                        {isHuman ? "Customer" : "AI Assistant"}
                      </span>
                      <span className="text-slate-500 text-xs font-medium">
                        {formatMessageTime(transcript._creationTime)}
                      </span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div
                    className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      isHuman
                        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white"
                        : "bg-white text-slate-800 border border-slate-200/80 backdrop-blur-sm"
                    } ${
                      isFirstFromSpeaker
                        ? isHuman
                          ? "rounded-tr-md"
                          : "rounded-tl-md"
                        : ""
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {transcript.dialogue}
                    </p>

                    {/* Message tail - only for AI messages */}
                    {isFirstFromSpeaker && !isHuman && (
                      <div className="absolute top-0 -left-2 w-0 h-0 border-r-8 border-r-white border-t-8 border-t-transparent"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 px-4 py-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time conversation monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
