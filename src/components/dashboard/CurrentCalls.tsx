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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Calls
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Your AI agent is ready to handle customer calls. Active
            conversations will appear here.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>System is online</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <Card key={call.id} expandable>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
                  className="bg-gray-50 rounded-lg p-4 max-h-48 sm:max-h-64 overflow-y-auto border border-gray-200"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
