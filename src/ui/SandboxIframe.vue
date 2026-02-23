<template>
  <IFrame
    v-if="IFrame"
    :id="id"
    :url="url"
    :highlighted-source="highlightedSource"
    :highlighted-css-source="highlightedCssSource"
    :highlighted-styleless-source="highlightedStylelessSource"
    v-bind="passedProps"
  />

  <iframe v-else :src="url" />
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, shallowRef, type Component } from "vue";
import options from "do11y:options";

import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps & { passedProps?: Record<string, unknown> }>();

const url = computed(() => `/sandbox?id=${props.id}`);

const IFrame = shallowRef<Component>();

onBeforeMount(async () => {
  IFrame.value = (await options.SandboxIframe?.())?.default;
});
</script>
