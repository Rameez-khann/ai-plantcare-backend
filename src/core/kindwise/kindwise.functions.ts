import { generateUniqueId } from "victor-dev-toolbox";
import { HttpClient } from "../http/http"
import { KindwiseConfig, kindwiseHeaders } from "./kindwise.config";
import { KindWiseHealthResult, KindwiseResult, PlantDiseaseInfo, PlantHealthResult, PlantIdentificationResult } from "./kindwise.interface";
import { savePlantHealth } from "../../features/indoor-plants/plant-health";
import { PlantAnalysis } from "../tensorflow/plant-analysis";

const httpClient = new HttpClient();


function kindwiseToPlantIdentification(result: KindwiseResult, plantId: string, userId?: string): PlantIdentificationResult {
    console.log(result);

    const classification = result.classification.suggestions[0];
    const identification = {
        id: plantId,
        isPlant: result.is_plant.binary,
        probability: result.is_plant.probability,
        plantId,
        userId,
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

export async function sendImageForIdentification(input: { image: string, userId?: string, imageURL?: string, plantId: string, }): Promise<PlantIdentificationResult | null> {
    // const url = `${KindwiseConfig.apiURL}/identification`;
    const { plantId, image, userId } = input;
    // const plantId = generateUniqueId();
    const url = `${KindwiseConfig.apiURL}/identification`;
    const payload = {
        images: [image],
        "similar_images": true
    }
    const health = await sendImageForHealthCheck({ image, userId, plantId });
    try {
        const response = await httpClient.post(url, payload, { headers: kindwiseHeaders });

        if (response?.result) {
            const result = kindwiseToPlantIdentification(response.result, plantId);
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

        const plantAnalysis = new PlantAnalysis();
        const analysis = await plantAnalysis.analyzeCurrentResults(plantId, response)
        savePlantHealth(result);
        return result;
    }

    return null;

}



