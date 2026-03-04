# Geolazer Technical Architecture

## System Overview

Geolazer is a sophisticated Electron-based desktop application for real-time geopolitical intelligence and predictive analytics. It combines a React frontend, Node.js backend, and multi-source data aggregation pipeline.

## Architecture Layers

### 1. Presentation Layer (React + Tailwind CSS)

**Technology Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Leaflet for interactive mapping

**Key Components:**

#### Dashboard (`src/renderer/src/pages/Dashboard.tsx`)
Central hub displaying:
- Interactive heat map
- Real-time alerts
- Market reactions
- Event timeline
- Predictive analytics
- Live video feeds

#### MapComponent (`src/renderer/src/components/MapComponent.tsx`)
- Uses Leaflet library for map rendering
- Circle markers for event severity (red = critical, orange = warning)
- Interactive popups on marker click
- Legend for severity levels
- Global view centered at [20°, 0°] with zoom level 2

#### AlertPanel (`src/renderer/src/components/AlertPanel.tsx`)
- Displays alerts sorted by severity
- Color-coded severity indicators
- Timestamp for each alert
- Limit to top 10 most critical alerts

#### MarketReactionsPanel (`src/renderer/src/components/MarketReactionsPanel.tsx`)
- Real-time market data visualization
- Tracks VIX, Gold, USD Index
- Recharts line graph for trends
- Shows percentage change (+ positive, - negative)

#### EventsTimeline (`src/renderer/src/components/EventsTimeline.tsx`)
- Chronological feed of recent events
- Visual timeline with icons
- Event categorization (conflict, diplomatic, economic, environmental)
- Emoji indicators for each type

### 2. Application Layer (Custom Hooks)

**useGeopoliticalData Hook** (`src/renderer/src/hooks/useGeopoliticalData.ts`)
- Fetches data from all backend endpoints in parallel
- Implements automatic 5-minute refresh interval
- Error handling and loading states
- Aggregates: events, heatmap data, market reactions, alerts

```typescript
Interface GeopoliticalDataResponse {
  events: any[];
  heatmapData: any;
  marketReactions: any;
  alerts: any[];
  predictions?: any[];
}
```

### 3. Backend Service Layer (Express + TypeScript)

**Technology Stack:**
- Express.js for REST API
- Socket.IO for real-time WebSocket updates
- TypeScript strict mode

**Server Configuration** (`src/backend/server.ts`)

```
PORT: 5000
CORS: Enabled for localhost:3000
WebSocket: Socket.IO enabled
```

**API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server health check |
| `/api/geopolitical/events` | GET | Current geopolitical events |
| `/api/geopolitical/heatmap` | GET | Regional intensity heatmap |
| `/api/markets/reactions` | GET | Market reactions to events |
| `/api/alerts` | GET | Active critical alerts |

**WebSocket Events:**
- `connection` - Client connects
- `subscribe-events` - Subscribe to event updates with filters
- `disconnect` - Client disconnects

### 4. Data Processing Layer

#### GeopoliticalDataAggregator (`src/backend/data-pipeline/aggregator.ts`)

Orchestrates data from multiple sources:

```
News Data (NewsAPI)
  ↓
├─→ Parse Articles
├─→ Extract Events
└─→ Categorize by Severity
      ↓
Conflict Data (ACLED)
  ↓
├─→ Extract Locations
├─→ Calculate Intensity
└─→ Assess Severity
      ↓
Market Data (Alpha Vantage)
  ↓
├─→ Fetch VIX
├─→ Fetch Gold
└─→ Fetch USD Index
      ↓
[AGGREGATED RESPONSE]
```

**Data Sources:**

| Source | Type | Frequency | Key Fields |
|--------|------|-----------|-----------|
| NewsAPI | News headlines | 5min | title, source, url, publishedAt |
| ACLED | Conflict events | 1hr | event_type, location, fatalities, coordinates |
| AlphaVantage | Market indices | 15min | VIX, GOLD, USDINDEX |

