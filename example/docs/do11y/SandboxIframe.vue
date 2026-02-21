<template>
  <iframe ref="iframe" :title="`Sandbox for ${title || id}`" :src="url" />

  <label style="display: block; padding-block: 1rem">
    <input type="checkbox" v-model="showCSS" />
    Show CSS (does not work in development mode)
  </label>

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

  <div v-html="showCSS ? highlightedCssSource : highlightedSource" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type { SandboxIframeProps } from "do11y";

defineProps<SandboxIframeProps & { title?: string }>();

const iframe = ref<HTMLIFrameElement>();

const showCSS = ref(false);
</script>

<style scoped>
iframe {
  border: none;
  width: 100%;

  border-radius: 0.5rem;
}

a {
  float: right;
  clear: both;
  margin: 1rem;
}
</style>
