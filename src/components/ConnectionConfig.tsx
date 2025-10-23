"use client";

import { useState } from "react";

interface ConnectionConfigProps {
  platform: "wordpress" | "ghost";
  onTestConnection: (credentials: any) => Promise<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  }>;
}

export default function ConnectionConfig({
  platform,
  onTestConnection,
}: ConnectionConfigProps) {
  const [credentials, setCredentials] = useState({
    wordpress: {
      apiUrl: "",
      username: "",
      password: "",
    },
    ghost: {
      apiUrl: "",
      contentApiKey: "",
    },
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await onTestConnection(credentials[platform]);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const isWordPress = platform === "wordpress";
  const isGhost = platform === "ghost";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {platform} Configuration
        </h3>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            testResult?.success
              ? "bg-green-100 text-green-800"
              : testResult?.success === false
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {testResult?.success
            ? "Connected"
            : testResult?.success === false
            ? "Failed"
            : "Not Tested"}
        </div>
      </div>

      <div className="space-y-4">
        {/* API URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API URL
          </label>
          <input
            type="url"
            value={credentials[platform].apiUrl}
            onChange={(e) => handleInputChange("apiUrl", e.target.value)}
            placeholder={
              isWordPress
                ? "https://your-site.com/wp-json/wp/v2"
                : "https://your-ghost-site.com"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* WordPress specific fields */}
        {isWordPress && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={credentials.wordpress.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="your-username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Password
              </label>
              <input
                type="password"
                value={credentials.wordpress.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="your-application-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Create this in WordPress Admin → Users → Your Profile →
                Application Passwords
              </p>
            </div>
          </>
        )}

        {/* Ghost specific fields */}
        {isGhost && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content API Key
            </label>
            <input
              type="password"
              value={credentials.ghost.contentApiKey}
              onChange={(e) =>
                handleInputChange("contentApiKey", e.target.value)
              }
              placeholder="your-ghost-content-api-key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Get this from Ghost Admin → Settings → Integrations
            </p>
          </div>
        )}

        {/* Test Button */}
        <div className="pt-4">
          <button
            onClick={handleTest}
            disabled={
              isTesting ||
              !credentials[platform].apiUrl ||
              (isWordPress &&
                (!credentials.wordpress.username ||
                  !credentials.wordpress.password)) ||
              (isGhost && !credentials.ghost.contentApiKey)
            }
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
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
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`p-4 rounded-md ${
              testResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex">
              <div className="shrink-0">
                {testResult.success ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3
                  className={`text-sm font-medium ${
                    testResult.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {testResult.message}
                </h3>
                {testResult.data && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Posts available: {testResult.data.postsCount}</p>
                    <p>API URL: {testResult.data.apiUrl}</p>
                  </div>
                )}
                {testResult.error && (
                  <div className="mt-2 text-sm text-red-600 font-mono">
                    {testResult.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Setup Instructions
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            {isWordPress ? (
              <>
                <p>1. Go to your WordPress Admin dashboard</p>
                <p>2. Navigate to Users → Your Profile</p>
                <p>3. Scroll down to "Application Passwords"</p>
                <p>
                  4. Create a new application password (not your regular
                  password)
                </p>
                <p>5. Copy the generated password and use it above</p>
              </>
            ) : (
              <>
                <p>1. Go to your Ghost Admin dashboard</p>
                <p>2. Navigate to Settings → Integrations</p>
                <p>3. Create a new integration</p>
                <p>4. Copy the Content API key and use it above</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
