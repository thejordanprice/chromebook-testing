# Chromebook Tester

A comprehensive Next.js web application for testing Chromebook functionality, built with TypeScript and Tailwind CSS.

## Features

- **Device Identification**: Input asset tag or serial number
- **Power Test**: Verify power and battery charging status
- **Connectivity Test**: Automatic internet connectivity testing
- **Keyboard Test**: Interactive keyboard layout with real-time key press detection
- **Sound Test**: Audio output verification with generated test tones
- **Display Test**: Full-screen display quality testing with multiple test patterns
- **Admin Panel**: View and manage test results with filtering and search
- **MongoDB Integration**: Store test results in MongoDB database

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or accessible via connection string)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chromebook-tester
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/chromebook-tester
```

4. Start MongoDB (if running locally):
```bash
# On Ubuntu/Debian
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# On Windows
net start MongoDB
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Running Tests

1. **Start Testing**: Enter the device identifier (asset tag or serial number) and optional tester name
2. **Power Test**: Verify power and battery charging status
3. **Connectivity Test**: Test internet connectivity automatically
4. **Keyboard Test**: Press keys on the physical keyboard to test functionality
5. **Sound Test**: Play test tones to verify audio output
6. **Display Test**: View full-screen test patterns to check display quality

### Admin Panel

Access the admin panel at `/admin` to:
- View all test results
- Filter by pass/fail status
- Search by identifier or tester name
- View detailed test statistics

## Test Components

### Power Test
- Uses Browser Battery API when available
- Manual verification of power status
- Notes field for additional observations

### Connectivity Test
- Tests multiple URLs automatically
- Measures response times
- Manual verification option
- Requires at least 2/4 URLs to pass

### Keyboard Test
- Interactive Chromebook keyboard layout
- Real-time key press detection
- Visual feedback for pressed keys
- Tracks pressed vs total keys

### Sound Test
- Generates test tones using Web Audio API
- 440Hz sine wave for 2 seconds
- Manual verification required
- Troubleshooting tips included

### Display Test
- Multiple test patterns (color, pixel, gradient)
- Full-screen mode support
- Dead pixel detection
- Color accuracy verification

## Database Schema

Test results are stored in MongoDB with the following structure:

```typescript
interface TestResult {
  _id?: string;
  identifier: string;
  timestamp: Date;
  powerTest: { passed: boolean; notes?: string };
  connectivityTest: { 
    passed: boolean; 
    testedUrls: string[]; 
    failedUrls: string[]; 
    notes?: string 
  };
  keyboardTest: { 
    passed: boolean; 
    pressedKeys: string[]; 
    missedKeys: string[]; 
    notes?: string 
  };
  soundTest: { passed: boolean; notes?: string };
  displayTest: { passed: boolean; notes?: string };
  overallPassed: boolean;
  testerName?: string;
  completedAt?: Date;
}
```

## API Endpoints

- `GET /api/tests` - Retrieve all test results
- `POST /api/tests` - Save new test result

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Database for storing test results
- **Web Audio API** - For generating test tones
- **Lucide React** - Icon library

## Browser Compatibility

- Chrome/Chromium (recommended for Chromebook testing)
- Firefox
- Safari
- Edge

## Development

To run in development mode:
```bash
npm run dev
```

To build for production:
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.