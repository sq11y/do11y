<template>
  <iframe :title="title || id" :src="url" />

  <fieldset>
    <legend>Styles?</legend>

    <!-- eslint-disable vuejs-accessibility/label-has-for -->
    <label>
      <input v-model="css" :name="name" type="radio" :value="false" />
      Hide
    </label>

    <label>
      <input v-model="css" :name="name" type="radio" value="css" />
      CSS
    </label>

    <label>
      <input v-model="css" :name="name" type="radio" value="scss" />
      SCSS
    </label>
  </fieldset>

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="displayedSource" />
</template>

<script lang="ts" setup>
import { computed, ref, useId } from "vue";

import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps>();

const name = useId();

const css = ref<false | "css" | "scss">(false);

const displayedSource = computed(() => {
  if (!css.value) {
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
