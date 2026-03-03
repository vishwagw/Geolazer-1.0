"use strict";
/**
 * Event Analyzer Service
 * Analyzes and categorizes geopolitical events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAnalyzer = void 0;
class EventAnalyzer {
    constructor() {
        this.eventKeywords = {
            conflict: [
                'war',
                'military',
                'attack',
                'bomb',
                'missile',
                'artillery',
                'siege',
            ],
            diplomatic: [
                'sanction',
                'embargo',
                'agreement',
                'treaty',
                'negotiation',
                'diplomat',
            ],
            economic: ['trade', 'tariff', 'export', 'import', 'market', 'currency'],
            environmental: ['climate', 'disaster', 'flood', 'drought', 'pollution'],
        };
    }
    analyzeEvent(rawData) {
        const type = this.classifyEventType(rawData.title + ' ' + rawData.description);
        const severity = this.assessSeverity(rawData, type);
        return {
            id: rawData.id || this.generateId(),
            title: rawData.title,
            description: rawData.description || '',
            type,
            severity,
            location: this.extractLocation(rawData),
            timestamp: new Date(rawData.timestamp || Date.now()),
            sources: rawData.sources || [],
            affectedCountries: this.extractAffectedCountries(rawData),
            implications: this.analyzeImplications(rawData, type),
        };
    }
    classifyEventType(text) {
        const lowerText = text.toLowerCase();
        for (const [type, keywords] of Object.entries(this.eventKeywords)) {
            if (keywords.some((keyword) => lowerText.includes(keyword))) {
                return type;
            }
        }
        return 'other';
    }
    assessSeverity(data, type) {
        // Severity assessment logic
        let score = 0;
        if (data.fatalities && data.fatalities > 0) {
            score += Math.min(data.fatalities / 10, 40);
        }
        if (type === 'conflict')
            score += 30;
        if (data.isCrossboarder)
            score += 20;
        if (data.involvesNuclearPower)
            score += 25;
        if (score >= 75)
            return 'critical';
        if (score >= 50)
            return 'high';
        if (score >= 25)
            return 'medium';
        return 'low';
    }
    extractLocation(data) {
        return {
            country: data.country || 'Unknown',
            region: data.region || '',
            coordinates: data.coordinates || [0, 0],
        };
    }
    extractAffectedCountries(data) {
        return data.affectedCountries || [];
    }
    analyzeImplications(data, type) {
        return {
            economic: this.analyzeEconomicImplications(data, type),
            military: this.analyzeMilitaryImplications(data, type),
            diplomatic: this.analyzeDiplomaticImplications(data, type),
        };
    }
    analyzeEconomicImplications(data, type) {
        const implications = [];
        if (type === 'conflict') {
            implications.push('Supply chain disruptions');
            implications.push('Energy price volatility');
        }
        if (type === 'economic') {
            implications.push('Trade flow impacts');
            implications.push('Currency fluctuations');
        }
        return implications;
    }
    analyzeMilitaryImplications(data, type) {
        const implications = [];
        if (type === 'conflict') {
            implications.push('Increased military deployment');
            implications.push('Regional arms race potential');
        }
        return implications;
    }
    analyzeDiplomaticImplications(data, type) {
        const implications = [];
        if (type === 'diplomatic' || type === 'conflict') {
            implications.push('International relations strain');
            implications.push('Potential UN involvement');
        }
        return implications;
    }
    generateId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.EventAnalyzer = EventAnalyzer;
//# sourceMappingURL=EventAnalyzer.js.map