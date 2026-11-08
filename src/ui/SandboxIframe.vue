<template>
  <SandboxIframe
    v-if="SandboxIframe"
    :id="id"
    :title="title || `Sandbox for ${id}`"
    :url="url"
    :highlighted-source="highlightedSource"
    :highlighted-css-source="highlightedCssSource"
    :highlighted-styleless-source="highlightedStylelessSource"
  />

  <iframe v-else :title="title || `Sandbox for ${id}`" :src="url" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SandboxIframe from "do11y:sandbox-iframe";

import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps>();

const url = computed(() => `${import.meta.env.BASE_URL}sandbox?id=${props.id}`);
</script>
