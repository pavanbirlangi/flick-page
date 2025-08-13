export default function TestSubdomainPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Subdomain Test Page
        </h1>
        <p className="text-gray-600 mb-4">
          This page confirms that subdomain routing is working correctly.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h2 className="font-semibold text-blue-900 mb-2">Test URLs:</h2>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <code>localhost:3000</code> → Main page</li>
            <li>• <code>test.localhost:3000</code> → This page</li>
            <li>• <code>username.localhost:3000</code> → User portfolio</li>
          </ul>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Check the console for middleware logs to see the routing in action.
        </div>
      </div>
    </div>
  )
}
