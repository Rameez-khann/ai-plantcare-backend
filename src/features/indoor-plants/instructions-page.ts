import { getTimeAgo } from "victor-dev-toolbox";
import { generateInstructionsStyles } from "./instruction-styles";
import { SunlightRequirement, SoilType, PlantNutrition, PlantCareInstructions } from "./interfaces/indoor-plant.interface";



/**
 * Gets sunlight icon based on requirement
 */
const getSunlightIcon = (sunlight: SunlightRequirement): string => {
    switch (sunlight) {
        case SunlightRequirement.FULL_SUN:
            return 'fas fa-sun';
        case SunlightRequirement.PARTIAL_SUN:
            return 'fas fa-cloud-sun';
        case SunlightRequirement.INDIRECT:
            return 'fas fa-lightbulb';
        case SunlightRequirement.LOW_LIGHT:
            return 'fas fa-moon';
        default:
            return 'fas fa-sun';
    }
};

/**
 * Gets soil icon based on type
 */
const getSoilIcon = (soilType: SoilType): string => {
    switch (soilType) {
        case SoilType.SAND:
            return 'fas fa-mountain';
        case SoilType.CLAY:
            return 'fas fa-cube';
        case SoilType.PEAT:
            return 'fas fa-seedling';
        case SoilType.WELL_DRAINING:
            return 'fas fa-filter';
        default:
            return 'fas fa-globe';
    }
};

/**
 * Generates plant image HTML
 */
const generatePlantImage = (imageUrl?: string): string => {
    if (!imageUrl) {
        return `
            <div class="plant-image-placeholder">
                <i class="fas fa-leaf"></i>
            </div>
        `;
    }

    return `<img src="${imageUrl}" alt="Plant image" class="plant-image" />`;
};

/**
 * Generates watering information HTML
 */
const generateWateringSection = (waterVolume: number, wateringInterval: number): string => {
    return `
        <div class="care-section">
            <h4 class="section-title">
                <i class="fas fa-tint"></i>
                Watering Requirements
            </h4>
            <div class="section-content">
                <div class="watering-info">
                    <div class="watering-detail">
                        <i class="fas fa-eyedropper"></i>
                        <span>Volume: <span class="watering-value">${waterVolume} ml</span></span>
                    </div>
                    <div class="watering-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Every <span class="watering-value">${wateringInterval} ${wateringInterval === 1 ? 'day' : 'days'}</span></span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

/**
 * Generates nutrition information HTML
 */
const generateNutritionSection = (nutrition: PlantNutrition[]): string => {
    if (nutrition.length === 0) {
        return `
            <div class="care-section">
                <h4 class="section-title">
                    <i class="fas fa-seedling"></i>
                    Nutrition Requirements
                </h4>
                <div class="section-content">
                    <span style="color: var(--text-light); font-style: italic;">No specific nutrition requirements</span>
                </div>
            </div>
        `;
    }

    const nutritionItems = nutrition.map(item => `
        <div class="nutrition-item">
            <span class="nutrient-name">${item.nutrient}</span>
            <div class="nutrient-details">
                <span class="nutrient-quantity">${item.quantity}g</span>
                <span class="nutrient-interval">Every ${item.interval} ${item.interval === 1 ? 'day' : 'days'}</span>
            </div>
        </div>
    `).join('');

    return `
        <div class="care-section">
            <h4 class="section-title">
                <i class="fas fa-seedling"></i>
                Nutrition Requirements
            </h4>
            <div class="section-content">
                <div class="nutrition-list">
                    ${nutritionItems}
                </div>
            </div>
        </div>
    `;
};

/**
 * Generates soil information HTML
 */
const generateSoilSection = (soilType: SoilType): string => {
    return `
        <div class="care-section">
            <h4 class="section-title">
                <i class="${getSoilIcon(soilType)}"></i>
                Soil Requirements
            </h4>
            <div class="section-content">
                <div class="soil-type">${soilType}</div>
            </div>
        </div>
    `;
};

/**
 * Generates sunlight information HTML
 */
const generateSunlightSection = (sunlight: SunlightRequirement): string => {
    return `
        <div class="care-section">
            <h4 class="section-title">
                <i class="${getSunlightIcon(sunlight)}"></i>
                Light Requirements
            </h4>
            <div class="section-content">
                <div class="sunlight-requirement">${sunlight}</div>
            </div>
        </div>
    `;
};

/**
 * Generates a single care instruction card HTML
 */
const generateInstructionCard = (instruction: PlantCareInstructions): string => {
    return `
        <div class="instruction-card">
            <div class="plant-header">
                ${generatePlantImage(instruction.imageURl)}
                <div class="plant-names">
                    <h3 class="plant-genus">${instruction.genus}</h3>
                    ${instruction.scientificName ? `<p class="plant-scientific">${instruction.scientificName}</p>` : ''}
                </div>
            </div>
            
            <div class="care-sections">
                ${generateWateringSection(instruction.waterVolume, instruction.wateringInterval)}
                ${generateNutritionSection(instruction.nutrition)}
                ${generateSoilSection(instruction.soilType)}
                ${generateSunlightSection(instruction.sunlight)}
            </div>
        </div>
    `;
};

/**
 * Generates statistics for the header
 */
const generateInstructionsStats = (instructions: PlantCareInstructions[]): string => {
    const totalPlants = instructions.length;
    const totalNutrients = instructions.reduce((sum, inst) => sum + inst.nutrition.length, 0);
    const avgWateringInterval = instructions.length > 0
        ? Math.round(instructions.reduce((sum, inst) => sum + inst.wateringInterval, 0) / instructions.length)
        : 0;
    const uniqueGenera = new Set(instructions.map(inst => inst.genus)).size;
    return `
        <div class="instructions-stats">
            <div class="stat-item">
                <i class="fas fa-leaf"></i>
                <span>${totalPlants} plant${totalPlants === 1 ? '' : 's'}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-dna"></i>
                <span>${uniqueGenera} genera</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-tint"></i>
                <span>~${avgWateringInterval} day watering</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-seedling"></i>
                <span>${totalNutrients} nutrients</span>
            </div>
        </div>
    `;
};

/**
 * Generates the complete instructions list HTML
 */
const generateInstructionsList = (instructions: PlantCareInstructions[]): string => {
    if (instructions.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <h3>No plant care instructions yet</h3>
                <p>Add your first plant care guide to start managing your garden systematically.</p>
            </div>
        `;
    }

    // Sort by genus alphabetically
    const sortedInstructions = [...instructions].sort((a, b) =>
        a.genus.localeCompare(b.genus)
    );

    return `
        <div class="instructions-list">
            ${sortedInstructions.map(instruction => generateInstructionCard(instruction)).join('')}
        </div>
    `;
};

/**
 * Main function that generates the complete plant care instructions HTML
 */
export function plantInstructionsUI(instructions: PlantCareInstructions[]): string {
    return `
        ${generateInstructionsStyles()}
        <div class="plant-instructions-container">
            <div class="instructions-header">
                <h2 class="instructions-title">
                    <i class="fas fa-clipboard-list"></i>
                    Plant Care Instructions
                </h2>
                <p class="instructions-subtitle">Comprehensive care guides for your plants</p>
                ${generateInstructionsStats(instructions)}
            </div>
            ${generateInstructionsList(instructions)}
        </div>
    `;
};