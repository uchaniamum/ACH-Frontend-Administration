// composables/useRoleIcons.ts
export const useRoleIcons = () => {
    const roleIconMap: Record<string, string> = {
        'SYSTEM': 'x:laptop',
        'ADMIN': 'x:setting',
        'EXECUTIVE': 'x:large-suitcase',
        'TECHNICIAN': 'x:tools',
        'SUPPORT': 'x:headset-help',
        'MONITORING': 'x:graph-up',
        'OPERATOR': 'x:user ',
        'SUPERVISOR': 'x:file-heck',
        'REPORTING': 'x:presentation'
    };

    const defaultIcon = 'x:user';

    const getIconForRole = (roleName: string): string => {
        if (!roleName) return defaultIcon;
        console.log('ejemplo de que se muestra: ', roleName);
        const normalizedRole = roleName.trim();
        return roleIconMap[normalizedRole] || defaultIcon;
    };

    console.log('que tal',getIconForRole);
    return {
        getIconForRole
    };
};