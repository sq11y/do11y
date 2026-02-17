<template>
  <iframe ref="iframe" :title="`Sandbox for ${title || id}`" :src="url" />

  <label style="display: block; padding-block: 1rem">
    <input type="checkbox" v-model="showCSS" />
    Show CSS when possible
  </label>

  <div>
    <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

    <pre><code>{{ displayedSource }}</code></pre>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import type { SandboxIframeProps } from "do11y";

const props = defineProps<SandboxIframeProps & { title?: string }>();

const iframe = ref<HTMLIFrameElement>();

const showCSS = ref(false);

const displayedSource = computed(() => {
  const source = showCSS.value ? props.sourceWithCompiledCss || props.source : props.source;
  return source?.replace(/^(<!-- prettier-ignore -->)/, "").trim();
});
</script>

<style scoped>
iframe {
  border: none;
  width: 100%;
}

a {
  float: right;
  clear: both;
  margin: 0.75rem 1rem;

  color: lightblue;
}
</style>
