<template>
  <iframe ref="iframe" :title="`Sandbox for ${title || id}`" :src="url" />

  <fieldset>
    <legend>Styles?</legend>

    <label> <input v-model="css" type="radio" :value="false" /> Hide </label>
    <label> <input v-model="css" type="radio" value="css" /> CSS </label>
    <label> <input v-model="css" type="radio" value="scss" /> SCSS </label>
  </fieldset>

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

  <div v-html="displayedSource" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps & { title?: string }>();

const iframe = ref<HTMLIFrameElement>();

const css = ref<false | "css" | "scss">(false);

const displayedSource = computed(() => {
  if (!css) {
    return props.highlightedStylelessSource;
  } else {
    return css.value === "css" ? props.highlightedCssSource : props.highlightedSource;
  }
});
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
