'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Maximize2, Minimize2 } from 'lucide-react';

interface DisplayTestProps {
  onComplete: (passed: boolean) => void;
}

export default function DisplayTest({ onComplete }: DisplayTestProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [currentTest, setCurrentTest] = useState<'color' | 'pixel' | 'gradient'>('color');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleTestResult = (passed: boolean) => {
    setTestPassed(passed);
    onComplete(passed);
  };

  const renderTestPattern = () => {
    switch (currentTest) {
      case 'color':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 bg-red-500"></div>
            <div className="flex-1 bg-green-500"></div>
            <div className="flex-1 bg-blue-500"></div>
            <div className="flex-1 bg-yellow-500"></div>
            <div className="flex-1 bg-purple-500"></div>
            <div className="flex-1 bg-pink-500"></div>
            <div className="flex-1 bg-cyan-500"></div>
            <div className="flex-1 bg-orange-500"></div>
          </div>
        );
      case 'pixel':
        return (
          <div className="w-full h-full bg-black relative">
            <div className="absolute inset-0 grid grid-cols-20 grid-rows-15 gap-px">
              {Array.from({ length: 300 }, (_, i) => (
                <div
                  key={i}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-black'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      case 'gradient':
        return (
          <div className="w-full h-full bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500"></div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Display Test
      </h2>
      <p className="text-gray-600 mb-6">
        Test the display quality by viewing test patterns in fullscreen mode.
      </p>

      <div className="space-y-6">
        {/* Test Controls */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Test Controls
          </h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 mr-2" />
              ) : (
                <Maximize2 className="w-4 h-4 mr-2" />
              )}
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setCurrentTest('color')}
              className={`px-3 py-1 rounded text-sm ${
                currentTest === 'color'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Color Test
            </button>
            <button
              onClick={() => setCurrentTest('pixel')}
              className={`px-3 py-1 rounded text-sm ${
                currentTest === 'pixel'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Pixel Test
            </button>
            <button
              onClick={() => setCurrentTest('gradient')}
              className={`px-3 py-1 rounded text-sm ${
                currentTest === 'gradient'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Gradient Test
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Instructions:</strong> Enter fullscreen mode and check for:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-700 text-sm">
              <li>Dead or stuck pixels</li>
              <li>Color accuracy and uniformity</li>
              <li>Brightness consistency</li>
              <li>Any lines, spots, or discoloration</li>
            </ul>
          </div>
        </div>

        {/* Test Pattern Preview */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Test Pattern Preview
          </h3>
          <div className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
            {renderTestPattern()}
          </div>
        </div>

        {/* Manual Verification */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Manual Verification
          </h3>
          <p className="text-gray-600 mb-4">
            Please verify the following after viewing the fullscreen test:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Are all colors displayed correctly?</li>
            <li>Are there any dead or stuck pixels?</li>
            <li>Is the brightness uniform across the screen?</li>
            <li>Are there any lines, spots, or discoloration?</li>
            <li>Does the display fill the entire screen properly?</li>
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
                placeholder="Any observations about display quality..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleTestResult(true)}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  testPassed === true
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-600 hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Display Test Passed
              </button>
              <button
                onClick={() => handleTestResult(false)}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  testPassed === false
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-600 hover:bg-red-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Display Test Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

