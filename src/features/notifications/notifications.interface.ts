export enum NotificationType {
    WATERING_REMINDER = 'watering_reminder',
    FERTILIZING_REMINDER = 'fertilizing_reminder',
    HEALTH_ALERT = 'health_alert',
    CARE_ADJUSTMENT = 'care_adjustment',
    SEASONAL_TIP = 'seasonal_tip',
    ACHIEVEMENT = 'achievement',
    EMERGENCY = 'emergency'
}

export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

// export enum NotificationChannel {
//     EMAIL = 'email',
//     PUSH = 'push',
//     SMS = 'sms',
//     IN_APP = 'in_app'
// }

export interface NotificationTemplate {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    variables: string[]; // e.g., ['plantName', 'daysOverdue', 'recommendedAction']
    // channels: NotificationChannel[];
    priority: NotificationPriority;
}

export interface Notification {
    id: string;
    userId: string;
    plantId?: string;
    type: NotificationType;
    priority: NotificationPriority;
    // channels: NotificationChannel[];
    title: string;
    body: string;
    scheduledFor: Date;
    sentAt?: Date;
    readAt?: Date;
    actionUrl?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

export interface NotificationPreferences {
    userId: string;
    enabledTypes: NotificationType[];
    // preferredChannels: NotificationChannel[];
    quietHours: { start: string; end: string }; // e.g., "22:00" to "08:00"
    timezone: string;
    frequency: 'immediate' | 'daily_digest' | 'weekly_digest';
}

export interface NotificationPrediction {
    shouldSend: boolean;
    optimalTime: Date;
    urgencyScore: number; // 0-1 scale
    engagementProbability: number; // 0-1 scale
    // recommendedChannel: NotificationChannel;
    personalizedContent: {
        title: string;
        body: string;
    };
}


