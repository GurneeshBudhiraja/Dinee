import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SENTIMENT_CONFIG } from "@/lib/constants";
import { useCalls } from "@/contexts";

const PastCalls: React.FC = () => {
  const {
    state: { pastCalls, loading, error },
  } = useCalls();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">Loading past calls...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading past calls: {error}
        </div>
      </div>
    );
  }

  if (pastCalls.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Past Calls
        </h3>
        <p className="text-gray-500">
          Completed calls and their transcripts will appear here.
        </p>
      </div>
    );
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getSentimentBadgeVariant = (sentiment?: string) => {
    switch (sentiment) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      case "neutral":
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-4">
      {pastCalls.map((call) => (
        <Card key={call.id} expandable>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {call.phoneNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    Duration: {formatDuration(call.duration)}
                  </div>
                </div>
                {call.sentiment && (
                  <Badge variant={getSentimentBadgeVariant(call.sentiment)}>
                    {SENTIMENT_CONFIG[call.sentiment].icon}{" "}
                    {SENTIMENT_CONFIG[call.sentiment].label}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {call.orderId ? (
                  <div className="text-sm font-medium text-green-600">
                    Order: {call.orderId}
                  </div>
                ) : call.reason ? (
                  <div className="text-sm text-gray-500 max-w-48 truncate">
                    {call.reason}
                  </div>
                ) : null}
                <div className="text-xs text-gray-400 mt-1">
                  {call.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Call Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Phone Number:</span>
                    <div className="font-medium">{call.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <div className="font-medium">
                      {formatDuration(call.duration)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp:</span>
                    <div className="font-medium">
                      {call.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Outcome:</span>
                    <div className="font-medium">
                      {call.orderId ? (
                        <span className="text-green-600">
                          Order Placed: {call.orderId}
                        </span>
                      ) : (
                        <span className="text-gray-600">No Order</span>
                      )}
                    </div>
                  </div>
                </div>
                {call.reason && !call.orderId && (
                  <div className="mt-3">
                    <span className="text-gray-500">Reason:</span>
                    <div className="font-medium text-gray-700 mt-1">
                      {call.reason}
                    </div>
                  </div>
                )}
              </div>

              {call.transcript && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Full Transcript
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {call.transcript}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PastCalls;
