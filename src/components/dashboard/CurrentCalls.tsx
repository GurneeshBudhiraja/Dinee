import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useCalls } from "@/contexts";
import TranscriptDisplay from "./TranscriptDisplay";
import {
  Phone,
  Clock,
  MapPin,
  Utensils,
  ChefHat,
  PhoneCall,
  MessageSquare,
  Activity,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CurrentCalls: React.FC = () => {
  const {
    state: { activeCalls: calls, loading, error },
  } = useCalls();

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const calculateCallDuration = (creationTime: number): number => {
    const durationMs = currentTime - creationTime;
    return Math.floor(durationMs / 1000);
  };

  const formatCallStartTime = (creationTime: number): string => {
    const date = new Date(creationTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-gray-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading active calls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
          <Phone className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Error
        </h3>
        <p className="text-gray-600">Unable to load active calls: {error}</p>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Ready to Serve Customers
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
            Your AI assistant is standing by to take orders, answer questions,
            and help customers. Active calls will appear here in real-time.
          </p>
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              System Online & Ready
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
            <Activity className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Active Customer Calls
          </h2>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {calls.length} Active
          </span>
        </div>
      </div>

      {calls.map((call) => {
        const callDuration = calculateCallDuration(call._creationTime);

        return (
          <Card
            key={call.callId}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-white animate-fade-in"
          >
            <CardHeader className="bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="success"
                    className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 font-medium shadow-sm"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    LIVE CALL
                  </Badge>
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {formatDuration(callDuration)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-white/60 px-3 py-1.5 rounded-md">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Order #
                      {call.orderId ? (
                        call.orderId
                      ) : (
                        <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse ml-1"></span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      Started {formatCallStartTime(call._creationTime)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Live Transcript Section */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-1.5 bg-red-50 rounded-md">
                      <MessageSquare className="w-4 h-4 text-red-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Live Conversation
                    </h4>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <TranscriptDisplay
                    callId={call.callId}
                    callStartTime={call._creationTime}
                  />
                </div>

                {/* Call Details Grid */}
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
                      {formatDuration(callDuration)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900 text-sm">
                        Order Status
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-gray-800">
                      In Progress
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button
                    disabled={!call.orderId}
                    className={cn(
                      "btn btn-outline btn-sm flex items-center space-x-2"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Order Details</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CurrentCalls;
