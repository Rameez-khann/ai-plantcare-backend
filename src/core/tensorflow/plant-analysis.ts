import { generateUniqueId, getEnumValues, getFieldValuesFromArray, sortArrayByKey } from 'victor-dev-toolbox';
import { PlantCareInstructions, SoilType, SunlightRequirement, PlantNutrition } from '../../features/indoor-plants/interfaces/indoor-plant.interface';
import { FirebaseClient } from '../firebase/firebase-client';
import { PlantDiseaseInfo, PlantHealthResult, PlantSymptoms } from '../kindwise/kindwise.interface';
import { AnalysisResult, WaterAnalysis, SunlightAnalysis, SoilAnalysis, NutritionAnalysis, HealthAnalysis } from './interfaces/plant-analysis.interface';
import { TensorflowAnalysis } from './tensorflow-analysis';
import { getUserPLantInstructionsByPlantId } from '../../features/indoor-plants/user-plants';
import { getDefaultPlantcareInstructions } from '../../features/indoor-plants/plant-care-instructions';



export class PlantAnalysis {

    private previousInstructions: PlantCareInstructions[] = [];
    private currentInstructions: PlantCareInstructions | null = null;

    // Tables
    private userInstructions = new FirebaseClient('customized-user-instructions');
    private plantCareInstructions = new FirebaseClient('plant-care-instructions');
    private plantHealthTable = new FirebaseClient('plant-health-history');
    private plantHealthHistory = new FirebaseClient('plant-health-history');

    // Tensorflow
    private tensorflowAnalysis = new TensorflowAnalysis();


    // Main analysis method
    public async analyzeCurrentResults(plantId: string, currentInstruction: PlantCareInstructions): Promise<PlantCareInstructions> {
        const health: PlantHealthResult[] = await this.plantHealthHistory.getByField('plantId', plantId);
        // const health: PlantCareInstructions[] = await this.plantCareInstructions.getByField('plantId', plantId);
        // console.log({ instructions, plantId });
        // Plant Identification

        // Sorted from most recent to least recent
        // this.previousInstructions = sortArrayByKey('createdAt', 'DESC', instructions);
        this.currentInstructions = currentInstruction;

        // Get recent health data (last 30 days worth)
        const recentHealth = health.slice(0, 10);
        const diseases: PlantDiseaseInfo[] = recentHealth.flatMap(h => h.disease || []);

        // Perform all analyses
        const analysisResult: AnalysisResult = {
            waterAnalysis: this.analyzeWater(this.previousInstructions),
            sunlightAnalysis: this.analyzeSunLevel(this.previousInstructions),
            soilAnalysis: this.analyzeSoilTypes(this.previousInstructions),
            nutritionAnalysis: this.analyzeNutrition(this.previousInstructions),
            healthAnalysis: this.analyzeHealth(diseases)
        };

        // Generate optimized care instructions
        const result = await this.prepareIdealPlantCareInstructions(analysisResult, currentInstruction);
        return result;
    }

    private analyzeWater(instructions: PlantCareInstructions[]): WaterAnalysis {
        if (instructions.length === 0) {
            return {
                volumeTrend: 'consistent',
                intervalTrend: 'consistent',
                averageVolume: 0,
                averageInterval: 0,
                recommendedAdjustment: 0
            };
        }

        const waterVolumes: number[] = getFieldValuesFromArray('waterVolume', instructions);
        const wateringIntervals: number[] = getFieldValuesFromArray('wateringInterval', instructions);

        // Calculate trends
        const volumeTrend = this.calculateTrend(waterVolumes);
        const intervalTrend = this.calculateTrend(wateringIntervals);

        // Calculate averages
        const averageVolume = Math.round(waterVolumes.reduce((a, b) => a + b, 0) / waterVolumes.length);
        const averageInterval = Math.round(wateringIntervals.reduce((a, b) => a + b, 0) / wateringIntervals.length);

        return {
            volumeTrend,
            intervalTrend,
            averageVolume,
            averageInterval,
            recommendedAdjustment: 0 // Will be set based on health analysis
        };
    }

    private analyzeSunLevel(instructions: PlantCareInstructions[]): SunlightAnalysis {

        if (instructions.length === 0) {
            return {
                currentRequirement: SunlightRequirement.INDIRECT,
                changeFrequency: 0,
                recommendedRequirement: SunlightRequirement.INDIRECT
            };
        }

        const sunlightRequirements: SunlightRequirement[] = getFieldValuesFromArray('sunlight', instructions);
        const currentRequirement = sunlightRequirements[0] || SunlightRequirement.INDIRECT;

        // Calculate how often sunlight requirements change
        let changes = 0;
        for (let i = 1; i < sunlightRequirements.length; i++) {
            if (sunlightRequirements[i] !== sunlightRequirements[i - 1]) {
                changes++;
            }
        }

        const changeFrequency = sunlightRequirements.length > 1 ? changes / (sunlightRequirements.length - 1) : 0;

        return {
            currentRequirement,
            changeFrequency,
            recommendedRequirement: currentRequirement // Will be adjusted based on health
        };
    }

