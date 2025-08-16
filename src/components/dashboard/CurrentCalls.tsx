import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CALL_STATUS_CONFIG } from "@/lib/constants";
import { useCalls } from "@/contexts";

const CurrentCalls: React.FC = () => {
  const {
    state: { activeCalls: calls, loading, error },
  } = useCalls();
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading calls...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error loading calls: {error}</div>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          No Current Calls
        </h3>
        <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
          When customers call your AI agent, active calls will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {calls.map((call) => (
        <Card key={call.id} expandable>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="success" size="sm">
                    <span className="flex items-center space-x-1">
                      <span aria-hidden="true">
                        {CALL_STATUS_CONFIG.active.icon}
                      </span>
                      <span>{CALL_STATUS_CONFIG.active.label}</span>
                    </span>
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDuration(call.duration)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                <span className="font-mono">{call.phoneNumber}</span>
                {call.orderId && (
                  <span className="font-medium">
                    <span className="sr-only">Order ID: </span>
                    Order: {call.orderId}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Live Transcript
                </h4>
                <div
                  className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto"
                  role="log"
                  aria-live="polite"
                  aria-label="Live call transcript"
                >
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {call.liveTranscript ||
                      "Transcript will appear here as the call progresses..."}
                  </div>
                </div>
              </div>
              <div className="responsive-grid-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900 block">
                    Call Started:
                  </span>
                  <div className="text-gray-600">
                    {call.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900 block">
                    Duration:
                  </span>
                  <div className="text-gray-600">
                    {formatDuration(call.duration)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentCalls;
