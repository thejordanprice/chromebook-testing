'use client';

import { useState } from 'react';
import { Wifi, CheckCircle, XCircle, Loader } from 'lucide-react';

interface ConnectivityTestProps {
  onComplete: (passed: boolean) => void;
}

interface ConnectivityResult {
  url: string;
  status: 'testing' | 'success' | 'failed';
  responseTime?: number;
  error?: string;
}

export default function ConnectivityTest({ onComplete }: ConnectivityTestProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ConnectivityResult[]>([]);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');

  const testUrls = [
    'https://www.google.com',
    'https://www.cloudflare.com',
    'https://www.github.com',
    'https://httpbin.org/get'
  ];

  const testConnectivity = async () => {
    setIsRunning(true);
    setResults([]);

    const testResults: ConnectivityResult[] = testUrls.map(url => ({
      url,
      status: 'testing'
    }));
    setResults([...testResults]);

    const finalResults: ConnectivityResult[] = [];

    for (let i = 0; i < testUrls.length; i++) {
      const url = testUrls[i];
      const startTime = Date.now();
      
      try {
        await fetch(url, {
          method: 'GET',
          mode: 'no-cors', // This allows testing without CORS issues
          cache: 'no-cache'
        });
        
        const responseTime = Date.now() - startTime;
        
        finalResults[i] = {
          url,
          status: 'success',
          responseTime
        };
      } catch (error) {
        finalResults[i] = {
          url,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Update results progressively
      setResults([...finalResults]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    // Determine if test passed (at least 2 out of 4 URLs should work)
    const successCount = finalResults.filter(r => r.status === 'success').length;
    const passed = successCount >= 2;
    setTestPassed(passed);
    onComplete(passed);
  };

  const handleManualResult = (passed: boolean) => {
    setTestPassed(passed);
    onComplete(passed);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Connectivity Test
      </h2>
      <p className="text-gray-600 mb-6">
        This test will automatically check internet connectivity by attempting to reach several websites.
      </p>

      <div className="space-y-6">
        {/* Automatic Test */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Automatic Connectivity Test
          </h3>
          
          <div className="mb-4">
            <button
              onClick={testConnectivity}
              disabled={isRunning}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Testing...' : 'Start Connectivity Test'}
            </button>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {result.status === 'testing' && (
                      <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                    )}
                    {result.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {result.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {result.url}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.status === 'testing' && 'Testing...'}
                    {result.status === 'success' && result.responseTime && (
                      `${result.responseTime}ms`
                    )}
                    {result.status === 'failed' && 'Failed'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isRunning && results.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Test Summary:</strong> {results.filter(r => r.status === 'success').length} of {results.length} tests passed
              </p>
            </div>
          )}
        </div>

        {/* Manual Verification */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Manual Verification
          </h3>
          <p className="text-gray-600 mb-4">
            Please also manually verify:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Can you browse to websites in a new tab?</li>
            <li>Is the WiFi connection stable?</li>
            <li>Are there any network error messages?</li>
            <li>Can you access online services like Gmail or Google Drive?</li>
          </ul>

          <div className="space-y-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any observations about connectivity..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleManualResult(true)}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  testPassed === true
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Connectivity Test Passed
              </button>
              <button
                onClick={() => handleManualResult(false)}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  testPassed === false
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Connectivity Test Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

