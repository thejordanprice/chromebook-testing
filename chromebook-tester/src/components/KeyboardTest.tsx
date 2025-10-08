'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { KeyboardKey } from '@/types/test';

interface KeyboardTestProps {
  onComplete: (passed: boolean) => void;
}

// Chromebook keyboard layout
const keyboardLayout: KeyboardKey[][] = [
  // Row 1
  [
    { key: 'Escape', display: 'Esc', pressed: false, row: 0, col: 0 },
    { key: 'F1', display: 'F1', pressed: false, row: 0, col: 1 },
    { key: 'F2', display: 'F2', pressed: false, row: 0, col: 2 },
    { key: 'F3', display: 'F3', pressed: false, row: 0, col: 3 },
    { key: 'F4', display: 'F4', pressed: false, row: 0, col: 4 },
    { key: 'F5', display: 'F5', pressed: false, row: 0, col: 5 },
    { key: 'F6', display: 'F6', pressed: false, row: 0, col: 6 },
    { key: 'F7', display: 'F7', pressed: false, row: 0, col: 7 },
    { key: 'F8', display: 'F8', pressed: false, row: 0, col: 8 },
    { key: 'F9', display: 'F9', pressed: false, row: 0, col: 9 },
    { key: 'F10', display: 'F10', pressed: false, row: 0, col: 10 },
    { key: 'F11', display: 'F11', pressed: false, row: 0, col: 11 },
    { key: 'F12', display: 'F12', pressed: false, row: 0, col: 12 },
    { key: 'Delete', display: 'Del', pressed: false, row: 0, col: 13 },
  ],
  // Row 2
  [
    { key: '`', display: '`', pressed: false, row: 1, col: 0 },
    { key: '1', display: '1', pressed: false, row: 1, col: 1 },
    { key: '2', display: '2', pressed: false, row: 1, col: 2 },
    { key: '3', display: '3', pressed: false, row: 1, col: 3 },
    { key: '4', display: '4', pressed: false, row: 1, col: 4 },
    { key: '5', display: '5', pressed: false, row: 1, col: 5 },
    { key: '6', display: '6', pressed: false, row: 1, col: 6 },
    { key: '7', display: '7', pressed: false, row: 1, col: 7 },
    { key: '8', display: '8', pressed: false, row: 1, col: 8 },
    { key: '9', display: '9', pressed: false, row: 1, col: 9 },
    { key: '0', display: '0', pressed: false, row: 1, col: 10 },
    { key: '-', display: '-', pressed: false, row: 1, col: 11 },
    { key: '=', display: '=', pressed: false, row: 1, col: 12 },
    { key: 'Backspace', display: '⌫', pressed: false, row: 1, col: 13 },
  ],
  // Row 3
  [
    { key: 'Tab', display: 'Tab', pressed: false, row: 2, col: 0 },
    { key: 'q', display: 'Q', pressed: false, row: 2, col: 1 },
    { key: 'w', display: 'W', pressed: false, row: 2, col: 2 },
    { key: 'e', display: 'E', pressed: false, row: 2, col: 3 },
    { key: 'r', display: 'R', pressed: false, row: 2, col: 4 },
    { key: 't', display: 'T', pressed: false, row: 2, col: 5 },
    { key: 'y', display: 'Y', pressed: false, row: 2, col: 6 },
    { key: 'u', display: 'U', pressed: false, row: 2, col: 7 },
    { key: 'i', display: 'I', pressed: false, row: 2, col: 8 },
    { key: 'o', display: 'O', pressed: false, row: 2, col: 9 },
    { key: 'p', display: 'P', pressed: false, row: 2, col: 10 },
    { key: '[', display: '[', pressed: false, row: 2, col: 11 },
    { key: ']', display: ']', pressed: false, row: 2, col: 12 },
    { key: '\\', display: '\\', pressed: false, row: 2, col: 13 },
  ],
  // Row 4
  [
    { key: 'CapsLock', display: 'Caps', pressed: false, row: 3, col: 0 },
    { key: 'a', display: 'A', pressed: false, row: 3, col: 1 },
    { key: 's', display: 'S', pressed: false, row: 3, col: 2 },
    { key: 'd', display: 'D', pressed: false, row: 3, col: 3 },
    { key: 'f', display: 'F', pressed: false, row: 3, col: 4 },
    { key: 'g', display: 'G', pressed: false, row: 3, col: 5 },
    { key: 'h', display: 'H', pressed: false, row: 3, col: 6 },
    { key: 'j', display: 'J', pressed: false, row: 3, col: 7 },
    { key: 'k', display: 'K', pressed: false, row: 3, col: 8 },
    { key: 'l', display: 'L', pressed: false, row: 3, col: 9 },
    { key: ';', display: ';', pressed: false, row: 3, col: 10 },
    { key: "'", display: "'", pressed: false, row: 3, col: 11 },
    { key: 'Enter', display: 'Enter', pressed: false, row: 3, col: 12 },
  ],
  // Row 5
  [
    { key: 'Shift', display: 'Shift', pressed: false, row: 4, col: 0 },
    { key: 'z', display: 'Z', pressed: false, row: 4, col: 1 },
    { key: 'x', display: 'X', pressed: false, row: 4, col: 2 },
    { key: 'c', display: 'C', pressed: false, row: 4, col: 3 },
    { key: 'v', display: 'V', pressed: false, row: 4, col: 4 },
    { key: 'b', display: 'B', pressed: false, row: 4, col: 5 },
    { key: 'n', display: 'N', pressed: false, row: 4, col: 6 },
    { key: 'm', display: 'M', pressed: false, row: 4, col: 7 },
    { key: ',', display: ',', pressed: false, row: 4, col: 8 },
    { key: '.', display: '.', pressed: false, row: 4, col: 9 },
    { key: '/', display: '/', pressed: false, row: 4, col: 10 },
    { key: 'Shift', display: 'Shift', pressed: false, row: 4, col: 11 },
  ],
  // Row 6 (Space bar row)
  [
    { key: 'Control', display: 'Ctrl', pressed: false, row: 5, col: 0 },
    { key: 'Alt', display: 'Alt', pressed: false, row: 5, col: 1 },
    { key: 'Meta', display: 'Search', pressed: false, row: 5, col: 2 },
    { key: ' ', display: 'Space', pressed: false, row: 5, col: 3 },
    { key: 'Meta', display: 'Search', pressed: false, row: 5, col: 4 },
    { key: 'Alt', display: 'Alt', pressed: false, row: 5, col: 5 },
    { key: 'Control', display: 'Ctrl', pressed: false, row: 5, col: 6 },
  ],
];