**Aggregator Methods:**
- `fetchFromNewsAPI()` - Gathers global news
- `fetchFromACLED()` - Gets conflict/political data
- `fetchMarketData()` - Retrieves economic indicators
- `aggregateAllData()` - Combines all sources
- `getLatestData()` - Returns cached data

#### EventAnalyzer Service (`src/backend/services/EventAnalyzer.ts`)

Analyzes and classifies events:

**Event Classification:**
- `conflict` - Military/warfare events
- `diplomatic` - International relations
- `economic` - Trade/financial events
- `environmental` - Climate/disasters
- `other` - Uncategorized

**Severity Assessment Algorithm:**
```
Score = Base
if fatalities > 0: Score += min(fatalities/10, 40)
if type == conflict: Score += 30
if cross-border: Score += 20
if nuclear power involved: Score += 25

Severity = 
  score >= 75: "critical"
  score >= 50: "high"
  score >= 25: "medium"
  score < 25: "low"
```

**Implications Analysis:**
- Economic impacts (supply chain, prices)
- Military implications (deployments, escalation)
- Diplomatic consequences (relations, UN involvement)

### 5. Desktop Integration Layer (Electron)

**Main Process** (`src/main/main.ts`)

Handles:
- Window creation and lifecycle
- Menu system
- Native system integration
- Dev tools configuration

**Window Configuration:**
```
Width: 1400px
Height: 900px
Min Width: 800px
Min Height: 600px
Development Mode: Dev tools enabled
Production Mode: Uses build folder
```

**Preload Script** (`src/main/preload.ts`)

Secure IPC bridge between Electron main and renderer:

```typescript
methods exposed:
  - getDataPipelineStatus()
  - fetchGeopoliticalData(filters)
  - onDataUpdate(callback)
  - onAlertReceived(callback)
  - Event listeners for real-time updates
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (External)                  │
│  NewsAPI | ACLED | AlphaVantage | Mapbox | YouTube          │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│              DATA AGGREGATION PIPELINE               │
│  ┌────────────────────────────────────────────────┐  │
│  │  GeopoliticalDataAggregator                    │  │
│  │  - fetchFromNewsAPI()                         │  │
│  │  - fetchFromACLED()                           │  │
│  │  - fetchMarketData()                          │  │
│  │  - aggregateAllData()                         │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│              DATA PROCESSING LAYER                   │
│  ┌────────────────────────────────────────────────┐  │
│  │  EventAnalyzer Service                        │  │
│  │  - classifyEventType()                        │  │
│  │  - assessSeverity()                           │  │
│  │  - analyzeImplications()                      │  │
│  │  - extractLocation()                          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│              EXPRESS BACKEND SERVER                  │
│  ┌────────────────────────────────────────────────┐  │
│  │  REST API Endpoints                           │  │
│  │  /api/geopolitical/events                     │  │
│  │  /api/geopolitical/heatmap                    │  │
│  │  /api/markets/reactions                       │  │
│  │  /api/alerts                                  │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  WebSocket (Socket.IO) Server                 │  │
│  │  - Real-time event broadcasts                 │  │
│  │  - Alert push notifications                   │  │
│  │  - Market update streams                      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
         ↙                        ↘
    [HTTP]                   [WebSocket]
       ↙                        ↘
┌──────────────────────────────────────────────────────┐
│          ELECTRON (Main Process)                     │
│  - Window management                                │
│  - IPC handling                                     │
│  - System integration                               │
└──────────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────────┐
│      REACT FRONTEND (Renderer Process)               │
│  ┌────────────────────────────────────────────────┐  │
│  │  Custom Hooks (useGeopoliticalData)           │  │
│  │  - Fetch aggregated data from backend         │  │
│  │  - Subscribe to WebSocket updates             │  │
│  │  - RefreshData every 5 minutes                │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Dashboard Components                         │  │
│  │  ├─ MapComponent (Leaflet)                    │  │
│  │  ├─ AlertPanel                                │  │
│  │  ├─ MarketReactionsPanel (Recharts)           │  │
│  │  ├─ EventsTimeline                            │  │
│  │  ├─ PredictionsPanel                          │  │
│  │  └─ VideoPanel                                │  │
│  └────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │  Styling (Tailwind CSS)                       │  │
│  │  - Dark theme                                 │  │
│  │  - Responsive layouts                         │  │
│  │  - Custom animations                          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────────────┐
│      USER INTERFACE (Interactive Dashboard)          │
│  - Real-time geopolitical intelligence              │
│  - Interactive heat maps                             │
│  - Market reaction charts                            │
│  - Event timeline feed                               │
│  - Critical alerts                                   │
│  - Predictive forecasts                              │
│  - Live video feeds                                  │
└──────────────────────────────────────────────────────┘
```

