import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { TestResult } from '@/types/test';
import type { Document } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const testResult: TestResult = await request.json();
    
    const db = await getDatabase();
    type WithoutId = Omit<TestResult, '_id'>;
    const collection = db.collection<WithoutId>('testResults');
    
    // Create a copy, remove any incoming _id, and insert
    const copy: Record<string, unknown> = { ...(testResult as unknown as Record<string, unknown>) };
    delete copy._id;
    const toInsert = copy as WithoutId;

    const result = await collection.insertOne({
      ...toInsert,
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
    
    const tests = (await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()) as Document[];

    // Convert ObjectId to string for client consumption
    const normalized = tests.map((doc) => ({
      ...doc,
      _id: doc._id != null ? String(doc._id) : doc._id,
    }));
    
    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Error fetching test results:', error);
    
    // Return empty array instead of error object to prevent frontend crashes
    return NextResponse.json([]);
  }
}

