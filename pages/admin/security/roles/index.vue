<template>
    <div class="flex flex-col gap-12">
        <XHeader title="Accesos y roles" :breadcrumb-items="itemsBreadRolesAccess" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <p class="text-gray-800">Consulta los accesos configurados para cada rol del sistema y verifica la relación entre perfiles y permisos asignados.</p>
            </template>
        </XHeader>
        <div class="flex flex-row items-center justify-center gap-10">
            <div class="min-h-[60.143rem] flex items-end">
                <div class="bg-gray-50 pl-12 pr-8 rounded-[1.143rem] mt-[120px]">
                    <table>
                        <template v-for="(category, categoryIndex) in categoriesWithFeatures" :key="category.categoryName">
                            <tr>
                                <td 
                                    :rowspan="category.features.length" 
                                    class="border-b py-12 pl-16 pr-28 text-[1.143rem] font-semibold"
                                    :class="{ 'py-6': category.features.length === 1 }"
                                >
                                    {{ category.categoryName }}
                                </td>
                                <td class="border-b py-6 px-8 text-gray-700">
                                    {{ category.features[0] }}
                                </td>
                            </tr>
                            
                            <tr 
                                v-for="(feature, featureIndex) in category.features.slice(1)" 
                                :key="`${categoryIndex}-${featureIndex + 1}`"
                                class="py-6"
                            >
                                <td class="border-b py-6 pl-8 text-gray-700">
                                    {{ feature }}
                                </td>
                            </tr>
                        </template>
                    </table>
                </div>
            </div>

            <div class="flex flex-row gap-8 items-start">
			<div class="min-w-[15.536rem] min-h-[60.143rem] flex flex-col gap-8">
			    <XSelect 
        	        name="rol"
        	        label="Comparar con" 
        	        label-required
        	        v-model="RoleCompare1" 
        	        :options="roleOptionsForCompare1" 
        	        optionLabel="label" 
        	        optionValue="value"
			    	optionDisabled="disabled"
        	        placeholder="Selecciona el rol" 
        	        :loading="optionsLoading"
        	        :dropdown="true"
        	        appendTo="body"
			    	class="flex items-top"
        	    />
			    <div class="min-h-[54.143rem]">
			    	<table class="min-w-[15.536rem] ">
			    		<thead>
			    			<th class="min-h-[3.857rem] p-8  bg-secondary-200 rounded-t-[1.143rem] ">
			    				<div class="flex flex-row gap-4 items-center justify-center text-primary ">
			    					<Icon :name="getRoleIcon(RoleCompare1)" class="w-10 h-10 "/> 
			    					<span class="text-[1.143rem] font-semibold">{{ getRoleTitle(RoleCompare1) }}</span>
			    				</div>
			    			</th>
			    		</thead>
			    		<tbody class="flex flex-col  shadow-[6px_6px_12px_0_rgba(12,85,248,0.12)]  rounded-b-[1.143rem]">
			    			<tr v-for="(access, index) in getAccessListForRole(RoleCompare1)" :key="`role1-${index}`">
			    			    <div class="px-8 flex flex-col">
			    			        <td class="border-b py-6 text-center">
			    			            <AccessIcon :has-access="access"/>
			    			        </td>
			    			    </div>
			    			</tr>
			    		</tbody>	
			    	</table>
			    </div>
        	</div>
			<div class="min-w-[15.536rem] min-h-[60.143rem] flex flex-col gap-8">
                <XSelect 
        		    name="rol"
        		    label="Comparar con" 
        		    label-required
        		    v-model="RoleCompare2" 
        		    :options="roleOptionsForCompare2" 
        		    optionLabel="label" 
        		    optionValue="value"
					optionDisabled="disabled"
        		    placeholder="Selecciona el rol" 
        		    :loading="optionsLoading"
        		    :dropdown="true"
        		    appendTo="body"
					class="flex items-top"
        		/>
				<div class="min-h-[54.143rem]">
					<table v-if="RoleCompare2" class="min-w-[15.536rem] ">
						<thead>
							<th class="min-h-[3.857rem] text-[1.143rem] p-8 text-primary font-semibold bg-secondary-200 rounded-t-[1.143rem]">
								<div class="flex flex-row gap-4 items-center justify-center text-primary ">
									<Icon :name="getRoleIcon(RoleCompare2)" class="w-10 h-10 "/> 
									<span class="text-[1.143rem] font-semibold">{{ getRoleTitle(RoleCompare2) }}</span>
								</div>
							</th>
						</thead>
						<tbody class="flex flex-col  shadow-[6px_6px_12px_0_rgba(12,85,248,0.12)]  rounded-b-[1.143rem]">
							<tr v-for="(access, index) in getAccessListForRole(RoleCompare2)" :key="`role2-${index}`">
							    <div class="px-8 flex flex-col">
							        <td class="border-b py-6 text-center">
							            <AccessIcon :has-access="access"/>
							        </td>
							    </div>
							</tr>
						</tbody>	
					</table>
				</div>
        	</div>
		</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AccessIcon from '~/components/roles/AccessIcon.vue';
