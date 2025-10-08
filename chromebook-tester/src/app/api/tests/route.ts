import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { TestResult } from '@/types/test';

export async function POST(request: NextRequest) {
  try {
    const testResult: TestResult = await request.json();
    
    const db = await getDatabase();
    const collection = db.collection('testResults');
    
    const result = await collection.insertOne({
      ...testResult,
      timestamp: new Date(),
    });
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Failed to save test result' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('testResults');
    
    const tests = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results' },
      { status: 500 }
    );
  }
}

