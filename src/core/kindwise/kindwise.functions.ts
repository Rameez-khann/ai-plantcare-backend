import { generateUniqueId } from "victor-dev-toolbox";
import { HttpClient } from "../http/http"
import { KindwiseConfig, kindwiseHeaders } from "./kindwise.config";
import { KindWiseHealthResult, KindwiseResult, PlantDisease, PlantHealthResult, PlantIdentificationResult } from "./kindwise.interface";
import { savePlantHealth } from "../../features/indoor-plants/plant-health";

const httpClient = new HttpClient();


function kindwiseToPlantIdentification(result: KindwiseResult): PlantIdentificationResult {

    const identification = {
        isPlant: result.is_plant.binary,
        probability: result.is_plant.probability,
        classification: result.classification.suggestions?.map(suggestion => ({
            id: suggestion.id,
            name: suggestion.name,
            probability: suggestion.probability,
            similarImages: suggestion.similar_images.map(img => img.url)
        })),
    };
    const classification = identification.classification.slice(0, 1);
    identification.classification = classification;
    return identification;
}

export function kindwiseToPlantHealth(result: KindWiseHealthResult): PlantHealthResult {
    const suggestion = result.disease.suggestions[0] || null;
    let disease: PlantDisease | null = null;
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

export async function sendImageForIdentification(input: { image: string, userId?: string, plantId?: string, imageURL?: string }): Promise<PlantIdentificationResult | null> {
    // const url = `${KindwiseConfig.apiURL}/identification`;
    const { image, userId, plantId } = input;

    const url = `${KindwiseConfig.apiURL}/identification`;
    const payload = {
        images: [image],
        "similar_images": true
    }
    const health = await sendImageForHealthCheck({ image, userId, plantId });
    try {
        const response = await httpClient.post(url, payload, { headers: kindwiseHeaders });

        if (response?.result) {
            const result = kindwiseToPlantIdentification(response.result);
            if (health) {
                result.health = health;
            }
            return result;
        }
    } catch (error) {
        console.error(error);

    }



    return null;

}

export async function sendImageForHealthCheck(input: { image: string, userId?: string, plantId?: string, imageURL?: string }): Promise<PlantHealthResult | null> {
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
        return result;
    }

    return null;

}



