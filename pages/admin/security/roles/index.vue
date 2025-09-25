<!-- <template>
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
			    	<tr>
			    		<td rowspan="2" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Seguridad</td>
			    		<td class="border-b py-6 px-8 text-gray-700">Usuarios</td>
			    	</tr>
			    	<tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Accesos y roles</td>
			    	</tr>
        	        <tr>
			    		<td rowspan="7" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Configuración</td>
			    		<td class="border-b py-6 pl-8 text-gray-700">Adm. de canales</td>
			    	</tr>
			    	<tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Participantes</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Horarios</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Contingencia</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Config. de alertas</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Parámetros</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Procesos</td>
			    	</tr>
        	        <tr>
			    		<td class="border-b py-6 pl-16 pr-28 text-[1.143rem]  font-semibold">Auditoría</td>
			    		<td class="border-b py-6 pl-8 text-gray-700">Bitácora</td>
			    	</tr>
        	        <tr>
			    		<td rowspan="2" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Transacciones</td>
			    		<td class="border-b py-6 px-8 text-gray-700">Reg. Transacciones</td>
			    	</tr>
			    	<tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Aut. Transacciones</td>
			    	</tr>
        	        <tr>
			    		<td rowspan="7" class="py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Reportes</td>
			    		<td class="border-b py-6 pl-8 text-gray-700">Dashboard</td>
			    	</tr>
			    	<tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Reporte ejecutivo</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="border-b py-6 pl-8 text-gray-700">Órdenes y mensajes</td>
			    	</tr>
        	        <tr class=" py-6">
			    		<td class="py-6 pl-8 text-gray-700">Rep. de conciliación</td>
			    	</tr>
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


const featuresOrder = computed(() =>{
	return roleUserFeatures.value.map(feature => feature.value)
})

const featuresWithLabels = computed(() => {
    return roleUserFeatures.value.map(feature => feature.label);
});
// State
const itemsBreadRolesAccess = getBreadcrumbItems('roles', 'list');

const { 
    roleAccessOptions, 
	roleUserFeatures,
	roleUserFeaturesCategories,
    loading: optionsLoading, 
    loadAllOptions 
} = useOptions();

const { getIconForRole } = useRoleIcons();
const { roles,  loadRolesFeatures, error: rolesError } = useRolesService()

const RoleCompare1 = ref('SYSTEM');
const RoleCompare2 = ref('');

const roleOptionsForCompare1 = computed(() => {
	return roleAccessOptions.value.map(option => ({
		...option,
		disabled: RoleCompare2.value === option.value
	}));
});

const roleOptionsForCompare2 = computed(() => {
	console.log('hola', roleAccessOptions.value);
	return roleAccessOptions.value.map(option => ({
		...option,
		disabled: RoleCompare1.value === option.value
	}));
});

// const roleIcon1 = computed(() =>{
// 	const selectedRole = roleAccessOptions.value.find(role => role.value === RoleCompare1.value);
// 	console.log('Rol seleccionado: ',selectedRole);
// 	return getIconForRole(selectedRole?.value || '');
// })

// const roleIcon2 = computed(() =>{
// 	const selectedRole = roleAccessOptions.value.find(role => role.value === RoleCompare2.value);
// 	console.log('Rol seleccionado: ',selectedRole);
// 	return getIconForRole(selectedRole?.value || '');
// 	console.log(getIconForRole);
// })

// const roleTitle1 = computed(() => {
// 	const selectedRole = roleAccessOptions.value.find(role => role.value === RoleCompare1.value);
// 	return selectedRole?.label || 'Selecciona un rol';
// });

// const roleTitle2 = computed(() => {
// 	const selectedRole = roleAccessOptions.value.find(role => role.value === RoleCompare2.value);
// 	return selectedRole?.label || 'Selecciona un rol';
// });


// const accessList1 = ref(Array(16).fill(null).map((_, i) => ({
// 	hasAccess: i < 5
// })));

// const accessList2 = ref(Array(16).fill(null).map((_, i) => ({
// 	hasAccess: i < 8
// })));



