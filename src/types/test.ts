export interface TestResult {
  _id?: string;
  identifier: string; // Asset tag or serial number
  timestamp: Date;
  powerTest: {
    passed: boolean;
    notes?: string;
  };
  connectivityTest: {
    passed: boolean;
    testedUrls: string[];
    failedUrls: string[];
    notes?: string;
  };
  keyboardTest: {
    passed: boolean;
    pressedKeys: string[];
    missedKeys: string[];
    notes?: string;
  };
  soundTest: {
    passed: boolean;
    notes?: string;
  };
  displayTest: {
    passed: boolean;
    notes?: string;
  };
  overallPassed: boolean;
  testerName?: string;
  completedAt?: Date;
}

export interface TestStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  passed?: boolean;
}

export interface KeyboardKey {
  key: string;
  display: string;
  pressed: boolean;
  row: number;
  col: number;
}

