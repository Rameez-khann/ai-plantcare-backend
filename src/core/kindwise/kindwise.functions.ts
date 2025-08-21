import { generateUniqueId, sortArrayByKey } from "victor-dev-toolbox";
import { HttpClient } from "../http/http"
import { KindwiseConfig, kindwiseHeaders } from "./kindwise.config";
import { KindWiseHealthResult, KindwiseResult, PlantDiseaseInfo, PlantHealthResult, PlantIdentificationResult } from "./kindwise.interface";
import { getPlantIdentification, savePlantHealth, savePlantIdentification } from "../../features/indoor-plants/plant-health";
import { PlantCareInstructions } from '../../features/indoor-plants/interfaces/indoor-plant.interface';
import { FirebaseClient } from "../firebase/firebase-client";
import path from "path";
import { convertToBase64, saveFileToStorage } from "../files/files";
import { getDefaultPlantcareInstructions } from "../../features/indoor-plants/plant-care-instructions";
import { PlantAnalysis } from "../tensorflow/plant-analysis";
import { plantInstructionsUI } from "../../features/indoor-plants/instructions-page";
import { getUserPLantInstructionsByPlantId } from "../../features/indoor-plants/user-plants";

const httpClient = new HttpClient();


function kindwiseToPlantIdentification(result: KindwiseResult, plantId: string, userId?: string): PlantIdentificationResult {

    const classification = result.classification.suggestions[0];
    const identification = {
        id: plantId,
        isPlant: result.is_plant.binary,
        probability: result.is_plant.probability,
        plantId,
        userId,
        name: classification.name,
        classification: {
            id: classification.id,
            name: classification.name,
            probability: classification.probability,
            similarImages: classification.similar_images.map(img => img.url)
        }
    };
    return identification;
}

export function kindwiseToPlantHealth(result: KindWiseHealthResult): PlantHealthResult {
    const suggestion = result.disease.suggestions[0] || null;

    let disease: PlantDiseaseInfo | null = null;
    if (suggestion) {
        disease = {
            id: suggestion.id,
            name: suggestion.name,
            probability: suggestion.probability,
            similarImages: suggestion.similar_images.map(img => img.url)
        }
    }

    const identification: PlantHealthResult = {
        id: generateUniqueId(),

        isPlant: result.is_plant.binary,
        probability: result.is_plant.probability,
        disease
    };


    return identification;
}

export async function sendImageForIdentification(input: { image: string, userId?: string, imageURL?: string, plantId: string | null }): Promise<PlantIdentificationResult | null> {
    // const url = `${KindwiseConfig.apiURL}/identification`;
    const { image, userId } = input;
    const plantId = input.plantId;
    const newId = generateUniqueId();

    const url = `${KindwiseConfig.apiURL}/identification`;
    const payload = {
        images: [image],
        "similar_images": true
    }
    const health = await sendImageForHealthCheck({ image, userId, plantId: plantId || newId });
    try {
        const identificationTable = new FirebaseClient('_identified_-plants');
        let result = await identificationTable.getOne((plantId || newId));
        if (!result) {
            const response = await httpClient.post(url, payload, { headers: kindwiseHeaders });
            if (response?.result) {
                result = kindwiseToPlantIdentification(response.result, (plantId || newId));

            }

            if (health) {
                result.health = health;
            }
            result.userId = userId;
            return result;


        }



    } catch (error) {
        console.error(error);

    }



    return null;

}

export async function sendImageForHealthCheck(input: { image: string, userId?: string, plantId: string, imageURL?: string }): Promise<PlantHealthResult | null> {
    const { image, userId, plantId, imageURL } = input;
    // const url = `${KindwiseConfig.apiURL}/identification`;
    const url = `${KindwiseConfig.healthURL}`;
    const payload = {
        images: [image],
        "similar_images": true
    }



    const response = await httpClient.post(url, payload, { headers: kindwiseHeaders });

    if (response?.result) {
        const result = kindwiseToPlantHealth(response.result);
        result.userId = userId;
        result.plantId = plantId;
        result.imageUrl
        if (imageURL) {
            result.imageUrl = imageURL;
        }
        savePlantHealth(result);
        // result.instructions = analysis;
        return result;
    }

    return null;

}


export async function plantIdentification(payload: { plantId: string | null, file: Express.Multer.File, userId: string }) {
    const { userId, file } = payload;
    const plantId = payload.plantId || generateUniqueId();
    if (!file) {
        throw new Error('No image uploaded.');
    }

    // Convert image to base64 as required by Kindwise
    const filePath = path.resolve(file.path);
    const base64 = convertToBase64(filePath);

    // Plant Identification from Kindwise
    let identification: PlantIdentificationResult | null = await getPlantIdentification(plantId);

    if (!identification) {
        const result = await sendImageForIdentification({ image: base64, userId, plantId });
        const imageURL = await saveFileToStorage(file);
        if (result) result.imageUrl = imageURL;
        identification = result;

    }
    if (!identification) throw new Error("ID ERROR");

    if (!payload.plantId) {
        // const saveIdentification = await savePlantIdentification(identification);
    }
    const healthCheck = await sendImageForHealthCheck({ image: base64, userId, plantId, imageURL: identification.imageUrl })
    const instructions = await getDefaultPlantcareInstructions(identification);
    const analysis = new PlantAnalysis();
    const newInstructions = await analysis.analyzeCurrentResults(plantId, instructions);


    // console.log({ instructions, newInstructions });
    identification.classification.instructions = newInstructions;

    const saveIdentification = await savePlantIdentification(identification);

    // html
    const html = plantInstructionsUI([newInstructions]);
    identification.html = html;

    if (payload.plantId) {
        const allInstructions = await getUserPLantInstructionsByPlantId(plantId);
        const template = plantInstructionsUI(allInstructions);
        identification.html = template;
    }

    return identification;
}

async function preparePlantCareIInstructions(plant: PlantIdentificationResult) {
    const name = plant.classification.name;
    const defaults = await getDefaultPlantcareInstructions(plant);
    return defaults;
}

async function getCurrentInstructions(plantId: string): Promise<PlantCareInstructions | null> {
    const table = new FirebaseClient('plant-care-instructions');
    const instructions: PlantCareInstructions[] = await table.getByField('plantId', plantId);
    const sorted = sortArrayByKey('createdAt', 'DESC', instructions);
    const instruction = sorted[0];
    return instruction || null;
}



