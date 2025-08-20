import { PlantCareInstructions } from './interfaces/indoor-plant.interface';
import { generateUniqueId, getFieldValuesFromArray, sortArrayByKey } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantDiseaseInfo, PlantHealthResult, PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";
import { showPlantHistory } from './plant-history';

const plantHealthHistoryTable = new FirebaseClient('plant-health-history');
const instructionsTable = new FirebaseClient('plant-care-instructions');
const identificationTable = new FirebaseClient('identified-plants');



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

export async function getPlantHistory(plantId: string): Promise<{ identification: PlantIdentificationResult, history: string }> {
    const identification = await getPlantIdentification(plantId);
    // get the plant from user-plants
    // Get health history
    const plantHistory = await getPlantRecords(plantId);
    const history = showPlantHistory(plantHistory);
    return { identification, history }
}

async function analyzePlantHistory(plants: PlantHealthResult[], instructions: PlantCareInstructions) {
    const diseases: PlantDiseaseInfo[] = getFieldValuesFromArray('diseases', plants);

}


export async function savePlantIdentification(identification: PlantIdentificationResult): Promise<PlantIdentificationResult> {
    return identificationTable.create(identification)
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