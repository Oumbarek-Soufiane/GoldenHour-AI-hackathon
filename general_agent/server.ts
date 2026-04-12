/**
 * General agent — server entry point.
 *
 * Starts an Express server that implements the full A2A protocol:
 *
 *   GET  /.well-known/agent-card.json   Public — always open  ← KEY ENDPOINT
 *   POST /                              A2A JSON-RPC (no auth required here)
 *
 * This is the TypeScript equivalent of general_agent/__main__.py.
 *
 * Run:
 *   npm run dev:general
 *   # → Server live at http://localhost:8002
 *   # → Agent card: GET http://localhost:8002/.well-known/agent-card.json
 */

import 'dotenv/config';

import { createA2aApp } from '../shared/appFactory.js';
import { rootAgent } from './agent.js';

const PORT = Number(process.env['PORT'] ?? 8002);
const URL = process.env['GENERAL_AGENT_URL'] ?? `http://localhost:${PORT}`;

const app = createA2aApp({
    agent: rootAgent,
    name: 'General Agent',
    description: " General utility agent — date/time queries and ICD-10-CM code lookups. A clinical assistant that queries a patient's FHIR health record to answer "+
         "questions about demographics, active medications, conditions, and observations, and golden hours, availability rooms, care plan ",
    url: URL,
    version: '2.0.0',
    requireApiKey: false,
      // Authenticated — callers must send X-API-Key
   skills: [
    {
        id: "skill-triage-priority", // Required by SDK
        name: "Clinical Triage & Prioritization",
        description: "Calculates acuity tier and priority scores for incoming patients.",
        tags: ["clinical", "triage", "scoring"] // Required by SDK
    },
    {
        id: "skill-golden-hour", 
        name: "Golden Hour Calculation",
        description: "Calculates the exact remaining intervention window based on symptom onset and current time.",
        tags: ["time-critical", "calculation", "emergency"] 
    },
    {
        id: "skill-demographics", 
        name: "Demographics Extraction",
        description: "Extracts comprehensive patient profile, identifying details, and demographic information.",
        tags: ["demographics", "patient", "profile"] 
    },
    {
        id: "skill-active-conditions", 
        name: "Active Medical Conditions",
        description: "Retrieves and structures the patient's current active diagnoses and conditions.",
        tags: ["conditions", "diagnosis", "clinical"] 
    },
    {
        id: "skill-medications", 
        name: "Medication Review",
        description: "Pulls active medication lists and flags missing or overdue meds.",
        tags: ["medications", "pharmacy", "fhir"] 
    },
    {
        id: "skill-care-plan", 
        name: "Care Plan & Goals",
        description: "Identifies established clinical care plans, overarching care goals, and flags missing care gaps.",
        tags: ["care-plan", "goals", "gaps"] 
    },
    {
        id: "skill-room-availability", 
        name: "Room Availability & Logistics",
        description: "Queries the live hospital census to route patients to available, unoccupied rooms matching their tier.",
        tags: ["logistics", "fhir", "beds"] 
    }
]
});

app.listen(PORT, () => {
    console.info(`general_agent running on port ${PORT}`);
    console.info(`Agent card: GET http://localhost:${PORT}/.well-known/agent-card.json`);
    console.info(`A2A endpoint: POST http://localhost:${PORT}/`);
});
