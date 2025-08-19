import { PlantCareInstructions } from './interfaces/indoor-plant.interface';
import { generateUniqueId, getFieldValuesFromArray, sortArrayByKey } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantDisease, PlantHealthResult } from "../../core/kindwise/kindwise.interface";

const plantHealthHistoryTable = new FirebaseClient('plant-health-history');
const instructionsTable = new FirebaseClient('plant-care-instructions');



export async function savePlantHealth(health: PlantHealthResult) {
    const save = await plantHealthHistoryTable.create(health);
    return save;
}

export async function adjustPlantSuggestions(plant: PlantHealthResult) {
    //  Get history of plant
    const history: PlantHealthResult[] = await getPlantHistory(plant.plantId);
}

async function getPlantHistory(plantId?: string) {
    if (plantId) {
        return [];
    }
    const history: PlantHealthResult[] = await plantHealthHistoryTable.getByField('plantId', plantId)
    return sortArrayByKey('createdAt', 'DESC', history);

    // scan the last 10 days
}

async function analyzePlantHistory(plants: PlantHealthResult[], instructions: PlantCareInstructions) {
    const diseases: PlantDisease[] = getFieldValuesFromArray('diseases', plants);

}


// async function analyzeDisease(disease: PlantDisease) {
//     switch (disease) {
//         case value:

//             break;

//         default:
//             break;
//     }
// }