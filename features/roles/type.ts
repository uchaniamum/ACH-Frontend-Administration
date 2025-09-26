export interface Feature {
    featureCode: string;
    hasAccess: boolean;
    isActive: boolean;
}

export interface FeatureCategory {
    featureCategoryCode: string;
    features: Feature[];
}

export interface UserRoleFeatures {
    roleCode: string;
    categories: FeatureCategory[];
}

export interface RoleFeaturesResponse {
    userRoleFeatures: UserRoleFeatures[];
}