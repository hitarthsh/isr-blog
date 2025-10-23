"use client";

import { useState, useEffect } from "react";
import { BlogService } from "@/lib/blog-service";
import ConnectionConfig from "@/components/ConnectionConfig";
import SetupGuide from "@/components/SetupGuide";

interface ConnectionStatus {
  wordpress: {
    connected: boolean;
    error?: string;
    siteInfo?: any;
  };
  ghost: {
    connected: boolean;
    error?: string;
    siteInfo?: any;
  };
}

export default function AdminPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    wordpress: { connected: false },
    ghost: { connected: false },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const testConnections = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      const response = await fetch("/api/admin/test-connections");
      const data = await response.json();

      setConnectionStatus({
        wordpress: data.wordpress,
        ghost: data.ghost,
      });

      setTestResults(data);
    } catch (error) {
      console.error("Error testing connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testWordPressConnection = async (credentials: any) => {
    const response = await fetch("/api/admin/test-connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test-credentials",
        platform: "wordpress",
        credentials,
      }),
    });
    return response.json();
  };

  const testGhostConnection = async (credentials: any) => {
    const response = await fetch("/api/admin/test-connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "test-credentials",
        platform: "ghost",
        credentials,
      }),
    });
    return response.json();
  };

  useEffect(() => {
    testConnections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Blog Editor Connections
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your WordPress and Ghost CMS connections
            </p>
          </div>

          <div className="p-6">
            {/* Connection Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* WordPress Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    WordPress
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      connectionStatus.wordpress.connected
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {connectionStatus.wordpress.connected
                      ? "Connected"
                      : "Disconnected"}
                  </div>
                </div>

                {connectionStatus.wordpress.connected ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      ✓ Successfully connected to WordPress
                    </p>
                    {connectionStatus.wordpress.siteInfo && (
                      <p className="text-sm text-gray-600">
                        Posts available:{" "}
                        {connectionStatus.wordpress.siteInfo.postsCount}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">
                      ✗ WordPress connection failed
                    </p>
                    {connectionStatus.wordpress.error && (
                      <p className="text-xs text-red-500 font-mono">
                        {connectionStatus.wordpress.error}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Ghost Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ghost CMS
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      connectionStatus.ghost.connected
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {connectionStatus.ghost.connected
                      ? "Connected"
                      : "Disconnected"}
                  </div>
                </div>

                {connectionStatus.ghost.connected ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      ✓ Successfully connected to Ghost
                    </p>
                    {connectionStatus.ghost.siteInfo && (
                      <p className="text-sm text-gray-600">
                        Posts available:{" "}
                        {connectionStatus.ghost.siteInfo.postsCount}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-red-600">
                      ✗ Ghost connection failed
                    </p>
                    {connectionStatus.ghost.error && (
                      <p className="text-xs text-red-500 font-mono">
                        {connectionStatus.ghost.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Test Button */}
            <div className="mb-8">
              <button
                onClick={testConnections}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Testing Connections...
                  </>
                ) : (
                  "Test Connections"
                )}
              </button>
            </div>

            {/* Connection Configuration */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Configure Connections
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConnectionConfig
                  platform="wordpress"
                  onTestConnection={testWordPressConnection}
                />
                <ConnectionConfig
                  platform="ghost"
                  onTestConnection={testGhostConnection}
                />
              </div>
            </div>

            {/* Setup Guide */}
            <div className="mt-8">
              <SetupGuide />
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Test Results
                </h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