    private analyzeSoilTypes(instructions: PlantCareInstructions[]): SoilAnalysis {
        if (instructions.length === 0) {
            return {
                currentSoil: SoilType.WELL_DRAINING,
                changeFrequency: 0,
                recommendedSoil: SoilType.WELL_DRAINING
            };
        }

        const soilTypes: SoilType[] = getFieldValuesFromArray('soilType', instructions);
        const currentSoil = soilTypes[0] || SoilType.WELL_DRAINING;

        // Calculate soil change frequency
        let changes = 0;
        for (let i = 1; i < soilTypes.length; i++) {
            if (soilTypes[i] !== soilTypes[i - 1]) {
                changes++;
            }
        }

        const changeFrequency = soilTypes.length > 1 ? changes / (soilTypes.length - 1) : 0;

        return {
            currentSoil,
            changeFrequency,
            recommendedSoil: currentSoil // Will be adjusted based on health
        };
    }

    private analyzeNutrition(instructions: PlantCareInstructions[]): NutritionAnalysis {
        if (instructions.length === 0) {
            return {
                averageNutrients: [],
                deficiencyPattern: false,
                recommendedAdjustment: 0
            };
        }

        const allNutrition: PlantNutrition[][] = getFieldValuesFromArray('nutrition', instructions);

        // Flatten and analyze nutrition patterns
        const flatNutrition = allNutrition.flat();
        const nutrientMap = new Map<string, { totalQuantity: number, totalInterval: number, count: number }>();

        flatNutrition.forEach(nutrient => {
            const existing = nutrientMap.get(nutrient.nutrient) || { totalQuantity: 0, totalInterval: 0, count: 0 };
            existing.totalQuantity += nutrient.quantity;
            existing.totalInterval += nutrient.interval;
            existing.count++;
            nutrientMap.set(nutrient.nutrient, existing);
        });

        // Calculate average nutrients
        const averageNutrients: PlantNutrition[] = Array.from(nutrientMap.entries()).map(([nutrient, data]) => ({
            nutrient,
            quantity: data.totalQuantity / data.count,
            interval: data.totalInterval / data.count
        }));

        return {
            averageNutrients,
            deficiencyPattern: false, // Will be determined by health analysis
            recommendedAdjustment: 0
        };
    }

    private analyzeHealth(diseases: PlantDiseaseInfo[]): HealthAnalysis {
        const allSymptoms: PlantSymptoms[] = getEnumValues(PlantSymptoms);

        // Filter valid symptoms and get recent ones
        const validDiseases = diseases.filter(disease =>
            allSymptoms.includes(disease.name) && disease.name !== PlantSymptoms.INVALID
        );

        const recentSymptoms = validDiseases.slice(0, 5).map(d => d.name);

        // Find persistent issues (symptoms appearing multiple times)
        const symptomCounts = new Map<PlantSymptoms, number>();
        validDiseases.forEach(disease => {
            const count = symptomCounts.get(disease.name) || 0;
            symptomCounts.set(disease.name, count + 1);
        });

        const persistentIssues = Array.from(symptomCounts.entries())
            .filter(([_, count]) => count >= 2)
            .map(([symptom, _]) => symptom);

        // Identify critical symptoms that need immediate attention
        const criticalSymptoms = recentSymptoms.filter(symptom =>
            [PlantSymptoms.EXCESS_WATER, PlantSymptoms.WATER_DEFICIENCY,
            PlantSymptoms.NUTRIENT_DEFICIENCY, PlantSymptoms.FUNGI].includes(symptom)
        );

        return {
            recentSymptoms,
            persistentIssues,
            improvementNeeded: persistentIssues.length > 0 || criticalSymptoms.length > 0,
            criticalSymptoms
        };
    }

    // private async prepareIdealPlantCareInstructions(analysis: AnalysisResult, currentInstruction: PlantCareInstructions): Promise<PlantCareInstructions> {
    //     let optimizedInstructions = { ...currentInstruction };

    //     // Apply health-based adjustments
    //     const { healthAnalysis } = analysis;

