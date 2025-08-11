import { GenusPlantcareInstructions } from "./plant-care-instructions";
import { PlantCareInstructions } from "./indoor-plant.interface";
import { KindwiseResult, PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { resolveMultiplePromises } from "victor-dev-toolbox";



function plantCareInstructionByGenus(genus: string): PlantCareInstructions {
    return GenusPlantcareInstructions.find(p => p.genus.toLowerCase() === genus.toLowerCase())
        || GenusPlantcareInstructions.find(p => p.id === 'default')!;
}


export function getDefaultPlantcareInstructions(payload: PlantIdentificationResult): PlantCareInstructions {
    const name = payload.classification[0].name;
    const genus = name.split(' ')[0];
    console.log({ genus });

    const instructions = plantCareInstructionByGenus(genus);
    return instructions;
}



export async function savePlantInstructionsToDatabase() {
    //  Instructions in backend
    const instructions: PlantCareInstructions[] = GenusPlantcareInstructions;

    // The table where instructions will be stored
    const table = new FirebaseClient('plant-care-instructions');
    const promises: any[] = [];
    instructions.forEach(i => {
        promises.push(table.create(i));
    });

    const resolved = await resolveMultiplePromises(promises);
    console.log({ resolved });

    return resolved;

}
