import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";
import { PlantCareInstructions } from "./interfaces/indoor-plant.interface";
import { DefaultPlantcareInstructions } from "./default-plant-instructions";
import { generateUniqueId } from "victor-dev-toolbox";

const table = new FirebaseClient('plant-care-instructions');

export function plantCareInstructionByGenus(input: string): PlantCareInstructions {
    const genus = input.split(' ')[0];

    const instructions = DefaultPlantcareInstructions.find(p => p.genus.toLowerCase() === genus.toLowerCase()) || DefaultPlantcareInstructions.find(p => p.id === 'default')!;
    return instructions;
}

export async function savePlantcareInstructions(instructions: PlantCareInstructions) {
    const recordInDb = await table.getOneByField('scientificName', instructions.scientificName);
    if (recordInDb) {
        return recordInDb;
    }
    instructions.id = generateUniqueId();
    const save = await table.create(instructions);
    return save;
}


export async function updatePlantCareInstructions(id: string, payload: Partial<PlantCareInstructions>) {
    const update = await table.update(id, payload);
    return update;

}


export async function getPlantCareInstructions(scientificName: string) {
    const genus = scientificName.split(' ')[0];

    const instructionFromDb: PlantCareInstructions | null = await table.getOneByField('scientificName', scientificName);
    if (instructionFromDb) {
        return instructionFromDb;
    } else {
        const instructions = plantCareInstructionByGenus(genus);
        instructions.scientificName = scientificName;
        const savedInstructions = await savePlantcareInstructions(instructions);
        return savedInstructions;


    }

}


export async function getDefaultPlantcareInstructions(payload: PlantIdentificationResult): Promise<PlantCareInstructions> {
    const scientificName = payload.classification.name;

    const instructions = await getPlantCareInstructions(scientificName);

    if (!instructions.imageURl) {
        const imageUrl = payload.classification.similarImages[0];
        instructions.imageURl = imageUrl || '';
        updatePlantCareInstructions(instructions.id, { imageURl: imageUrl });
    }
    // const instructions = plantCareInstructionByGenus(genus);
    // instructions.imageURl = imageUrl || '';
    // savePlantcareInstructions(instructions);
    return instructions;
}


