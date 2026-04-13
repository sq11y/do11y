<template>
  <SanxboxIframe
    v-if="SanxboxIframe"
    :title="title"
    :id="id"
    :url="url"
    :highlighted-source="highlightedSource"
    :highlighted-css-source="highlightedCssSource"
    :highlighted-styleless-source="highlightedStylelessSource"
    v-bind="passedProps"
  />

  <iframe v-else :title="title" :src="url" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SanxboxIframe from "do11y:sandbox-iframe";

import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps & { passedProps?: Record<string, unknown> }>();

const url = computed(() => `/sandbox?id=${props.id}`);
</script>
