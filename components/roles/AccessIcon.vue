<template>
    <span 
        class="relative inline-flex h-10 w-10 p-[1.33px] items-center justify-center rounded-full border"
        :class="accessClasses"
    >
        <span class="h-7 w-7 p-[2.33px] rounded-full ring-2 ring-white flex items-center justify-center"
            :class="iconClasses">
            <Icon :name="iconName" class="text-white w-5 h-5"/>
        </span>
    </span>
</template>

<script setup lang="ts">
interface Props {
    hasAccess: boolean;
}

const props = defineProps<Props>();

const accessClasses = computed(() => ({
    'border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]': props.hasAccess,
    'border-gray-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#94A4BC]': !props.hasAccess
}));

const iconClasses = computed(() => ({
    'bg-green-500': props.hasAccess,
    'bg-gray-500': !props.hasAccess
}));

const iconName = computed(() => 
    props.hasAccess ? 'x:think-check' : 'x:think-cancel'
);
</script>