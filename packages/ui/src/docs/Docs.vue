<template>
  <slot />
</template>

<script lang="ts" setup>
  import { computed, provide } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const frontmatter = computed(() => route?.meta ?? {});

  provide('frontmatter', frontmatter);
</script>
