import { HttpClient } from "../http/http"
import { KindwiseConfig, kindwiseHeaders } from "./kindwise.config";
import { KindwiseResult, PlantIdentificationResult } from "./kindwise.interface";

const httpClient = new HttpClient();


export function kindwiseToPlantIdentification(result: KindwiseResult): PlantIdentificationResult {
    return {
        isPlant: result.is_plant.binary,
        probability: result.is_plant.probability,
        classification: result.classification.suggestions.map(suggestion => ({
            id: suggestion.id,
            name: suggestion.name,
            probability: suggestion.probability,
            similarImages: suggestion.similar_images.map(img => img.url)
        }))
    };
}

export async function sendImageForIdentification(image: string): Promise<PlantIdentificationResult | null> {
    const url = `${KindwiseConfig.apiURL}/identification`;
    const payload = {
        images: [image],
        "similar_images": true
    }
    const response = await httpClient.post(url, payload, { headers: kindwiseHeaders });

    if (response?.result) {
        return kindwiseToPlantIdentification(response.result);
    }

    return null;

}