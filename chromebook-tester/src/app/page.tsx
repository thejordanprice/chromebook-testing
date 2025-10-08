'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestStep } from '@/types/test';
import PowerTest from '@/components/PowerTest';
import ConnectivityTest from '@/components/ConnectivityTest';
import KeyboardTest from '@/components/KeyboardTest';
import SoundTest from '@/components/SoundTest';
import DisplayTest from '@/components/DisplayTest';

const testSteps: TestStep[] = [
  { id: 'identifier', name: 'Device Identifier', description: 'Enter asset tag or serial number', completed: false },
  { id: 'power', name: 'Power Test', description: 'Verify power and battery charging', completed: false },
  { id: 'connectivity', name: 'Connectivity Test', description: 'Test internet connectivity', completed: false },
  { id: 'keyboard', name: 'Keyboard Test', description: 'Test keyboard functionality', completed: false },
  { id: 'sound', name: 'Sound Test', description: 'Test audio output', completed: false },
  { id: 'display', name: 'Display Test', description: 'Test display quality', completed: false },
];

export default function Home() {
  const [identifier, setIdentifier] = useState('');
  const [testerName, setTesterName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState(testSteps);
  const router = useRouter();

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      const updatedSteps = [...steps];
      updatedSteps[0].completed = true;
      updatedSteps[0].passed = true; // Identifier step always passes when completed
      setSteps(updatedSteps);
      setCurrentStep(1);
    }
  };

  const handleTestComplete = async (stepIndex: number, passed: boolean) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].completed = true;
    updatedSteps[stepIndex].passed = passed;
    setSteps(updatedSteps);
    
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      // All tests completed - save to database
      await saveTestResults();
      router.push('/admin');
    }
  };

  const saveTestResults = async () => {
    try {
      const testResult = {
        identifier,
        testerName,
        powerTest: {
          passed: steps[1].passed || false,
          notes: ''
        },
        connectivityTest: {
          passed: steps[2].passed || false,
          testedUrls: ['https://www.google.com', 'https://www.cloudflare.com', 'https://www.github.com', 'https://httpbin.org/get'],
          failedUrls: [],
          notes: ''
        },
        keyboardTest: {
          passed: steps[3].passed || false,
          pressedKeys: [],
          missedKeys: [],
          notes: ''
        },
        soundTest: {
          passed: steps[4].passed || false,
          notes: ''
        },
        displayTest: {
          passed: steps[5].passed || false,
          notes: ''
        },
        overallPassed: steps.every(step => step.passed === true),
        completedAt: new Date()
      };

      await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testResult),
      });
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Device Identifier
            </h2>
            <p className="text-gray-600 mb-6">
              Please enter the asset tag or serial number for this Chromebook.
            </p>
            <form onSubmit={handleIdentifierSubmit} className="space-y-4">
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                  Asset Tag or Serial Number
                </label>
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter identifier..."
                  required
                />
              </div>
              <div>
                <label htmlFor="testerName" className="block text-sm font-medium text-gray-700">
                  Tester Name (Optional)
                </label>
                <input
                  type="text"
                  id="testerName"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your name..."
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Testing
              </button>
            </form>
          </div>
        );
      
      case 1:
        return <PowerTest onComplete={(passed) => handleTestComplete(1, passed)} />;
      case 2:
        return <ConnectivityTest onComplete={(passed) => handleTestComplete(2, passed)} />;
      case 3:
        return <KeyboardTest onComplete={(passed) => handleTestComplete(3, passed)} />;
      case 4:
        return <SoundTest onComplete={(passed) => handleTestComplete(4, passed)} />;
      case 5:
        return <DisplayTest onComplete={(passed) => handleTestComplete(5, passed)} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Chromebook Functionality Test
        </h1>
        
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentStep} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg border-2 ${
                index === currentStep
                  ? 'border-blue-500 bg-blue-50'
                  : step.completed
                  ? step.passed
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">
                {step.name}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {step.description}
              </div>
              {step.completed && (
                <div className="mt-2">
                  {step.passed ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Passed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ✗ Failed
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      {renderCurrentStep()}
    </div>
  );
}