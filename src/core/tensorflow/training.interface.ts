import { SunlightRequirement } from "../../features/indoor-plants/interfaces/indoor-plant.interface";
import { PlantSymptoms } from "../kindwise/kindwise.interface";

export interface MLPrediction {
    healthScore: number; // 0-1 scale
    symptomProbabilities: Map<PlantSymptoms, number>;
    optimalAdjustments: {
        waterVolume: number;
        wateringInterval: number;
        sunlight: SunlightRequirement;
        nutritionMultiplier: number;
    };
    confidence: number; // 0-1 scale
    riskFactors: string[];
}

export interface TrainingData {
    inputs: number[]; // Normalized care parameters + environmental factors
    outputs: number[]; // Health outcomes + symptom occurrences
    timestamp: number;
    plantId: string;
}