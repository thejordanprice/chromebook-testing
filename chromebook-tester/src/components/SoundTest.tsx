'use client';

import { useState, useRef } from 'react';
import { Volume2, CheckCircle, XCircle, Play, Pause } from 'lucide-react';

interface SoundTestProps {
  onComplete: (passed: boolean) => void;
}

export default function SoundTest({ onComplete }: SoundTestProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const playTestSound = () => {
    // Generate a test tone using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
    
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const stopTestSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleTestResult = (passed: boolean) => {
    setTestPassed(passed);
    onComplete(passed);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Sound Test
      </h2>
      <p className="text-gray-600 mb-6">
        Test the audio output by playing a test sound and verifying you can hear it.
      </p>

      <div className="space-y-6">
        {/* Audio Test */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Audio Test
          </h3>
          
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={playTestSound}
              disabled={isPlaying}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Play Test Sound
            </button>
            <button
              onClick={stopTestSound}
              disabled={!isPlaying}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Sound
            </button>
          </div>


          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> If you don't hear any sound, check that:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-700 text-sm">
              <li>Volume is turned up</li>
              <li>Audio is not muted</li>
              <li>Speakers/headphones are connected</li>
              <li>No other applications are using the audio</li>
            </ul>
          </div>
        </div>

        {/* Manual Verification */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Manual Verification
          </h3>
          <p className="text-gray-600 mb-4">
            Please verify the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Did you hear the test sound clearly?</li>
            <li>Was the sound quality good (no distortion)?</li>
            <li>Was the volume appropriate?</li>
            <li>Do both speakers work (if stereo)?</li>
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
                placeholder="Any observations about audio quality..."
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
                Sound Test Passed
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
                Sound Test Failed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
