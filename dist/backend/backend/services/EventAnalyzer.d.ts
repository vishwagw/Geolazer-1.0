/**
 * Event Analyzer Service
 * Analyzes and categorizes geopolitical events
 */
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
declare class EventAnalyzer {
    private eventKeywords;
    analyzeEvent(rawData: any): GeopoliticalEvent;
    private classifyEventType;
    private assessSeverity;
    private extractLocation;
    private extractAffectedCountries;
    private analyzeImplications;
    private analyzeEconomicImplications;
    private analyzeMilitaryImplications;
    private analyzeDiplomaticImplications;
    private generateId;
}
export { EventAnalyzer, GeopoliticalEvent };
//# sourceMappingURL=EventAnalyzer.d.ts.map