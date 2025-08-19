import { generateUniqueId } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantCareInstructions, UserPlants } from './interfaces/indoor-plant.interface';

const userPlants = new FirebaseClient('user-plants');
const plantInstructionsTable = new FirebaseClient('plant-care-instructions');
const identificationHistory = new FirebaseClient('plant-identification-history');

export async function getUserPlants(userId: string): Promise<UserPlants | null> {
    const record = await userPlants.getOneByField('userId', userId);
    return record;
}

export async function saveScientificNameToUserPlants(payload: { userId: string, scientificName: string }) {
    const { userId, scientificName } = payload;
    const record: UserPlants | null = await userPlants.getOneByField('userId', userId);
    const scientificNames = record?.scientificNames || [];
    if (!scientificNames.includes(scientificName)) {
        scientificNames.push(scientificName);
    }

    if (record) {
        return userPlants.update(record.id, { scientificNames })
    } else {
        const userPlant: UserPlants = {
            id: generateUniqueId(),
            userId,
            scientificNames
        }
        return userPlants.create(userPlant);
    }
}

export async function removeScientificNameFromUserPlants(payload: { userId: string, scientificName: string }) {
    const { userId, scientificName } = payload;
    const record: UserPlants | null = await userPlants.getOneByField('userId', userId);
    if (!record) return null;
    const scientificNames = record?.scientificNames || [];
    const filtered = scientificNames.filter(s => s !== scientificName);
    return userPlants.update(record.id, { scientificNames: filtered })
}

export async function getUserPlantsWInstructions(userId: string): Promise<PlantCareInstructions[]> {
    const userPlants = await getUserPlants(userId);
    const scientificNames = userPlants?.scientificNames;
    if (!scientificNames?.length) return [];
    const plantInstructions: PlantCareInstructions[] = await plantInstructionsTable.getAll();
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

async function getPlantIdentificationRecords(plantId: string): Promise<PlantCareInstructions[]> {
    return identificationHistory.getByField('plantId', plantId)
}

async function savePlantIdentificationRecord(payload: PlantCareInstructions) {
}