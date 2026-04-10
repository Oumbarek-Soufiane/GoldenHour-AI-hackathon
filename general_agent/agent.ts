/**
 * General agent — ADK agent definition.
 *
 * TypeScript equivalent of general_agent/agent.py.
 *
 * This is a public agent (requireApiKey: false) for general utility queries:
 *   • Current date/time in any timezone
 *   • ICD-10-CM code lookups
 *
 * No FHIR context, no beforeModelCallback — the simplest possible example.
 */

import '../shared/env.js';

import { LlmAgent } from '@google/adk';
import { getCurrentDatetime, lookUpIcd10 } from './tools/general.js';

import {
    computePriorityScore,
    getGoldenHourStatus,
    detectDeteriorationTrend,
    getCareGaps,
    rankMultiPatientQueue,
    generateTriageSummary,
    getAvailableRooms,
    getCrisisInsights
} from '../shared/tools/index.js';

export const rootAgent = new LlmAgent({
    name: 'general_agent',
    model: 'gemini-3.1-flash-lite-preview',
    description:
        'General utility agent — provides current date/time and ICD-10-CM code lookups and other services .',
    instruction: `You are the GoldenHour AI Super Agent, an elite medical logistics and triage assistant. 

You have two main categories of capabilities:

1. GENERAL UTILITY:
• When asked for the current date or time, call 'getCurrentDatetime' with the appropriate timezone.
• When asked for medical billing/diagnostic codes, call 'lookUpIcd10'.

2. CLINICAL TRIAGE & LOGISTICS (The GoldenHour Protocol):
When a user provides clinical data or asks for a triage handover, you MUST follow this protocol using your tools:
• Step 1: Use 'computePriorityScore' or 'detectDeteriorationTrend' to assess the patient's acuity and determine their Tier (1-4).
• Step 2: Use 'getGoldenHourStatus' to calculate remaining time windows for critical patients (e.g., STEMI, Stroke, Sepsis).
• Step 3: Use 'getCareGaps' to identify any missing life-saving medications or overdue labs.
• Step 4: Use 'getAvailableRooms' to query the FHIR database and find an unoccupied bay that matches the patient's Tier.
• Step 5: Use 'getCrisisInsights' to generate a revenue-protecting billing code insight and a burnout-reducing handover statement.
• Step 6: Compile all of this data using 'generateTriageSummary' to create a final, structured JSON or Markdown dashboard.

Always be concise, authoritative, and clinical in your tone. Never hallucinate bed numbers or clinical scores; ALWAYS rely strictly on the data returned by your tools.`,
    
    // Combined  tools 
    tools: [
        getCurrentDatetime, 
        lookUpIcd10,
        computePriorityScore,
        getGoldenHourStatus,
        detectDeteriorationTrend,
        getCareGaps,
        rankMultiPatientQueue,
        generateTriageSummary,
        getAvailableRooms,
        getCrisisInsights
    ],
});
