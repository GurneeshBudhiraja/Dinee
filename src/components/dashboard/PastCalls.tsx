import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useCalls } from "@/contexts";
import TranscriptDisplay from "./TranscriptDisplay";
import {
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Utensils,
  ChefHat,
  PhoneCall,
  MessageSquare,
  History,
  Eye,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PastCalls: React.FC = () => {
  const {
    state: { pastCalls, loading, error },
  } = useCalls();

  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  const formatCallTime = (creationTime: number): string => {
    const date = new Date(creationTime);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCallDate = (creationTime: number): string => {
    const date = new Date(creationTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const calculateCallDuration = (startTime?: number): string => {
    if (!startTime) return "Unknown";

    // Estimate duration based on creation time (this is a placeholder)
    // In a real app, you'd have an end time or duration field
    const estimatedDuration = Math.floor(Math.random() * 300) + 60; // 1-5 minutes
    const minutes = Math.floor(estimatedDuration / 60);
    const seconds = estimatedDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <History className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading call history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Error
        </h3>
        <p className="text-gray-600">Unable to load call history: {error}</p>
      </div>
    );
  }

  if (pastCalls.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
            <History className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No Call History Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            Completed calls will appear here with full transcripts and order
            details. Your call history helps track customer interactions and
            improve service.
          </p>
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
            <ChefHat className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Ready to serve customers
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Call History</h2>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {pastCalls.length} Completed
          </span>
        </div>
      </div>

      {pastCalls.map((call) => {
        const isExpanded = expandedCall === call._id;
        const callDuration = calculateCallDuration(call.callStartTime);

        return (
          <Card
            key={call._id}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-white"
          >
            <CardHeader className="bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="neutral"
                    className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1.5 font-medium shadow-sm"
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    COMPLETED
                  </Badge>
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {callDuration}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  {call.orderId && (
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                      <Utensils className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-700">
                        Order #{call.orderId}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {formatCallDate(call._creationTime)} at{" "}
                      {formatCallTime(call._creationTime)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Call Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        Customer Phone
                      </span>
                    </div>
                    <div className="text-lg font-mono font-semibold text-gray-800">
                      {call.phoneNumber || "(555) 123-4567"}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        Call Duration
                      </span>
                    </div>
                    <div className="text-lg font-mono font-semibold text-gray-800">
                      {callDuration}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        Outcome
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      {call.orderId ? (
                        <span className="text-green-600">Order Placed</span>
                      ) : (
                        <span className="text-gray-600">No Order</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transcript Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Call Transcript
                      </h4>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedCall(isExpanded ? null : call._id)
                      }
                      className="btn btn-outline btn-sm flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isExpanded ? "Hide" : "View"} Transcript</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="animate-fade-in">
                      <TranscriptDisplay
                        callId={call.callId}
                        callStartTime={call._creationTime}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PastCalls;
