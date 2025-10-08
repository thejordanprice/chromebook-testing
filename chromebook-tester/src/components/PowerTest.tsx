'use client';

import { useState } from 'react';
import { Battery, Plug, CheckCircle, XCircle } from 'lucide-react';

interface PowerTestProps {
  onComplete: (passed: boolean) => void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
}

export default function PowerTest({ onComplete }: PowerTestProps) {
  const [powerStatus, setPowerStatus] = useState<'charging' | 'battery' | 'unknown'>('unknown');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [testPassed, setTestPassed] = useState<boolean | null>(null);

  const checkBatteryAPI = async () => {
    try {
      const nav = navigator as NavigatorWithBattery;
      if (typeof nav.getBattery === 'function') {
        const battery = await nav.getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        setPowerStatus(battery.charging ? 'charging' : 'battery');
      } else {
        setPowerStatus('unknown');
        setBatteryLevel(null);
      }
    } catch {
      setPowerStatus('unknown');
      setBatteryLevel(null);
    }
  };

  const handleTestResult = (passed: boolean) => {
    setTestPassed(passed);
    onComplete(passed);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Power & Battery Test
      </h2>
      <p className="text-gray-600 mb-6">
        Please verify the power and battery charging status of this Chromebook.
      </p>

      <div className="space-y-6">
        {/* Battery Status Check */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Battery Status
          </h3>
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={checkBatteryAPI}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Battery className="w-4 h-4 mr-2" />
              Check Battery Status
            </button>
          </div>

          {powerStatus !== 'unknown' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                {powerStatus === 'charging' ? (
                  <Plug className="w-6 h-6 text-green-600" />
                ) : (
                  <Battery className="w-6 h-6 text-blue-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Status: {powerStatus === 'charging' ? 'Charging' : 'On Battery'}
                  </p>
                  {batteryLevel !== null && (
                    <p className="text-sm text-gray-600">
                      Battery Level: {batteryLevel}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manual Verification */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Manual Verification
          </h3>
          <p className="text-gray-600 mb-4">
            Please check the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Is the power adapter connected and working?</li>
            <li>Is the battery charging indicator showing?</li>
            <li>Does the device turn on and stay on?</li>
            <li>Is the battery holding a charge?</li>
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
                placeholder="Any observations about power/battery status..."
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
                Power Test Passed
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
                Power Test Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

