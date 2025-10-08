'use client';

import { useState, useEffect } from 'react';
import { TestResult } from '@/types/test';
import { CheckCircle, XCircle, Calendar, Search } from 'lucide-react';

export default function AdminPanel() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Ensure data is an array before setting it
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      // Set empty array on error to prevent filter issues
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'passed' && test.overallPassed) ||
                         (filterStatus === 'failed' && !test.overallPassed);
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusText = (passed: boolean) => {
    return passed ? 'Passed' : 'Failed';
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Test Results Admin Panel
        </h1>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by identifier or tester name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'all'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              All Tests
            </button>
            <button
              onClick={() => setFilterStatus('passed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'passed'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Passed
            </button>
            <button
              onClick={() => setFilterStatus('failed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filterStatus === 'failed'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Failed
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
            <div className="text-sm text-blue-800">Total Tests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tests.filter(t => t.overallPassed).length}
            </div>
            <div className="text-sm text-green-800">Passed</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {tests.filter(t => !t.overallPassed).length}
            </div>
            <div className="text-sm text-red-800">Failed</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {tests.length > 0 ? Math.round((tests.filter(t => t.overallPassed).length / tests.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-800">Pass Rate</div>
          </div>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Test Results ({filteredTests.length})
          </h2>
        </div>
        
        {filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No test results found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {test.identifier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.testerName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(test.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.overallPassed)}`}>
                        {getStatusIcon(test.overallPassed)}
                        <span className="ml-1">{getStatusText(test.overallPassed)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          {getStatusIcon(test.powerTest.passed)}
                          <span className="ml-1 text-xs">Power</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(test.connectivityTest.passed)}
                          <span className="ml-1 text-xs">Network</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(test.keyboardTest.passed)}
                          <span className="ml-1 text-xs">Keyboard</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(test.soundTest.passed)}
                          <span className="ml-1 text-xs">Sound</span>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(test.displayTest.passed)}
                          <span className="ml-1 text-xs">Display</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

