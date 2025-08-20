/**
 * Generates the CSS styles for the plant history component
 */
export const generateHistoryStyles = (): string => {
    return `
        <style>
            .plant-history-container {
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
            
            .history-header {
                background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
                color: var(--white);
                padding: 2rem;
                position: relative;
                overflow: hidden;
            }
            
            .history-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
                opacity: 0.1;
            }
            
            .history-title {
                position: relative;
                z-index: 1;
                font-size: 2rem;
                font-weight: 700;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .history-subtitle {
                position: relative;
                z-index: 1;
                opacity: 0.9;
                margin: 0.5rem 0 0 0;
                font-size: 1rem;
            }
            
            .history-stats {
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
            
            .history-table-container {
                padding: 0;
                overflow-x: auto;
            }
            
            .history-table {
                width: 100%;
                border-collapse: collapse;
                background: var(--white);
            }
            
            .history-table thead {
                background: var(--cream);
                border-bottom: 2px solid var(--accent-green);
            }
            
            .history-table th {
                padding: 1rem;
                text-align: left;
                font-weight: 600;
                color: var(--primary-green);
                font-size: 0.9rem;
                position: sticky;
                top: 0;
                background: var(--cream);
                z-index: 10;
            }
            
            .history-table td {
                padding: 1rem;
                border-bottom: 1px solid #e9ecef;
                vertical-align: middle;
                color: var(--text-dark);
                font-size: 0.85rem;
            }
            
            .history-table tbody tr:hover {
                background: rgba(127, 176, 105, 0.05);
                transition: var(--transition);
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                white-space: nowrap;
            }
            
            .status-healthy {
                background: rgba(76, 175, 80, 0.1);
                color: #2e7d32;
                border: 1px solid rgba(76, 175, 80, 0.3);
            }
            
            .status-diseased {
                background: rgba(244, 67, 54, 0.1);
                color: #c62828;
                border: 1px solid rgba(244, 67, 54, 0.3);
            }
            
            .status-not-plant {
                background: rgba(158, 158, 158, 0.1);
                color: #616161;
                border: 1px solid rgba(158, 158, 158, 0.3);
            }
            
            .probability-bar {
                width: 60px;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                display: inline-block;
                vertical-align: middle;
            }
            
            .probability-fill {
                height: 100%;
                border-radius: 4px;
                transition: var(--transition);
            }
            
            .probability-high {
                background: linear-gradient(90deg, #4caf50, #8bc34a);
            }
            
            .probability-medium {
                background: linear-gradient(90deg, #ff9800, #ffc107);
            }
            
            .probability-low {
                background: linear-gradient(90deg, #f44336, #ff7043);
            }
            
            .disease-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .disease-name {
                font-weight: 600;
                color: var(--primary-green);
            }
            
            .disease-probability {
                font-size: 0.75rem;
                color: var(--text-light);
            }
            
            .image-thumbnail {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                object-fit: cover;
                border: 2px solid var(--cream);
                cursor: pointer;
                transition: var(--transition);
            }
            
            .image-thumbnail:hover {
                transform: scale(1.1);
                border-color: var(--accent-green);
            }
            
            .time-info {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .time-relative {
                font-weight: 600;
                color: var(--text-dark);
            }
            
            .time-absolute {
                font-size: 0.7rem;
                color: var(--text-light);
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
            
            .action-buttons {
                display: flex;
                gap: 0.5rem;
            }
            
            .btn-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                transition: var(--transition);
            }
            
            .btn-view {
                background: var(--accent-green);
                color: var(--white);
            }
            
            .btn-delete {
                background: #f44336;
                color: var(--white);
            }
            
            .btn-icon:hover {
                transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
                .history-header {
                    padding: 1.5rem;
                }
                
                .history-title {
                    font-size: 1.5rem;
                }
                
                .history-stats {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .history-table th,
                .history-table td {
                    padding: 0.75rem 0.5rem;
                    font-size: 0.8rem;
                }
                
                .action-buttons {
                    flex-direction: column;
                }
            }
        </style>
    `;
};