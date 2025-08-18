export interface IndoorPlant {
    id: string;
    name: string;
    scientificName: string;
    image: string;
    careLevel: 'Easy' | 'Moderate' | 'Advanced';
    //   light: 'Low' | 'Medium' | 'Bright' | 'Bright indirect' | 'Bright direct';
    light: string;
    waterFrequency: number; // days between watering
    waterVolume: number; // ml
    fertilizer: string;
    nutritionFrequency: number; // days between feeding
    soilType: string;
    notes: string;
}

export enum SoilType {
    SAND = 'Sand',
    LOAM = 'Loam',
    CLAY = 'Clay',
    PEAT = 'Peat',
    CHALK = 'Chalk',
    SILT = 'Silt',
    WELL_DRAINING = 'Well-draining mix'
}

export enum SunlightRequirement {
    // FULL_SUN = 'Full sunshine. Expose to as much sunlight as possible',
    // PARTIAL_SUN = '',
    // INDIRECT = 'Bright Indirect',
    // LOW_LIGHT = 'Low Light'
    FULL_SUN = 'Place in direct sunlight all day',
    PARTIAL_SUN = 'Give some direct sun, some shade',
    INDIRECT = 'Keep in bright light, no direct sun',
    LOW_LIGHT = 'Keep in low light or shade'
}

export interface PlantNutrition {
    nutrient: string;
    quantity: number; // grams
    interval: number; // days
}

export interface PlantCareInstructions {
    id: string;
    genus: string;
    scientificName?: string,
    waterVolume: number; // ml
    wateringInterval: number; // days
    nutrition: PlantNutrition[];
    soilType: SoilType;
    sunlight: SunlightRequirement;
    imageURl?: string,
}

export interface UserPlants {
    id: string,
    userId: string,
    scientificNames: string[]
}
