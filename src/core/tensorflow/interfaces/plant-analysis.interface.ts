import { SunlightRequirement, SoilType, PlantNutrition } from "../../../features/indoor-plants/interfaces/indoor-plant.interface";
import { PlantSymptoms } from "../../kindwise/kindwise.interface";

export interface AnalysisResult {
    waterAnalysis: WaterAnalysis;
    sunlightAnalysis: SunlightAnalysis;
    soilAnalysis: SoilAnalysis;
    nutritionAnalysis: NutritionAnalysis;
    healthAnalysis: HealthAnalysis;
}

export interface WaterAnalysis {
    volumeTrend: 'increase' | 'decrease' | 'consistent';
    intervalTrend: 'increase' | 'decrease' | 'consistent';
    averageVolume: number;
    averageInterval: number;
    recommendedAdjustment: number; // percentage change
}

export interface SunlightAnalysis {
    currentRequirement: SunlightRequirement;
    changeFrequency: number;
    recommendedRequirement: SunlightRequirement;
}

export interface SoilAnalysis {
    currentSoil: SoilType;
    changeFrequency: number;
    recommendedSoil: SoilType;
}

export interface NutritionAnalysis {
    averageNutrients: PlantNutrition[];
    deficiencyPattern: boolean;
    recommendedAdjustment: number; // percentage change
}

export interface HealthAnalysis {
    recentSymptoms: PlantSymptoms[];
    persistentIssues: PlantSymptoms[];
    improvementNeeded: boolean;
    criticalSymptoms: PlantSymptoms[];
}