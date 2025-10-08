# Chromebook Tester

A comprehensive web application for testing Chromebook functionality, built with Next.js 15, TypeScript, and MongoDB. This tool provides a systematic approach to testing various hardware components and features of Chromebook devices.

## 🚀 Features

### Core Testing Modules

- **Device Identification**: Asset tag and serial number tracking
- **Power & Battery Test**: Battery level monitoring and charging status verification
- **Connectivity Test**: Automated internet connectivity testing with multiple endpoints
- **Keyboard Test**: Interactive keyboard functionality testing with visual feedback
- **Sound Test**: Audio output testing with Web Audio API
- **Display Test**: Fullscreen display quality testing with multiple test patterns

### Admin Panel

- **Test Results Dashboard**: Comprehensive view of all test results
- **Search & Filter**: Find tests by identifier, tester name, or status
- **Statistics**: Pass/fail rates and test summaries
- **Detailed Results**: Individual test component status tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Deployment**: Docker with multi-stage builds
- **Development**: ESLint, Turbopack for fast builds

## 📋 Prerequisites

- Node.js 20 or higher
- MongoDB (local or cloud instance)
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chromebook-tester
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/chromebook-tester
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   
   # Or start your local MongoDB service
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Web app: [http://localhost:3000](http://localhost:3000)
   - MongoDB: `localhost:27017`

## 📁 Project Structure

```
chromebook-tester/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel page
│   │   ├── api/               # API routes
│   │   │   └── tests/         # Test results API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main testing page
│   ├── components/            # React components
│   │   ├── ConnectivityTest.tsx
│   │   ├── DisplayTest.tsx
│   │   ├── KeyboardTest.tsx
│   │   ├── PowerTest.tsx
│   │   └── SoundTest.tsx
│   ├── lib/                   # Utility libraries
│   │   └── mongodb.ts         # Database connection
│   └── types/                 # TypeScript definitions
│       └── test.ts            # Test-related types
├── public/                    # Static assets
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Multi-stage Docker build
└── package.json              # Dependencies and scripts
```

## 🧪 Testing Workflow

### 1. Device Identification
- Enter asset tag or serial number
- Optional tester name for tracking

### 2. Power & Battery Test
- Automatic battery level detection via Web Battery API
- Manual verification of charging status
- Notes for additional observations

### 3. Connectivity Test
- Automated testing of multiple endpoints:
  - Google.com
  - Cloudflare.com
  - GitHub.com
  - HTTPBin.org
- Manual verification checklist
- Pass criteria: At least 2/4 endpoints successful

### 4. Keyboard Test
- Interactive keyboard layout visualization
- Real-time key press detection
- Visual feedback for pressed keys
- Comprehensive Chromebook keyboard layout

### 5. Sound Test
- Web Audio API test tone generation
- 440Hz sine wave test sound
- Manual verification of audio quality

### 6. Display Test
- Fullscreen test patterns:
  - Color uniformity test
  - Pixel grid test
  - Gradient test
- Dead pixel detection
- Brightness consistency verification

## 🗄️ Database Schema

### TestResult Collection
```typescript
interface TestResult {
  _id?: string;
  identifier: string;           // Asset tag or serial number
  timestamp: Date;
  testerName?: string;
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
  completedAt?: Date;
}
```

## 🔧 API Endpoints

### POST `/api/tests`
Save a new test result to the database.

**Request Body**: `TestResult` object
**Response**: `{ success: boolean, id: string }`

### GET `/api/tests`
Retrieve all test results, sorted by timestamp (newest first).

**Response**: Array of `TestResult` objects

## 🐳 Docker Configuration

The application includes a multi-stage Docker build optimized for production:

- **Stage 1 (deps)**: Install dependencies only
- **Stage 2 (builder)**: Build the Next.js application
- **Stage 3 (runner)**: Production runtime with non-root user

### Docker Compose Services

- **web**: Next.js application (port 3000)
- **mongo**: MongoDB database (port 27017)
- **Persistent volume**: `mongo_data` for database persistence

## 🎨 UI/UX Features

- **Responsive Design**: Works on various screen sizes
- **Progress Tracking**: Visual progress bar and step indicators
- **Real-time Feedback**: Live updates during tests
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Modern Interface**: Clean, professional design with Tailwind CSS

## 🔒 Security Considerations

- Non-root Docker user for production
- Environment variable configuration
- Input validation and sanitization
- CORS handling for connectivity tests

## 🚀 Deployment Options

### Production Deployment

1. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://your-mongo-uri
   PORT=3000
   ```

2. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

3. **Docker Production**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## 📊 Browser Compatibility

- **Chrome/Chromium**: Full support (primary target)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

**Note**: Some features (like Web Battery API) may have limited support in certain browsers.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in environment variables
   - Ensure network connectivity

2. **Audio Test Not Working**
   - Check browser audio permissions
   - Verify system volume settings
   - Try different browser

3. **Fullscreen Display Test Issues**
   - Ensure browser supports Fullscreen API
   - Check for browser security restrictions
   - Try different browser

4. **Keyboard Test Not Detecting Keys**
   - Ensure focus is on the page
   - Check for browser extensions blocking events
   - Try refreshing the page

### Development Issues

1. **Build Errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**
   ```bash
   npm run lint
   ```

3. **Docker Issues**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

## 📞 Support

For issues, questions, or contributions, please:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for Chromebook testing and quality assurance**
