"use strict";
/**
 * Geopolitical Data Aggregator
 * Collects data from multiple sources including news APIs, conflict databases, and market APIs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeopoliticalDataAggregator = void 0;
const axios_1 = __importDefault(require("axios"));
class GeopoliticalDataAggregator {
    constructor() {
        this.sources = [];
        this.cache = new Map();
        this.initializeSources();
    }
    initializeSources() {
        this.sources = [
            {
                name: 'NewsAPI',
                url: 'https://newsapi.org/v2/everything',
                apiKey: process.env.NEWSAPI_KEY,
                frequency: '5min',
            },
            {
                name: 'ACLED',
                url: 'https://api.acleddata.com/api/v1/events',
                frequency: '1hr',
            },
            {
                name: 'AlphaVantage',
                url: 'https://www.alphavantage.co/query',
                apiKey: process.env.ALPHA_VANTAGE_KEY,
                frequency: '15min',
            },
        ];
    }
    async fetchFromNewsAPI() {
        try {
            const keywords = [
                'geopolitical',
                'conflict',
                'war',
                'airspace closure',
                'sanctions',
            ];
            const results = [];
            for (const keyword of keywords) {
                const response = await axios_1.default.get('https://newsapi.org/v2/everything', {
                    params: {
                        q: keyword,
                        sortBy: 'publishedAt',
                        apiKey: process.env.NEWSAPI_KEY,
                    },
                });
                results.push(...response.data.articles);
            }
            return results;
        }
        catch (error) {
            console.error('Error fetching from NewsAPI:', error);
            return [];
        }
    }
    async fetchFromACLED() {
        try {
            const response = await axios_1.default.get('https://api.acleddata.com/api/v1/events', {
                params: {
                    limit: 1000,
                    ordering: '-event_date',
                },
            });
            return response.data.results;
        }
        catch (error) {
            console.error('Error fetching from ACLED:', error);
            return [];
        }
    }
    async fetchMarketData() {
        try {
            // Fetch major indices that react to geopolitical events
            const indices = ['VIX', 'GOLD', 'USDINDEX'];
            const marketData = {};
            for (const symbol of indices) {
                const response = await axios_1.default.get('https://www.alphavantage.co/query', {
                    params: {
                        function: 'GLOBAL_QUOTE',
                        symbol,
                        apikey: process.env.ALPHA_VANTAGE_KEY,
                    },
                });
                marketData[symbol] = response.data['Global Quote'];
            }
            return marketData;
        }
        catch (error) {
            console.error('Error fetching market data:', error);
            return {};
        }
    }
    async aggregateAllData() {
        console.log('Starting data aggregation...');
        const [newsData, acledData, marketData] = await Promise.all([
            this.fetchFromNewsAPI(),
            this.fetchFromACLED(),
            this.fetchMarketData(),
        ]);
        const aggregated = {
            timestamp: new Date(),
            sources: ['NewsAPI', 'ACLED', 'AlphaVantage'],
            events: this.parseEvents(newsData, acledData),
            heatmapData: this.generateHeatmapData(acledData),
            marketReactions: marketData,
            alerts: this.generateAlerts(acledData),
        };
        // Cache the results
        this.cache.set('latest', aggregated);
        return aggregated;
    }
    parseEvents(newsData, acledData) {
        // Parse and structure event data
        return [
            ...newsData.map((article) => ({
                type: 'news',
                title: article.title,
                source: article.source.name,
                url: article.url,
                published: article.publishedAt,
            })),
            ...acledData.map((event) => ({
                type: 'conflict',
                title: event.event_type,
                location: event.admin1,
                date: event.event_date,
                fatalities: event.fatalities,
            })),
        ];
    }
    generateHeatmapData(acledData) {
        // Generate heat map intensity data by region
        const regionIntensity = {};
        acledData.forEach((event) => {
            const region = event.admin1;
            regionIntensity[region] = (regionIntensity[region] || 0) + 1;
        });
        return regionIntensity;
    }
    generateAlerts(acledData) {
        // Generate critical alerts based on event severity
        return acledData
            .filter((event) => event.fatalities > 10 || event.event_type === 'Violence')
            .map((event) => ({
            severity: event.fatalities > 50 ? 'critical' : 'warning',
            title: `${event.event_type} in ${event.admin1}`,
            timestamp: event.event_date,
            location: {
                lat: event.latitude,
                lng: event.longitude,
            },
        }));
    }
    getLatestData() {
        return this.cache.get('latest') || null;
    }
}
exports.GeopoliticalDataAggregator = GeopoliticalDataAggregator;
//# sourceMappingURL=aggregator.js.map