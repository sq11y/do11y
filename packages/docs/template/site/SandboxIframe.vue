<template>
  <iframe ref="iframe" :title="`Sandbox for ${title || id}`" :src="url" />

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>

  <pre><code>{{ source }}</code></pre>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  defineProps<{
    /**
     * The title of the iframe.
     */
    title?: string;

    /**
     * The `id` of the sandbox - which is the filename
     * without the extension `.sandbox.vue`.
     *
     * @do11y Automatically passed.
     */
    id: string;

    /**
     * The sandbox url.
     *
     *  @do11y Automatically passed.
     */
    url: string;

    /**
     * The source code.
     *
     *  @do11y Automatically passed.
     */
    source?: string;
  }>();

  const iframe = ref<HTMLIFrameElement>();
</script>

<style scoped>
  iframe {
    border: none;
    width: 100%;
  }

  a {
    float: right;
    clear: both;
  }
</style>
