// composables/useRoleIcons.ts
export const useRoleIcons = () => {
    const roleIconMap: Record<string, string> = {
        'System': 'x:laptop',
        'Admin': 'x:setting',
        'Executive': 'x:large-suitcase',
        'Technician': 'x:tools',
        'Support': 'x:headset-help',
        'Monitoring': 'x:graph-up',
        'Operator': 'x:user ',
        'Supervisor': 'x:file-heck',
        'Reporting': 'x:presentation'
    };

    const defaultIcon = 'x:user';

    const getIconForRole = (roleName: string): string => {
        if (!roleName) return defaultIcon;

        const normalizedRole = roleName.trim();
        return roleIconMap[normalizedRole] || defaultIcon;
    };

    console.log('que tal',getIconForRole);
    return {
        getIconForRole
    };
};