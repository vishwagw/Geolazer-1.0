"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
const PORT = process.env.BACKEND_PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.get('/api/geopolitical/events', (req, res) => {
    // This will be replaced with actual data pipeline logic
    res.json({
        events: [],
        total: 0,
        timestamp: new Date().toISOString(),
    });
});
app.get('/api/geopolitical/heatmap', (req, res) => {
    // Heat map data
    res.json({
        regions: [],
        severity: {},
        updated: new Date().toISOString(),
    });
});
app.get('/api/markets/reactions', (req, res) => {
    // Stock market data
    res.json({
        reactions: [],
        indices: {},
        updated: new Date().toISOString(),
    });
});
app.get('/api/alerts', (req, res) => {
    // Active alerts
    res.json({
        alerts: [],
        critical: 0,
        warning: 0,
    });
});
// WebSocket events for real-time updates
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('subscribe-events', (filter) => {
        console.log(`Client subscribed to events with filter:`, filter);
        // Subscribe logic here
    });
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});
// Error handling
app.use((err, req, res) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});
// Start server
server.listen(PORT, () => {
    console.log(`🚀 Geolazer Backend Server running on port ${PORT}`);
    console.log(`📡 WebSocket events enabled`);
    console.log(`🌍 Ready to aggregate geopolitical data`);
});
//# sourceMappingURL=server.js.map