export default function KeyboardTest({ onComplete }: KeyboardTestProps) {
  const [keys, setKeys] = useState<KeyboardKey[][]>(keyboardLayout);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isListening) return;
    
    const key = event.key;
    setPressedKeys(prev => new Set([...prev, key]));
    
    setKeys(prev => prev.map(row => 
      row.map(keyObj => 
        keyObj.key === key 
          ? { ...keyObj, pressed: true }
          : keyObj
      )
    ));
  }, [isListening]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (!isListening) return;
    
    const key = event.key;
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    
    setKeys(prev => prev.map(row => 
      row.map(keyObj => 
        keyObj.key === key 
          ? { ...keyObj, pressed: false }
          : keyObj
      )
    ));
  }, [isListening]);

  useEffect(() => {
    if (isListening) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening, handleKeyDown, handleKeyUp]);

  const startTest = () => {
    setIsListening(true);
    setPressedKeys(new Set());
    setKeys(keyboardLayout);
  };

  const stopTest = () => {
    setIsListening(false);
  };

  const resetTest = () => {
    setPressedKeys(new Set());
    setKeys(keyboardLayout);
    setTestPassed(null);
  };

  const handleTestResult = (passed: boolean) => {
    setTestPassed(passed);
    onComplete(passed);
  };

  const getKeyWidth = (key: KeyboardKey) => {
    if (key.key === 'Tab') return 'w-16';
    if (key.key === 'CapsLock') return 'w-20';
    if (key.key === 'Shift') return 'w-24';
    if (key.key === 'Enter') return 'w-20';
    if (key.key === 'Backspace') return 'w-20';
    if (key.key === ' ') return 'w-96'; // Space bar
    if (key.key === 'Control' || key.key === 'Alt' || key.key === 'Meta') return 'w-16';
    return 'w-12';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Keyboard Test
      </h2>
      <p className="text-gray-600 mb-6">
        Press keys on the keyboard to test functionality. Keys will light up when pressed.
      </p>

      <div className="space-y-6">
        {/* Test Controls */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Test Controls
          </h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={startTest}
              disabled={isListening}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Test
            </button>
            <button
              onClick={stopTest}
              disabled={!isListening}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Test
            </button>
            <button
              onClick={resetTest}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
          
          {isListening && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-blue-800 text-sm">
                <strong>Test Active:</strong> Press keys on the physical keyboard to test them.
              </p>
            </div>
          )}
        </div>

        {/* Keyboard Layout */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Keyboard Layout
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="space-y-1">
              {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-1">
                  {row.map((key, keyIndex) => (
                    <div
                      key={`${rowIndex}-${keyIndex}`}
                      className={`${getKeyWidth(key)} h-12 flex items-center justify-center text-xs font-medium rounded border-2 transition-all duration-150 ${
                        key.pressed
                          ? 'bg-green-500 text-white border-green-600 shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {key.display}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Test Results
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Keys Pressed: {pressedKeys.size}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Total Keys: {keys.flat().length}
              </p>
            </div>
          </div>

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
                placeholder="Any observations about keyboard functionality..."
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
                Keyboard Test Passed
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
                Keyboard Test Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

