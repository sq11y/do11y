<template>
  <component
    :is="customIframe"
    v-if="customIframe"
    :id="id"
    :url="url"
    :source="source"
    v-bind="customIframeProps"
  />

  <iframe v-else :src="url" />
</template>

<script lang="ts" setup>
  import { computed, type Component } from 'vue';

  const props = defineProps<{
    id: string;
    source: string;

    customIframe?: Component;
    customIframeProps?: Record<string, unknown>;
  }>();

  const url = computed(() => `/sandbox?id=${props.id}`);
</script>
