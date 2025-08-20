import { PlantHealthResult, PlantDiseaseInfo } from "../../core/kindwise/kindwise.interface";
import { generateHistoryStyles } from "./plant-history-styles";




/**
 * Calculates relative time from timestamp
 */
const getRelativeTime = (timestamp: Date | string): { relative: string; absolute: string } => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let relative: string;
    if (minutes < 60) {
        relative = minutes <= 1 ? 'Just now' : `${minutes} min ago`;
    } else if (hours < 24) {
        relative = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
        relative = days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
        relative = date.toLocaleDateString();
    }

    const absolute = date.toLocaleString();

    return { relative, absolute };
};

/**
 * Determines probability level based on value
 */
const getProbabilityLevel = (probability: number): 'high' | 'medium' | 'low' => {
    if (probability >= 0.8) return 'high';
    if (probability >= 0.5) return 'medium';
    return 'low';
};

/**
 * Generates status badge HTML
 */
const generateStatusBadge = (result: PlantHealthResult): string => {
    if (!result.isPlant) {
        return `
            <span class="status-badge status-not-plant">
                <i class="fas fa-question-circle"></i>
                Not a plant
            </span>
        `;
    }

    if (result.disease) {
        return `
            <span class="status-badge status-diseased">
                <i class="fas fa-exclamation-triangle"></i>
                Disease detected
            </span>
        `;
    }

    return `
        <span class="status-badge status-healthy">
            <i class="fas fa-check-circle"></i>
            Healthy
        </span>
    `;
};

/**
 * Generates probability bar HTML
 */
const generateProbabilityBar = (probability: number): string => {
    const level = getProbabilityLevel(probability);
    const percentage = Math.round(probability * 100);

    return `
        <div class="probability-bar">
            <div class="probability-fill probability-${level}" style="width: ${percentage}%"></div>
        </div>
        <span style="margin-left: 0.5rem; font-size: 0.75rem;">${percentage}%</span>
    `;
};

/**
 * Generates disease info HTML
 */
const generateDiseaseInfo = (disease: PlantDiseaseInfo | null): string => {
    if (!disease) {
        return '<span style="color: var(--text-light);">-</span>';
    }

    return `
        <div class="disease-info">
            <span class="disease-name">${disease.name}</span>
            <span class="disease-probability">${Math.round(disease.probability * 100)}% confidence</span>
        </div>
    `;
};

/**
 * Generates image thumbnail HTML
 */
const generateImageThumbnail = (imageUrl?: string): string => {
    if (!imageUrl) {
        return `
            <div style="width: 40px; height: 40px; background: var(--cream); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-image" style="color: var(--text-light);"></i>
            </div>
        `;
    }

    return `
        <img src="${imageUrl}" alt="Plant scan" class="image-thumbnail" onclick="viewImage('${imageUrl}')" />
    `;
};

/**
 * Generates time info HTML
 */
const generateTimeInfo = (timestamp?: Date | string): string => {
    if (!timestamp) {
        return '<span style="color: var(--text-light);">-</span>';
    }

    const { relative, absolute } = getRelativeTime(timestamp);

    return `
        <div class="time-info">
            <span class="time-relative">${relative}</span>
            <span class="time-absolute">${absolute}</span>
        </div>
    `;
};

/**
 * Generates action buttons HTML
 */
const generateActionButtons = (result: PlantHealthResult): string => {
    return `
        <div class="action-buttons">
            <button class="btn-icon btn-view" onclick="viewResult('${result.id}')" title="View details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteResult('${result.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
};

/**
 * Generates statistics for the header
 */
const generateHistoryStats = (history: PlantHealthResult[]): string => {
    const totalScans = history.length;
    const healthyCount = history.filter(h => h.isPlant && !h.disease).length;
    const diseasedCount = history.filter(h => h.disease).length;
    const notPlantCount = history.filter(h => !h.isPlant).length;

    return `
        <div class="history-stats">
            <div class="stat-item">
                <i class="fas fa-camera"></i>
                <span>${totalScans} total scans</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-check-circle"></i>
                <span>${healthyCount} healthy</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${diseasedCount} diseased</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-question-circle"></i>
                <span>${notPlantCount} not plants</span>
            </div>
        </div>
    `;
};

/**
 * Generates table row HTML for a single result
 */
const generateTableRow = (result: PlantHealthResult): string => {
    return `
        <tr>
            <td>${generateImageThumbnail(result.imageUrl)}</td>
            <td>${generateTimeInfo(result.createdAt)}</td>
            <td>${generateStatusBadge(result)}</td>
            <td>${generateProbabilityBar(result.probability)}</td>
            <td>${generateDiseaseInfo(result.disease)}</td>
            <td>${generateActionButtons(result)}</td>
        </tr>
    `;
};

/**
 * Generates the complete table HTML
 */
const generateHistoryTable = (history: PlantHealthResult[]): string => {
    if (history.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-seedling"></i>
                </div>
                <h3>No plant health scans yet</h3>
                <p>Start by uploading a plant photo to check its health status.</p>
            </div>
        `;
    }

    // Sort by timestamp (most recent first)
    const sortedHistory = [...history].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    return `
        <div class="history-table-container">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Confidence</th>
                        <th>Disease Info</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedHistory.map(result => generateTableRow(result)).join('')}
                </tbody>
            </table>
        </div>
    `;
};

/**
 * Main function that generates the complete plant history HTML
 */
export function showPlantHistory(history: PlantHealthResult[]): string {
    return `
        ${generateHistoryStyles()}
        <div class="plant-history-container">
            <div class="history-header">
                <h2 class="history-title">
                    <i class="fas fa-history"></i>
                    Plant Health History
                </h2>
                <p class="history-subtitle">Track your plant health scans and monitoring results</p>
                ${generateHistoryStats(history)}
            </div>
            ${generateHistoryTable(history)}
        </div>
        
        <script>
            // Helper functions for interactions
            function viewImage(imageUrl) {
                // Open image in modal or new tab
                window.open(imageUrl, '_blank');
            }
            
            function viewResult(resultId) {
                // Handle viewing detailed result
                console.log('Viewing result:', resultId);
                // Implement your view logic here
            }
            
            function deleteResult(resultId) {
                if (confirm('Are you sure you want to delete this scan result?')) {
                    // Handle deletion
                    console.log('Deleting result:', resultId);
                    // Implement your delete logic here
                }
            }
        </script>
    `;
};