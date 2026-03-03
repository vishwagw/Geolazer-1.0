/**
 * Geopolitical Data Aggregator
 * Collects data from multiple sources including news APIs, conflict databases, and market APIs
 */
interface AggregatedData {
    timestamp: Date;
    sources: string[];
    events: any[];
    heatmapData: any;
    marketReactions: any;
    alerts: any[];
}
declare class GeopoliticalDataAggregator {
    private sources;
    private cache;
    constructor();
    private initializeSources;
    fetchFromNewsAPI(): Promise<any[]>;
    fetchFromACLED(): Promise<any[]>;
    fetchMarketData(): Promise<any>;
    aggregateAllData(): Promise<AggregatedData>;
    private parseEvents;
    private generateHeatmapData;
    private generateAlerts;
    getLatestData(): AggregatedData | null;
}
export { GeopoliticalDataAggregator, AggregatedData };
//# sourceMappingURL=aggregator.d.ts.map