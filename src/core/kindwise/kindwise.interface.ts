

import { PlantCareInstructions } from "../../features/indoor-plants/interfaces/indoor-plant.interface"

export interface KindwiseResult {
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

export interface PlantDisease {
    id: string,
    name: string,
    probability: number,
    similarImages: string[],
}

export interface PlantIdentificationResult {
    userId?: string,
    isPlant: boolean,
    probability: number,
    classification: PlantSuggestion[],
    health?: PlantHealthResult,
}

export interface PlantHealthResult {
    id: string,
    userId?: string,
    isPlant: boolean,
    probability: number,
    diseases: PlantDisease[],
}


export enum PlantSymptoms {
    NUTRIENT_DEFICIENCY = "nutrient deficiency",
    EXCESS_WATER = "water excess or uneven watering",
    WATER_DEFICIENCY = "water deficiency",
    LACK_OF_LIGHT = "lack of light",
    EXCESS_LIGHT = "light excess",
    SENESCENCE = "senescence",
}

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
