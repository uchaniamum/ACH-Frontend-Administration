<template>
  <section class="flex items-center justify-center relative">
    <svg viewBox="0 0 100 52" class="max-w-[300px]">
      <g>
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="#81B766"
          stroke-width="4"
          :stroke-dasharray="calculateStrokePercentage(48, 100)"
          transform="rotate(-180 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="#B0E297"
          stroke-width="4"
          :stroke-dasharray="calculateStrokePercentage(48, 80)"
          transform="rotate(-180 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="#F2C84F"
          stroke-width="4"
          :stroke-dasharray="calculateStrokePercentage(48, 60)"
          transform="rotate(-180 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="#F47A71"
          stroke-width="4"
          :stroke-dasharray="calculateStrokePercentage(48, 40)"
          transform="rotate(-180 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          stroke="#F1594E"
          stroke-width="4"
          :stroke-dasharray="calculateStrokePercentage(48, 20)"
          transform="rotate(-180 50 50)"
        />
      </g>

      <circle
        cx="50"
        cy="50"
        r="35"
        fill="transparent"
        stroke="#79879B"
        stroke-width="14"
        :stroke-dasharray="calculateStrokePercentage(35, 100)"
        transform="rotate(-180 50 50)"
      />

      <circle
        cx="50"
        cy="50"
        r="35"
        fill="transparent"
        :stroke="percentageColor"
        stroke-width="14"
        :stroke-dasharray="calculateStrokePercentage(35, props.percentage)"
        transform="rotate(-180 50 50)"
      />

      <text x="50%" y="95%" text-anchor="middle" dominant-baseline="alphabetic" fill="#373F4A" class="font-semibold">
        {{ Math.floor(props.percentage) }} %
      </text>
    </svg>
  </section>
</template>

<script setup lang="ts">
  const props = defineProps<{
    percentage: number
  }>();

  

  function calculateStrokePercentage(radius: number, percentage: number): string {
    const circumference = 2 * Math.PI * radius;
    const filled = (percentage / 200) * circumference;
    return `${filled} ${circumference - filled}`;
  }

  const percentageColor = computed(() => {
    if (props.percentage > 80) return "#81B766";
    if (props.percentage > 60) return "#B0E297";
    if (props.percentage > 40) return "#F2C84F";
    if (props.percentage > 20) return "#F47A71";
    return "#F1594E";
  });

</script>
