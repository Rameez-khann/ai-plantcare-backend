import { GenusPlantcareInstructions } from "./plant-care-instructions";
import { PlantCareInstructions } from "./indoor-plant.interface";
import { KindwiseResult, PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";



function plantCareInstructionByGenus(genus: string): PlantCareInstructions {
    return GenusPlantcareInstructions.find(p => p.genus.toLowerCase() === genus.toLowerCase())
        || GenusPlantcareInstructions.find(p => p.id === 'fallback')!;
}


export function getDefaultPlantcareInstructions(payload: PlantIdentificationResult): PlantCareInstructions {
    const name = payload.classification[0].name;
    const genus = name.split(' ')[0];
    console.log({ genus });

    const instructions = plantCareInstructionByGenus(genus);
    return instructions;
}