import { useRoleIcons } from '~/componsables/roles/useRoleIcon';
import { useRolesService } from '~/componsables/roles/useRoles';
import { useOptions } from '~/componsables/useOptions';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';

const CATEGORIES_MAPPING = {
    'Seguridad': ['Usuarios', 'Accesos y roles'],
    'Configuración': [
        'Administración de canales',
        'Participantes', 
        'Horarios',
        'Enrutamiento y operabilidad',
        'Alertas',
        'Parámetros',
        'Procesos'
    ],
    'Auditoría': ['Bitácora'],
    'Transacciones': [
        'Registro de transacciones',
        'Autorización de transacciones'
    ],
    'Reportes': [
        'Dashboard',
        'Reporte ejecutivo',
        'Reporte operativo',
        'Consulta de XML'
    ]
};

const featuresOrder = computed(() => {
    return roleUserFeatures.value.map(feature => feature.value);
});

const featuresWithLabels = computed(() => {
    return roleUserFeatures.value.map(feature => feature.label);
});

const categoriesWithFeatures = computed(() => {
    const result = [];
    const usedFeatures = new Set(); // Para evitar duplicados
    
    // Usar las features que tienes disponibles
    const availableFeatures = featuresWithLabels.value;
    
    console.log('Features disponibles:', availableFeatures);
    
    // Mapear cada categoría con sus features correspondientes
    for (const [categoryName, expectedFeatures] of Object.entries(CATEGORIES_MAPPING)) {
        const categoryFeatures = [];
        
        // Buscar las features que pertenecen a esta categoría
        expectedFeatures.forEach(expectedFeature => {
            // Buscar coincidencia exacta primero
            let foundFeature = availableFeatures.find(feature => 
                feature === expectedFeature && !usedFeatures.has(feature)
            );
            
            // Si no hay coincidencia exacta, buscar coincidencia parcial
            if (!foundFeature) {
                foundFeature = availableFeatures.find(feature => {
                    const featureLower = feature.toLowerCase();
                    const expectedLower = expectedFeature.toLowerCase();
                    
                    return (
                        (featureLower.includes(expectedLower) || expectedLower.includes(featureLower)) &&
                        !usedFeatures.has(feature)
                    );
                });
            }
            
            if (foundFeature && !usedFeatures.has(foundFeature)) {
                categoryFeatures.push(foundFeature);
                usedFeatures.add(foundFeature); // Marcar como usado
                console.log(`Mapeado: ${expectedFeature} -> ${foundFeature}`);
            }
        });
        
        // Solo agregar la categoría si tiene features
        if (categoryFeatures.length > 0) {
            result.push({
                categoryName,
                features: categoryFeatures
            });
        }
    }
    
    console.log('Categorías dinámicas generadas:', result);
    console.log('Features usadas:', Array.from(usedFeatures));
    
    // Verificar si hay features no mapeadas
    const unmappedFeatures = availableFeatures.filter(feature => !usedFeatures.has(feature));
    if (unmappedFeatures.length > 0) {
        console.warn('Features no mapeadas:', unmappedFeatures);
    }
    
    return result;
});

const itemsBreadRolesAccess = getBreadcrumbItems('roles', 'list');

const { 
    roleAccessOptions, 
    roleUserFeatures,
    roleUserFeaturesCategories,
    loading: optionsLoading, 
    loadAllOptions 
} = useOptions();

const { getIconForRole } = useRoleIcons();
const { roles, loadRolesFeatures, error: rolesError } = useRolesService();

const RoleCompare1 = ref('SYSTEM');
const RoleCompare2 = ref('');

const roleOptionsForCompare1 = computed(() => {
    return roleAccessOptions.value.map(option => ({
        ...option,
        disabled: RoleCompare2.value === option.value
    }));
});

const roleOptionsForCompare2 = computed(() => {
    return roleAccessOptions.value.map(option => ({
        ...option,
        disabled: RoleCompare1.value === option.value
    }));
});

const getRoleIcon = (roleCode: string) => {
    return getIconForRole(roleCode);
};

const getRoleTitle = (roleCode: string) => {
    const selectedRole = roleAccessOptions.value.find(role => role.value === roleCode);
    return selectedRole?.label || 'Rol no encontrado';
};

const getAccessListForRole = (roleCode: string): boolean[] => {
    console.log('Buscando accesos para rol:', roleCode);
    console.log('Features order actual:', featuresOrder.value);
    
    const roleData = roles.value.find(role => role.roleCode === roleCode);
    
    if (!roleData) {
        console.log('Rol no encontrado:', roleCode);
        return featuresOrder.value.map(() => false);
    }
    
    const featureMap = new Map();
    
    roleData.categories.forEach(category => {
        category.features.forEach(feature => {
            featureMap.set(feature.featureCode, feature.hasAccess);
        });
    });
    
    const accessList = featuresOrder.value.map(featureCode => {
        const hasAccess = featureMap.get(featureCode) || false;
        return hasAccess;
    });
    
    return accessList;
};

onMounted(async () => { 
    await loadAllOptions();
    await loadRolesFeatures();
    if (rolesError.value) {
        console.warn('Error cargando roles:', rolesError.value);
    }
});
</script>


