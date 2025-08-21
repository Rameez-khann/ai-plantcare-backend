

import { PlantCareInstructions } from "../../features/indoor-plants/interfaces/indoor-plant.interface"

export interface KindwiseResult {
    plantId: string,
    is_plant: {
        probability: number,
        binary: boolean,
        threshold: number,
    }

    classification: {
        suggestions: {
            id: string,
            name: string,
            probability: number,
            similar_images: {
                id: string,
                url: string,
                similarity: number,
                url_small: string,
            }[]
        }[],

    }
}

export interface PlantSuggestion {
    id: string,
    name: string,
    probability: number,
    similarImages: string[],
    instructions?: PlantCareInstructions,
}


export interface PlantIdentificationResult {
    id: string,
    identification?: string,
    userId?: string,
    isPlant: boolean,
    probability: number,
    name: string,
    classification: PlantSuggestion,
    health?: PlantHealthResult,
    imageUrl?: string,
    plantId: string,
    html?: string,
}

export interface PlantDiseaseInfo {
    id: string,
    name: PlantSymptoms,
    probability: number,
    similarImages: string[],
}



export interface PlantHealthResult {
    id: string,
    userId?: string,
    isPlant: boolean,
    probability: number,
    disease: PlantDiseaseInfo | null,
    plantId?: string,
    imageUrl?: string,
    healthy?: string,
    createdAt?: string,
    instructions?: PlantCareInstructions,
}




export enum PlantSymptoms {
    NUTRIENT_DEFICIENCY = "nutrient deficiency",
    EXCESS_WATER = "water excess or uneven watering",
    WATER_DEFICIENCY = "water deficiency",
    LACK_OF_LIGHT = "lack of light",
    EXCESS_LIGHT = "light excess",
    SENESCENCE = "senescence",
    FUNGI = "Fungi",
    INVALID = "Invalid"
}

export enum PlantDiseasesEnums {
    NutrientDeficiency = "nutrient deficiency",
    WaterExcessOrUneven = "water excess or uneven watering",
    LackOfLight = "lack of light",
    LightExcess = "light excess",
    WaterDeficiency = "water deficiency",
    Senescence = "senescence"
}


// export interface PlantDiseaseInfo {
//     id: string,
//     name: string,
//     probability: number,
//     similarImages: string[],
// }


export interface KindWiseHealthResult {
    is_plant: {
        probability: number,
        binary: boolean,
        threshold: number,
    }

    is_healthy: {
        probability: number,
        binary: boolean,
        threshold: number,
    },
    disease: {
        suggestions: {
            id: string,
            name: PlantSymptoms,
            probability: number,
            similar_images: {
                id: string,
                url: string,
                similarity: number,
                url_small: string,
            }[]
        }[]
    }
}
