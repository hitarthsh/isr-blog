"use client";

import { useState } from "react";

export default function SetupGuide() {
  const [activeTab, setActiveTab] = useState<"wordpress" | "ghost" | "env">(
    "env"
  );

  const tabs = [
    { id: "env", name: "Environment Setup", icon: "⚙️" },
    { id: "wordpress", name: "WordPress", icon: "📝" },
    { id: "ghost", name: "Ghost CMS", icon: "👻" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === "env" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Environment Setup
              </h3>
              <p className="text-gray-600 mb-4">
                Create a{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  .env.local
                </code>{" "}
                file in your project root directory.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                {`# WordPress Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_USERNAME=your-username
WORDPRESS_PASSWORD=your-application-password

# Ghost Configuration
GHOST_API_URL=https://your-ghost-site.com
GHOST_CONTENT_API_KEY=your-ghost-content-api-key

# CreativityCoder Configuration (optional)
ISR_REVALIDATE_TIME=3600`}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Never commit your <code>.env.local</code> file to version
                      control. It contains sensitive credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wordpress" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                WordPress Setup
              </h3>
              <p className="text-gray-600 mb-4">
                Follow these steps to connect your WordPress site to the blog
                platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 1: Enable REST API
                </h4>
                <p className="text-gray-600 text-sm">
                  The WordPress REST API is enabled by default in WordPress
                  4.7+. If you're using an older version, you may need to
                  install a plugin or update WordPress.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 2: Create Application Password
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Log in to your WordPress Admin dashboard</li>
                  <li>
                    Go to <strong>Users → Your Profile</strong>
                  </li>
                  <li>
                    Scroll down to the <strong>"Application Passwords"</strong>{" "}
                    section
                  </li>
                  <li>
                    Enter a name for your application (e.g., "Blog Platform")
                  </li>
                  <li>
                    Click <strong>"Add New Application Password"</strong>
                  </li>
                  <li>
                    Copy the generated password (it will look like:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      xxxx xxxx xxxx xxxx xxxx xxxx
                    </code>
                    )
                  </li>
                </ol>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 3: Configure Environment Variables
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Add these to your <code>.env.local</code> file:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        WORDPRESS_API_URL
                      </code>{" "}
                      = Your WordPress site URL + <code>/wp-json/wp/v2</code>
                    </div>
                    <div>
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        WORDPRESS_USERNAME
                      </code>{" "}
                      = Your WordPress username
                    </div>
                    <div>
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        WORDPRESS_PASSWORD
                      </code>{" "}
                      = The application password you created
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
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
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Test Your Connection
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Use the connection test tool above to verify your
                        WordPress credentials are working correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ghost" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ghost CMS Setup
              </h3>
              <p className="text-gray-600 mb-4">
                Follow these steps to connect your Ghost CMS site to the blog
                platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 1: Enable Content API
                </h4>
                <p className="text-gray-600 text-sm">
                  The Ghost Content API is enabled by default in Ghost 2.0+.
                  Make sure your Ghost site is up to date.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 2: Generate API Key
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Log in to your Ghost Admin dashboard</li>
                  <li>
                    Go to <strong>Settings → Integrations</strong>
                  </li>
                  <li>
                    Click <strong>"Add custom integration"</strong>
                  </li>
                  <li>
                    Enter a name for your integration (e.g., "Blog Platform")
                  </li>
                  <li>
                    Click <strong>"Create integration"</strong>
                  </li>
                  <li>
                    Copy the <strong>Content API Key</strong> (it will look
                    like:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                    )
                  </li>
                </ol>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">
                  Step 3: Configure Environment Variables
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Add these to your <code>.env.local</code> file:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        GHOST_API_URL
                      </code>{" "}
                      = Your Ghost site URL (without trailing slash)
                    </div>
                    <div>
                      <code className="bg-gray-200 px-2 py-1 rounded">
                        GHOST_CONTENT_API_KEY
                      </code>{" "}
                      = The Content API key you generated
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="shrink-0">
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
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Test Your Connection
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Use the connection test tool above to verify your Ghost
                        credentials are working correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
