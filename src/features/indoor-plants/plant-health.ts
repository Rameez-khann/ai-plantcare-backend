import { PlantCareInstructions } from './interfaces/indoor-plant.interface';
import { generateUniqueId, getFieldValuesFromArray, sortArrayByKey } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantDiseaseInfo, PlantHealthResult, PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";
import path from "path";
import { getDefaultPlantcareInstructions } from './plant-care-instructions';
import { convertToBase64, saveFileToStorage } from '../../core/files/files';
import { sendImageForHealthCheck } from '../../core/kindwise/kindwise.functions';



const plantHealthHistoryTable = new FirebaseClient('plant-health-history');
const instructionsTable = new FirebaseClient('plant-care-instructions');
const identificationTable = new FirebaseClient('_identified_-plants');


export async function savePlantHealth(health: PlantHealthResult) {
    const save = await plantHealthHistoryTable.create(health);
    return save;
}

// export async function adjustPlantSuggestions(plant: PlantHealthResult) {
//     if (!plant.plantId) {
//         return null;
//     }
//     //  Get history of plant
//     const history: PlantHealthResult[] = await getPlantRecords(plant.plantId);

// }

async function getPlantRecords(plantId: string): Promise<PlantHealthResult[]> {
    if (!plantId) {
        return [];
    }
    const history: PlantHealthResult[] = await plantHealthHistoryTable.getByField('plantId', plantId)
    return sortArrayByKey('createdAt', 'DESC', history);

    // scan the last 10 days
}

async function getPlantInstructions(plantId: string): Promise<PlantHealthResult[]> {
    if (!plantId) {
        return [];
    }
    const history: PlantHealthResult[] = await instructionsTable.getByField('plantId', plantId)
    return sortArrayByKey('createdAt', 'DESC', history);

    // scan the last 10 days
}

// export async function getPlantHistory(plantId: string): Promise<{ identification: PlantIdentificationResult, history: string }> {
//     const identification = await getPlantIdentification(plantId);
//     // get the plant from user-plants
//     // Get health history
//     const plantHistory = await getPlantRecords(plantId);
//     const history = plantInstructionsUI(plantHistory);
//     return { identification, history }
// }

// async function analyzePlantHistory(plants: PlantHealthResult[], instructions: PlantCareInstructions) {
//     const diseases: PlantDiseaseInfo[] = getFieldValuesFromArray('diseases', plants);

// }


export async function savePlantIdentification(identification: PlantIdentificationResult): Promise<PlantIdentificationResult> {
    const name = identification.classification.name;
    const recordInDB = await identificationTable.getOneByField('name', name);
    if (!recordInDB) {
        const id = identification.id;
        identification.identification = id;
        return identificationTable.create(identification);

    }
    return recordInDB[0];

}






export async function getPlantIdentification(id: string): Promise<PlantIdentificationResult> {
    return identificationTable.getOne(id);

}












// async function analyzeDisease(disease: PlantDiseaseInfo) {
//     switch (disease) {
//         case value:

//             break;

//         default:
//             break;
//     }
// }