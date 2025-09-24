import { useOptions } from "../useOptions";
import { MENU_STRUCTURE } from "./menuStructure";


export const useRoleComparison = () => {
    const { roleOptions, loading: optionsLoading, loadRoleOptions } = useOptions();

    // Estado reactivo para las columnas de comparación
    const comparisonColumns = ref([
        {
            selectedRole: '',
            permissions: generateDefaultPermissions()
        },
        {
            selectedRole: '',
            permissions: generateDefaultPermissions()
        }
    ]);

    // Función para generar permisos por defecto
    function generateDefaultPermissions(): boolean[] {
        const totalPermissions = MENU_STRUCTURE.reduce((acc, section) => {
            return acc + (section.children?.length || 1);
        }, 0);

        // Los primeros 10 son true, el resto false (como en el código original)
        return Array.from({ length: totalPermissions }, (_, index) => index < 10);
    }

    // Función para actualizar el rol seleccionado
    const updateRole = (columnIndex: number, newRole: string) => {
        comparisonColumns.value[columnIndex].selectedRole = newRole;
        // Aquí podrías cargar los permisos específicos del rol
        // comparisonColumns.value[columnIndex].permissions = await loadRolePermissions(newRole);
    };

    // Cargar opciones al montar
    onMounted(async () => {
        await loadRoleOptions();
    });

    return {
        roleOptions,
        optionsLoading,
        comparisonColumns: readonly(comparisonColumns),
        menuItems: MENU_STRUCTURE,
        updateRole
    };
};