// onMounted(async () => { 
//     await loadAllOptions()
// 	loadRolesFeatures();
// 	console.log('mas: ', loadRolesFeatures)
// 	console.log('role: ',roleIcon1);
//     if (optionsError.value) {
//         console.warn('No se pudieron cargar las opciones de roles:', optionsError.value)
//     }
// })


// ============= PASO 5: FUNCIONES HELPER =============
const getRoleIcon = (roleCode: string) => {
    return getIconForRole(roleCode);
};

const getRoleTitle = (roleCode: string) => {
    const selectedRole = roleAccessOptions.value.find(role => role.value === roleCode);
    return selectedRole?.label || 'Rol no encontrado';
};

// ============= PASO 6: FUNCIÓN PRINCIPAL PARA OBTENER ACCESOS =============
const getAccessListForRole = (roleCode: string): boolean[] => {
    console.log('Buscando accesos para rol:', roleCode);
	console.log('Features order actual:', featuresOrder.value);
	console.log('Label de features: ', featuresWithLabels.value);
    
    // Buscar el rol en la data
    const roleData = roles.value.find(role => role.roleCode === roleCode);

	console.log('Roles de data: ', roleData);
    
    if (!roleData) {
        console.log('Rol no encontrado:', roleCode);
        return featuresOrder.value.map(() => false);
    }
    
    console.log('Rol encontrado:', roleData);
    
    // Crear un mapa de features para búsqueda rápida
    const featureMap = new Map();
    
    roleData.categories.forEach(category => {
        category.features.forEach(feature => {
            featureMap.set(feature.featureCode, feature.hasAccess);
        });
    });
    
    console.log('Mapa de features:', featureMap);
    
    // Mapear según el orden establecido
    const accessList = featuresOrder.value.map(featureCode => {
        const hasAccess = featureMap.get(featureCode) || false;
        console.log(`${featureCode}: ${hasAccess}`);
        return hasAccess;
    });
    
    console.log('Lista de accesos final:', accessList);
    return accessList;
};

// ============= PASO 7: MOUNT =============
onMounted(async () => { 
    await loadAllOptions();

	await loadRolesFeatures();

	console.log('Hola: ', roleUserFeatures.value.map(feature => feature.label));

	if (rolesError.value) {
        console.warn('Error cargando roles:', rolesError.value);
    }
});
</script>
 -->


 <template>
    <div class="flex flex-col gap-12">
        <XHeader title="Accesos y roles" :breadcrumb-items="itemsBreadRolesAccess" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <p class="text-gray-800">Consulta los accesos configurados para cada rol del sistema y verifica la relación entre perfiles y permisos asignados.</p>
            </template>
        </XHeader>
        <div class="flex flex-row items-center justify-center gap-10">
            <!-- Columna dinámica de categorías y features -->
            <div class="min-h-[60.143rem] flex items-end">
                <div class="bg-gray-50 pl-12 pr-8 rounded-[1.143rem] mt-[120px]">
                    <table>
                        <template v-for="(category, categoryIndex) in categoriesWithFeatures" :key="category.categoryName">
                            <!-- Primera fila de cada categoría (con rowspan) -->
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
                            
                            <!-- Filas adicionales para features restantes de la categoría -->
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

            <!-- <div class="flex flex-row gap-8 items-start">
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
                        <table class="min-w-[15.536rem]">
                            <thead>
                                <th class="min-h-[3.857rem] p-8 bg-secondary-200 rounded-t-[1.143rem]">
                                    <div class="flex flex-row gap-4 items-center justify-center text-primary">
                                        <Icon :name="getRoleIcon(RoleCompare1)" class="w-10 h-10"/> 
                                        <span class="text-[1.143rem] font-semibold">{{ getRoleTitle(RoleCompare1) }}</span>
                                    </div>
                                </th>
                            </thead>
                            <tbody class="flex flex-col shadow-[6px_6px_12px_0_rgba(12,85,248,0.12)] rounded-b-[1.143rem]">
                                <tr v-for="(access, index) in getAccessListForRole(RoleCompare1)" :key="`role1-${index}`">
                                    <td class="border-b py-6 px-8 text-center">
                                        <AccessIcon :has-access="access"/>
                                    </td>
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
                        <table v-if="RoleCompare2" class="min-w-[15.536rem]">
                            <thead>
                                <th class="min-h-[3.857rem] text-[1.143rem] p-8 text-primary font-semibold bg-secondary-200 rounded-t-[1.143rem]">
                                    <div class="flex flex-row gap-4 items-center justify-center text-primary">
                                        <Icon :name="getRoleIcon(RoleCompare2)" class="w-10 h-10"/> 
                                        <span class="text-[1.143rem] font-semibold">{{ getRoleTitle(RoleCompare2) }}</span>
                                    </div>
                                </th>
                            </thead>
                            <tbody class="flex flex-col shadow-[6px_6px_12px_0_rgba(12,85,248,0.12)] rounded-b-[1.143rem]">
                                <tr v-for="(access, index) in getAccessListForRole(RoleCompare2)" :key="`role2-${index}`">
                                    <td class="border-b py-6 px-8 text-center">
                                        <AccessIcon :has-access="access"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> -->
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

