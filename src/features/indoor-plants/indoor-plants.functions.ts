import { DefaultPlantcareInstructions } from "./default-plant-instructions";
import { PlantCareInstructions } from "./interfaces/indoor-plant.interface";
import { KindwiseResult, PlantIdentificationResult } from "../../core/kindwise/kindwise.interface";
import { FirebaseClient } from "../../core/firebase/firebase-client";
import { resolveMultiplePromises } from "victor-dev-toolbox";






// export async function savePlantInstructionsToDatabase() {
//     //  Instructions in backend
//     const instructions: PlantCareInstructions[] = DefaultPlantcareInstructions;

//     // The table where instructions will be stored
//     const table = new FirebaseClient('plant-care-instructions');
//     const promises: any[] = [];
//     instructions.forEach(i => {
//         promises.push(table.create(i));
//     });

//     const resolved = await resolveMultiplePromises(promises);

//     return resolved;

// }

