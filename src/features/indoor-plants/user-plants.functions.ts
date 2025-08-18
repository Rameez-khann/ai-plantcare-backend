import { generateUniqueId } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantCareInstructions, UserPlants } from "./interfaces/indoor-plant.interface";

const plantsTable = new FirebaseClient('user-plants');
const instructionsTable = new FirebaseClient('plant-care-instructions');

export async function getUserPlants(userId: string): Promise<UserPlants | null> {
    const record = await plantsTable.getOneByField('userId', userId);
    return record;
    // const plants = record?.plants || [];
    // return plants;

}

export async function saveScientificNameToUserPlants(payload: { userId: string, scientificName: string }) {
    const { userId, scientificName } = payload;
    const record: UserPlants | null = await plantsTable.getOneByField('userId', userId);
    const scientificNames = record?.scientificNames || [];
    if (!scientificNames.includes(scientificName)) {
        scientificNames.push(scientificName);
    }

    if (record) {
        return plantsTable.update(record.id, { scientificNames })
    } else {
        const userPlant: UserPlants = {
            id: generateUniqueId(),
            userId,
            scientificNames
        }
        return plantsTable.create(userPlant);
    }
}

export async function removeScientificNameFromUserPlants(payload: { userId: string, scientificName: string }) {
    const { userId, scientificName } = payload;
    const record: UserPlants | null = await plantsTable.getOneByField('userId', userId);
    if (!record) return null;
    const scientificNames = record?.scientificNames || [];
    const filtered = scientificNames.filter(s => s !== scientificName);
    return plantsTable.update(record.id, { scientificNames: filtered })
}

export async function getUserPlantsWInstructions(userId: string): Promise<PlantCareInstructions[]> {
    const userPlants = await getUserPlants(userId);
    const scientificNames = userPlants?.scientificNames;
    if (!scientificNames?.length) return [];
    const plantInstructions: PlantCareInstructions[] = await instructionsTable.getAll();
    const filtered = plantInstructions.filter(p => isPlantInstructionValid(p, scientificNames));
    return filtered;
}

function isPlantInstructionValid(instruction: PlantCareInstructions, scientificNames: string[]) {
    const scientificName = instruction.scientificName;
    if (!scientificName) return false;
    if (scientificNames.includes(scientificName)) {
        return true;
    }
    return false;
}