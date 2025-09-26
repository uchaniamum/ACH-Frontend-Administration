<template>
    <div class="grid grid-cols-2">
        <!-- Columna izquierda (slider) -->
        <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div
                v-for="(slide, index) in slides"
                :key="index"
                class="absolute flex flex-col items-center justify-center gap-6 text-center transition-opacity duration-700"
                :class="{ 'opacity-100': index === currentIndex, 'opacity-0': index !== currentIndex }"
            >
                <img :src="slide.image" alt="Slide image" class="w-[250px]" />
                <div class="flex flex-col w-[440px]">
                    <span class="text-primary-600 text-[38px] font-bold">{{ slide.title }}</span>
                    <span class="text-gray-700">{{ slide.subtitle }}</span>
                </div>
            
            </div>
        </div>

        <div class="min-h-screen flex items-center justify-center bg-[linear-gradient(140deg,rgba(231,238,254,0.40)_20.68%,#CEDDFE_84.07%)]">
            <div class="flex w-[400px] flex-col items-center gap-10 bg-white shadow-[0_8px_24px_0_rgba(148,164,188,0.40)] px-16 py-20 rounded-2xl">
                <div class="flex flex-col gap-20">
                    <div>
                        <h2 class="mt-6 text-2xl font-extrabold text-gray-900">¡Comencemos!</h2>
                        <span class="text-gray-700">Ingresa tus datos personales para iniciar sesión.</span>
                    </div>
                    <div>
                        <XForm class="flex flex-col gap-12">
                            <XInputText v-model="formLogin.user" name="user" label-required label="Usuario" placeholder="Ingrese Usuario" />
                            <XPassword
                                v-model="formLogin.password"
                                label="Contraseña"
                                label-required
                                name="password"
                                placeholder="Ingrese contraseña"
                                fluid
                                :rules="[
                                    (v: any) => !!v || 'La contraseña es requerida',
                                    (v: any) => /[A-Z]/.test(v) || 'Debe contener al menos una mayúscula',
                                    (v: any) => /[0-9]/.test(v) || 'Debe contener al menos un número',
                                ]"
                                :validation="(v) => (v ? v.replace(/\s/g, '') : null)"
                                :feedback="false"
                                toggle-mask
                            />
                            <XButton label="Ingresar" @click="handleLogin"/>
                        </XForm>
                    </div>
                    <div class="flex flex-col">
                        <XButton variant="text" label="Olvide mi contraseña" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import img1 from "../assets/img/ImagenLogin1.png";
import img2 from "../assets/img/ImagenLogin2.png";
import img3 from "../assets/img/ImagenLogin3.png";

const router = useRouter();

definePageMeta({
  layout: "auth",
});

const formLogin = ref({
  user: "",
  password: "",
});

const slides = ref([
  {
    image: img1,
    title: "Trazabilidad, seguridad y disponibilidad",
    subtitle: "Control en cada paso del proceso y disponibilidad de la información",
  },
  {
    image: img2,
    title: "Optimización de la administración ",
    subtitle: "Gestión eficiente y monitoreo continuo",
  },
  {
    image: img3,
    title: "Infraestructura moderna y segura",
    subtitle: "Tecnología moderna para operaciones seguras",
  },
]);

const currentIndex = ref(0);
let intervalId: any = null;

function next() {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length;
}

const handleLogin = () => {
    router.push({
                path: `/`
            });
}

onMounted(() => {
  intervalId = setInterval(() => {
    next();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
