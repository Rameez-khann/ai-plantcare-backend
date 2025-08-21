/**
 * Generates the CSS styles for the plant care instructions component
 */
export const generateInstructionsStyles = (): string => {
    return `
        <style>
            .plant-instructions-container {
                --primary-green: #2d5016;
                --secondary-green: #4a7c59;
                --accent-green: #7fb069;
                --light-green: #a7c957;
                --cream: #f2e8cf;
                --white: #ffffff;
                --text-dark: #2c3e50;
                --text-light: #7f8c8d;
                --shadow: rgba(0, 0, 0, 0.1);
                --shadow-hover: rgba(0, 0, 0, 0.15);
                --border-radius: 12px;
                --transition: all 0.3s ease;
                
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: var(--white);
                border-radius: var(--border-radius);
                box-shadow: 0 4px 12px var(--shadow);
                overflow: hidden;
                margin: 2rem 0;
            }
            
            .instructions-header {
                background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
                color: var(--white);
                padding: 2rem;
                position: relative;
                overflow: hidden;
            }
            
            .instructions-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
                opacity: 0.1;
            }
            
            .instructions-title {
                position: relative;
                z-index: 1;
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .instructions-subtitle {
                position: relative;
                z-index: 1;
                opacity: 0.9;
                margin: 0.5rem 0 0 0;
                font-size: 1rem;
            }
            
            .instructions-stats {
                position: relative;
                z-index: 1;
                display: flex;
                gap: 2rem;
                margin-top: 1rem;
                font-size: 0.9rem;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                padding: 0.5rem 1rem;
                border-radius: 20px;
            }
            
            .instructions-list {
                padding: 1.5rem;
                background: var(--white);
            }
            
            .instruction-card {
                background: var(--white);
                border: 1px solid #e9ecef;
                border-radius: var(--border-radius);
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 2px 8px var(--shadow);
                transition: var(--transition);
                position: relative;
            }
            
            .instruction-card:hover {
                box-shadow: 0 4px 16px var(--shadow-hover);
            }
            
            .plant-header {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                align-items: flex-start;
            }
            
            .plant-image {
                width: 80px;
                height: 80px;
                border-radius: var(--border-radius);
                object-fit: cover;
                border: 2px solid var(--cream);
                flex-shrink: 0;
            }
            
            .plant-image-placeholder {
                width: 80px;
                height: 80px;
                border-radius: var(--border-radius);
                background: var(--cream);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-light);
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .plant-names {
                flex: 1;
            }
            
            .plant-genus {
                font-size: 1.4rem;
                font-weight: 700;
                color: var(--primary-green);
                margin: 0 0 0.25rem 0;
            }
            
            .plant-scientific {
                font-size: 1rem;
                font-style: italic;
                color: var(--text-light);
                margin: 0;
            }
            
            .care-sections {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
            }
            
            .care-section {
                background: rgba(127, 176, 105, 0.05);
                border: 1px solid var(--accent-green);
                border-radius: var(--border-radius);
                padding: 1rem;
            }
            
            .section-title {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                color: var(--primary-green);
                margin: 0 0 0.75rem 0;
            }
            
            .section-content {
                color: var(--text-dark);
                line-height: 1.5;
            }
            
            .watering-info {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .watering-detail {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }
            
            .watering-value {
                font-weight: 600;
                color: var(--primary-green);
            }
            
            .nutrition-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .nutrition-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                background: var(--white);
                border-radius: 8px;
                font-size: 0.85rem;
            }
            
            .nutrient-name {
                font-weight: 600;
                color: var(--primary-green);
            }
            
            .nutrient-details {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 0.1rem;
            }
            
            .nutrient-quantity {
                font-weight: 600;
                color: var(--text-dark);
            }
            
            .nutrient-interval {
                font-size: 0.75rem;
                color: var(--text-light);
            }
            
            .soil-type {
                font-weight: 600;
                color: var(--primary-green);
                font-size: 1rem;
            }
            
            .sunlight-requirement {
                font-weight: 500;
                color: var(--text-dark);
                font-size: 0.95rem;
            }
            
            .empty-state {
                text-align: center;
                padding: 3rem;
                color: var(--text-light);
            }
            
            .empty-state-icon {
                font-size: 4rem;
                color: var(--light-green);
                margin-bottom: 1rem;
            }
            
            @media (max-width: 768px) {
                .instructions-header {
                    padding: 1.5rem;
                }
                
                .instructions-title {
                    font-size: 1.5rem;
                }
                
                .instructions-stats {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .instruction-card {
                    padding: 1rem;
                }
                
                .plant-header {
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .care-sections {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
            }
        </style>
    `;
};