    //     // Water adjustments based on symptoms
    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.EXCESS_WATER)) {
    //         optimizedInstructions.waterVolume = Math.max(50, optimizedInstructions.waterVolume * 0.7);
    //         optimizedInstructions.wateringInterval = Math.min(14, optimizedInstructions.wateringInterval * 1.3);
    //     }

    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.WATER_DEFICIENCY)) {
    //         optimizedInstructions.waterVolume = Math.round(optimizedInstructions.waterVolume * 1.3);
    //         optimizedInstructions.wateringInterval = Math.round(Math.max(1, optimizedInstructions.wateringInterval * 0.8));
    //     }

    //     // Sunlight adjustments
    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.LACK_OF_LIGHT)) {
    //         optimizedInstructions.sunlight = this.increaseSunlight(optimizedInstructions.sunlight);
    //     }

    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.EXCESS_LIGHT)) {
    //         optimizedInstructions.sunlight = this.decreaseSunlight(optimizedInstructions.sunlight);
    //     }

    //     // Nutrition adjustments
    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.NUTRIENT_DEFICIENCY)) {
    //         optimizedInstructions.nutrition = this.increaseNutrition(optimizedInstructions.nutrition);
    //     }

    //     // Soil adjustments for fungi issues
    //     if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.FUNGI)) {
    //         optimizedInstructions.soilType = SoilType.WELL_DRAINING;
    //         optimizedInstructions.waterVolume = Math.max(50, optimizedInstructions.waterVolume * 0.6);
    //     }

    //     // Generate new ID for the optimized instructions
    //     optimizedInstructions.id = generateUniqueId();

    //     return optimizedInstructions;
    // }

    // Helper methods

    private async prepareIdealPlantCareInstructions(
        analysis: AnalysisResult,
        currentInstruction: PlantCareInstructions
    ): Promise<PlantCareInstructions> {
        let optimizedInstructions = { ...currentInstruction };

        // Apply health-based adjustments
        const { healthAnalysis } = analysis;

        // Water adjustments based on symptoms
        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.EXCESS_WATER)) {
            optimizedInstructions.waterVolume = Math.max(50, optimizedInstructions.waterVolume * 0.7);
            optimizedInstructions.wateringInterval = Math.min(14, optimizedInstructions.wateringInterval * 1.3);
        }

        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.WATER_DEFICIENCY)) {
            optimizedInstructions.waterVolume = Math.round(optimizedInstructions.waterVolume * 1.3);
            optimizedInstructions.wateringInterval = Math.round(Math.max(1, optimizedInstructions.wateringInterval * 0.8));
        }

        // Sunlight adjustments
        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.LACK_OF_LIGHT)) {
            optimizedInstructions.sunlight = this.increaseSunlight(optimizedInstructions.sunlight);
        }

        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.EXCESS_LIGHT)) {
            optimizedInstructions.sunlight = this.decreaseSunlight(optimizedInstructions.sunlight);
        }

        // Nutrition adjustments
        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.NUTRIENT_DEFICIENCY)) {
            optimizedInstructions.nutrition = this.increaseNutrition(optimizedInstructions.nutrition);
        }

        // Soil adjustments for fungi issues
        if (healthAnalysis.criticalSymptoms.includes(PlantSymptoms.FUNGI)) {
            optimizedInstructions.soilType = SoilType.WELL_DRAINING;
            optimizedInstructions.waterVolume = Math.max(50, optimizedInstructions.waterVolume * 0.6);
        }

        // Generate new ID for the optimized instructions
        optimizedInstructions.id = generateUniqueId();

        // ---- NEW PART: round everything before returning ----
        optimizedInstructions = {
            ...optimizedInstructions,
            waterVolume: Math.round(optimizedInstructions.waterVolume),
            wateringInterval: Math.round(optimizedInstructions.wateringInterval),
            nutrition: optimizedInstructions.nutrition.map(n => ({
                ...n,
                quantity: Math.round(n.quantity),
                interval: Math.round(n.interval)
            }))
        };

        return optimizedInstructions;
    }


    private calculateTrend(values: number[]): 'increase' | 'decrease' | 'consistent' {
        if (values.length < 2) return 'consistent';

        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const threshold = 0.1; // 10% change threshold
        const changePercent = Math.abs(secondAvg - firstAvg) / firstAvg;

        if (changePercent < threshold) return 'consistent';
        return secondAvg > firstAvg ? 'increase' : 'decrease';
    }

    private increaseSunlight(current: SunlightRequirement): SunlightRequirement {
        const levels = [SunlightRequirement.LOW_LIGHT, SunlightRequirement.INDIRECT,
        SunlightRequirement.PARTIAL_SUN, SunlightRequirement.FULL_SUN];
        const currentIndex = levels.indexOf(current);
        return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : current;
    }

    private decreaseSunlight(current: SunlightRequirement): SunlightRequirement {
        const levels = [SunlightRequirement.LOW_LIGHT, SunlightRequirement.INDIRECT,
        SunlightRequirement.PARTIAL_SUN, SunlightRequirement.FULL_SUN];
        const currentIndex = levels.indexOf(current);
        return currentIndex > 0 ? levels[currentIndex - 1] : current;
    }

    private increaseNutrition(current: PlantNutrition[]): PlantNutrition[] {
        return current.map(nutrient => ({
            ...nutrient,
            quantity: nutrient.quantity * 1.2,
            interval: Math.max(7, nutrient.interval * 0.9) // Increase frequency (decrease interval)
        }));
    }

    // private async getPlantInstructions(plantId: string) {
    //     const instructions = await getUserPLantInstructionsByPlantId(plantId);
    //     let currentInstruction: PlantCareInstructions = instructions[0];

    //     if (!currentInstruction) {
    //         currentInstruction = await getDefaultPlantcareInstructions()
    //     }
    // }
}