## TypeScript Interfaces

### GeopoliticalEvent
```typescript
interface GeopoliticalEvent {
  id: string;
  title: string;
  description: string;
  type: 'conflict' | 'diplomatic' | 'economic' | 'environmental' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    country: string;
    region: string;
    coordinates: [number, number];
  };
  timestamp: Date;
  sources: string[];
  affectedCountries: string[];
  implications: {
    economic: string[];
    military: string[];
    diplomatic: string[];
  };
}
```

### AggregatedData
```typescript
interface AggregatedData {
  timestamp: Date;
  sources: string[];
  events: any[];
  heatmapData: any;
  marketReactions: any;
  alerts: any[];
}
```

## Performance Optimization

### Frontend
- Lazy loading of components
- Memoization of expensive calculations
- Virtual scrolling for large event lists
- WebSocket for real-time updates instead of polling

### Backend
- Data caching with TTL
- Parallel API requests
- Connection pooling for databases
- Throttling of real-time broadcasts

### Build
- Tree shaking unused code
- Code splitting by route
- Asset minification
- Electron builder optimizations

## Security Architecture

### Process Security
- **Context Isolation**: Enabled in BrowserWindow
- **Preload Script**: Sanitized IPC bridge
- **Node Integration**: Disabled in renderer
- **Sandbox**: Renderer runs in sandbox

### Data Security
- Environment variables for sensitive keys
- HTTPS ready (can be enabled in production)
- Input validation on all endpoints
- CORS restricted to localhost in development

### Network Security
- API rate limiting (to be implemented)
- Request validation (to be implemented)
- CSRF protection (to be implemented)

## Error Handling Strategy

### Frontend
- Try-catch blocks in data fetching hook
- Fallback UI when data unavailable
- Error toast notifications (to be implemented)
- Graceful degradation for failed components

### Backend
- Express error middleware
- Proper HTTP status codes
- Detailed error logging
- Circuit breaker for external APIs

## Extension Points

### Adding New Data Sources
1. Extend `GeopoliticalDataAggregator`
2. Add new `fetchFrom*()` method
3. Call method in `aggregateAllData()`
4. Update response interface

### Adding New Components
1. Create component in `src/renderer/src/components/`
2. Create corresponding CSS in `src/renderer/src/styles/`
3. Import in Dashboard.tsx
4. Add to grid layout

### Adding New API Endpoints
1. Create route in backend server
2. Add to Express app
3. Document in README
4. Access from frontend via axios

## Monitoring & Logging

### Frontend Logging
- Console logs for development
- Error tracking (to be implemented)

### Backend Logging
- Winston logger (to be implemented)
- Request logging middleware
- Error logging to file

### Performance Monitoring
- React DevTools profiler
- Electron performance profiler
- API response time tracking

## Future Enhancements

- [ ] Machine learning predictions
- [ ] Persistent database (MongoDB)
- [ ] User authentication
- [ ] Custom alert subscriptions
- [ ] Data export functionality
- [ ] Multi-user collaboration
- [ ] Mobile app version
- [ ] Advanced filtering & search
- [ ] Historical data analysis
- [ ] Integration with more data sources

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026  
**Architecture**: Electron + React + Express + TypeScript
