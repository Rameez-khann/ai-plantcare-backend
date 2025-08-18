import { generateUniqueId } from "victor-dev-toolbox";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { PlantHealthResult } from "../../core/kindwise/kindwise.interface";

export const healthTable = new FirebaseClient('plant-health-history');

export async function savePlantHealth(health: PlantHealthResult) {
    const save = await healthTable.create(health);
    return save;
}