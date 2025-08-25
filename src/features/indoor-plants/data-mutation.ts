import {
    PlantCareInstructions,
    SoilType,
    SunlightRequirement,
    PlantNutrition,
} from "./interfaces/indoor-plant.interface";
import * as fs from "fs";
import * as path from "path";
import { DefaultPlantcareInstructions } from "./default-plant-instructions";

// ------------------------------
// Types
// ------------------------------
type PlantStatus = "Healthy" | "Dehydrated" | "Malnourished" | "Overwatered" | "Dead";

interface PlantSimulationResult {
    status: PlantStatus;
    notes: string;
    instructions: PlantCareInstructions;
}


export class DataMutation {
    private plants = DefaultPlantcareInstructions;


    mutateData(): Record<string, PlantSimulationResult[]> {
        const results: Record<string, PlantSimulationResult[]> = {};

        this.plants.forEach((plant, index) => {
            const plantId = (index + 1).toString().padStart(3, "0");
            // Each plant has 20–27 progressions
            const numInstances = this.randInt(20, 27);

            // Each plant has 1–3 progressions
            // const numInstances = this.randInt(1, 3);
            const progression: PlantSimulationResult[] = [];

            let status: PlantStatus = "Healthy";
            let base = { ...plant };

            for (let step = 0; step < numInstances; step++) {
                // Smoothly evolve the care instructions
                const adjusted = this.evolveInstructions(base, step);

                // Derive plausible plant status based on care
                const [newStatus, notes] = this.deriveStatus(status, adjusted, step);

                // Push simulation entry
                progression.push({
                    status: newStatus,
                    notes,
                    instructions: {
                        ...adjusted,
                        id: `${plantId}-${step + 1}`,
                        plantId,
                        createdAt: new Date(Date.now() - step * 86400000).toISOString(),
                    },
                });

                // Update state for next iteration
                status = newStatus;
                base = adjusted;
            }

            results[plantId] = progression;
        });
        console.log(results);

        return results;
    }

    /**
     * Persist dataset to storage
     */
    saveToStorage(filePath = "assets/output2.json") {
        const results = this.simulate();
        const fullPath = path.resolve(process.cwd(), filePath);

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, JSON.stringify({ results }, null, 2), "utf-8");

        console.log(`✅ Simulation saved to ${fullPath}`);
        return results;
    }

    // ------------------------------
    // Helpers
    // ------------------------------

    /**
     * Smooth changes: +/-20% on water/nutrition, occasional soil/sunlight change
     */
    private evolveInstructions(base: PlantCareInstructions, step: number): PlantCareInstructions {
        const waterFactor = 1 + this.randFloat(-0.2, 0.2);
        const intervalShift = this.randInt(-1, 1);

        const nutrition: PlantNutrition[] = base.nutrition.map((n) => ({
            ...n,
            quantity: Math.max(0, Math.round(n.quantity * (1 + this.randFloat(-0.3, 0.3)))),
            interval: Math.max(1, n.interval + this.randInt(-1, 1)),
        }));

        return {
            ...base,
            waterVolume: Math.max(10, Math.round(base.waterVolume * waterFactor)),
            wateringInterval: Math.max(1, base.wateringInterval + intervalShift),
            nutrition,
            sunlight: step > 0 && Math.random() < 0.2 ? this.randomEnum(SunlightRequirement) : base.sunlight,
            soilType: step > 0 && Math.random() < 0.1 ? this.randomEnum(SoilType) : base.soilType,
        };
    }

    /**
     * Derive plausible plant status transitions
     */
    private deriveStatus(prev: PlantStatus, instructions: PlantCareInstructions, step: number): [PlantStatus, string] {
        let status: PlantStatus = prev;
        let notes = "Plant stable.";

        if (prev === "Healthy" && Math.random() < 0.15) {
            status = "Dehydrated";
            notes = "Leaves drooping, water levels too low.";
        } else if (prev === "Dehydrated" && Math.random() < 0.4) {
            status = "Dead";
            notes = "The plant dried out completely.";
        } else if (prev === "Healthy" && Math.random() < 0.1) {
            status = "Overwatered";
            notes = "Soil too damp, signs of root rot starting.";
        } else if (prev === "Overwatered" && Math.random() < 0.3) {
            status = "Dead";
            notes = "Root system collapsed from excess water.";
        } else if (prev === "Healthy" && Math.random() < 0.05) {
            status = "Malnourished";
            notes = "Yellowing leaves from lack of nutrients.";
        }


        return [status, notes];
    }

    private randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private randomEnum<T>(enumObj: any): T[keyof T] {
        const values = Object.values(enumObj) as T[keyof T][];
        return values[Math.floor(Math.random() * values.length)];
    }
}