// ============= MAPEO DE CATEGORÍAS =============
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

// ============= COMPUTED PARA FEATURES DINÁMICAS =============
const featuresOrder = computed(() => {
    return roleUserFeatures.value.map(feature => feature.value);
});

const featuresWithLabels = computed(() => {
    return roleUserFeatures.value.map(feature => feature.label);
});

// ============= COMPUTED PARA CATEGORÍAS DINÁMICAS =============
const categoriesWithFeatures = computed(() => {
    const result = [];
    
    // Usar las features que tienes disponibles
    const availableFeatures = featuresWithLabels.value;
    
    // Mapear cada categoría con sus features correspondientes
    for (const [categoryName, expectedFeatures] of Object.entries(CATEGORIES_MAPPING)) {
        const categoryFeatures = [];
        
        // Buscar las features que pertenecen a esta categoría
        expectedFeatures.forEach(expectedFeature => {
            const foundFeature = availableFeatures.find(feature => 
                feature.includes(expectedFeature.split(' ')[0]) || 
                expectedFeature.includes(feature.split(' ')[0])
            );
            if (foundFeature) {
                categoryFeatures.push(foundFeature);
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
    return result;
});

// ============= STATE Y COMPOSABLES =============
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

// ============= COMPUTED PARA OPCIONES DE SELECTS =============
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

// ============= FUNCIONES HELPER =============
const getRoleIcon = (roleCode: string) => {
    return getIconForRole(roleCode);
};

const getRoleTitle = (roleCode: string) => {
    const selectedRole = roleAccessOptions.value.find(role => role.value === roleCode);
    return selectedRole?.label || 'Rol no encontrado';
};

// ============= FUNCIÓN PRINCIPAL PARA OBTENER ACCESOS =============
const getAccessListForRole = (roleCode: string): boolean[] => {
    console.log('Buscando accesos para rol:', roleCode);
    console.log('Features order actual:', featuresOrder.value);
    
    const roleData = roles.value.find(role => role.roleCode === roleCode);
    
    if (!roleData) {
        console.log('Rol no encontrado:', roleCode);
        return featuresOrder.value.map(() => false);
    }
    
    // Crear un mapa de features para búsqueda rápida
    const featureMap = new Map();
    
    roleData.categories.forEach(category => {
        category.features.forEach(feature => {
            featureMap.set(feature.featureCode, feature.hasAccess);
        });
    });
    
    // Mapear según el orden establecido
    const accessList = featuresOrder.value.map(featureCode => {
        const hasAccess = featureMap.get(featureCode) || false;
        return hasAccess;
    });
    
    return accessList;
};

// ============= MOUNT =============
onMounted(async () => { 
    await loadAllOptions();
    await loadRolesFeatures();
    
		console.log('Hola: ', roleUserFeatures.value.map(feature => feature.label));

		
    if (rolesError.value) {
        console.warn('Error cargando roles:', rolesError.value);
    }
});
</script>