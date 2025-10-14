'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';

export default function DebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const testResults: any = {};
    
    // Test 1: Direct API calls to our endpoints
    try {
      const apiResponse = await fetch('/api/debug/direct-trips');
      const apiData = await apiResponse.json();
      testResults.apiEndpoint = {
        success: apiResponse.ok,
        data: apiData,
        status: apiResponse.status,
      };
    } catch (error) {
      testResults.apiEndpoint = {
        success: false,
        error: error.message,
      };
    }

    // Test 2: Direct Appwrite client call (this is what's failing)
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
      const directResponse = await databases.listDocuments(DATABASE_ID, 'trips', []);
      testResults.directAppwrite = {
        success: true,
        count: directResponse.documents.length,
        total: directResponse.total,
      };
    } catch (error) {
      testResults.directAppwrite = {
        success: false,
        error: error.message,
        code: error.code,
        type: error.type,
      };
    }

    // Test 3: Try other collections
    const collections = ['events', 'blogs'];
    for (const collection of collections) {
      try {
        const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'memora_db';
        const response = await databases.listDocuments(DATABASE_ID, collection, []);
        testResults[`${collection}Collection`] = {
          success: true,
          count: response.documents.length,
        };
      } catch (error) {
        testResults[`${collection}Collection`] = {
          success: false,
          error: error.message,
          code: error.code,
        };
      }
    }

    // Test 4: CORS test endpoint
    try {
      const corsResponse = await fetch('/api/debug/cors-test');
      const corsData = await corsResponse.json();
      testResults.corsTest = {
        success: corsResponse.ok,
        data: corsData,
      };
    } catch (error) {
      testResults.corsTest = {
        success: false,
        error: error.message,
      };
    }

    setResults(testResults);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Running Debug Tests...</h1>
        <div className="text-purple-400">Please wait while we test the connections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Results</h1>
      
      <div className="space-y-6">
        {Object.entries(results).map(([testName, result]: [string, any]) => (
          <div key={testName} className="border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 capitalize">
              {testName.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            
            <div className={`inline-block px-3 py-1 rounded text-sm mb-3 ${
              result.success ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {result.success ? 'SUCCESS' : 'FAILED'}
            </div>
            
            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <button 
          onClick={runTests}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mr-4"
        >
          Re-run Tests
        </button>
        <a 
          href="/api/debug/appwrite-connection" 
          target="_blank"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-block"
        >
          View Appwrite Connection Test
        </a>
      </div>
    </div>
  );
}
