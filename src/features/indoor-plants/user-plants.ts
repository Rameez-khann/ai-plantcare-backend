import { generateUniqueId, sortArrayByKey } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantCareInstructions, UserPlants } from './interfaces/indoor-plant.interface';
import { PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";

const userPlantsTable = new FirebaseClient('user-plants_');
const plantInstructionsTable = new FirebaseClient('plant-care-instructions');
const identificationHistory = new FirebaseClient('_identified_-plants');

export async function getUserPlants(userId: string): Promise<PlantIdentificationResult[]> {
    const records = await userPlantsTable.getByField('userId', userId);
    return records;
}

export async function saveUserPlant(userId: string, identification: PlantIdentificationResult): Promise<PlantIdentificationResult> {
    const name = identification.classification.name;
    const recordInDB: PlantIdentificationResult[] = await getUserPlants(userId);
    const filtered = recordInDB.find(r => r.name === name)
    if (!filtered) {
        identification.userId = userId;
        identification.identification = identification.id;
        identification.id = generateUniqueId();
        return userPlantsTable.create(identification);

    }
    return recordInDB[0];

}



// export async function saveScientificNameToUserPlants(payload: { userId: string, scientificName: string }) {
//     const { userId, scientificName } = payload;
//     const record: UserPlants | null = await userPlantsTable.getOneByField('userId', userId);
//     const scientificNames = record?.scientificNames || [];
//     if (!scientificNames.includes(scientificName)) {
//         scientificNames.push(scientificName);
//     }

//     if (record) {
//         return userPlantsTable.update(record.id, { scientificNames })
//     } else {
//         const userPlant: UserPlants = {
//             id: generateUniqueId(),
//             userId,
//             scientificNames
//         }
//         return userPlantsTable.create(userPlant);
//     }
// }

// export async function removeScientificNameFromUserPlants(payload: { userId: string, scientificName: string }) {
//     const { userId, scientificName } = payload;
//     const record: UserPlants | null = await userPlantsTable.getOneByField('userId', userId);
//     if (!record) return null;
//     const scientificNames = record?.scientificNames || [];
//     const filtered = scientificNames.filter(s => s !== scientificName);
//     return userPlantsTable.update(record.id, { scientificNames: filtered })
// }


// export async function getUserPlantsWInstructions(userId: string): Promise<PlantCareInstructions[]> {
//     const userPlants = await getUserPlants(userId);
//     if (!userPlants.length) return [];

//     const plantInstructions: PlantCareInstructions[] = await plantInstructionsTable.getAll();
//     const filtered = plantInstructions.filter(p => isPlantInstructionValid(p, scientificNames));
//     return filtered;

//     userPlants.forEach(async (plant) => {
//         const scientificNames = plant?.scientificNames;
//         if (!scientificNames?.length) return [];

//     })


// }

function isPlantInstructionValid(instruction: PlantCareInstructions, scientificNames: string[]) {
    const scientificName = instruction.scientificName;
    if (!scientificName) return false;
    if (scientificNames.includes(scientificName)) {
        return true;
    }
    return false;
}

export async function getDashboardPlants(userId: string): Promise<PlantCareInstructions[]> {
    return identificationHistory.getByField('userId', userId)
}

export async function getPlantIdentificationRecords(plantId: string): Promise<PlantCareInstructions[]> {
    return identificationHistory.getByField('plantId', plantId)
}

export async function savePlantIdentificationRecord(payload: PlantCareInstructions) {
    return identificationHistory.create(payload);
}


export async function saveUserPlantInstructions(instructions: PlantCareInstructions): Promise<PlantCareInstructions> {
    return userPlantsTable.create(instructions);
}


export async function getUserPLantInstructionsByPlantId(plantId: string): Promise<PlantCareInstructions[]> {
    const records = await userPlantsTable.getByField('plantId', plantId);
    return sortArrayByKey('createdAt', 'DESC', records);
}

