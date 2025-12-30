<template>
  <iframe ref="iframe" :title="`Sandbox for ${title}`" :src="url" />
  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    /**
     * The iframe title.
     */
    title: string;

    /**
     * The `id` of the sandbox - which is the filename
     * without the extension `.sandbox.vue`.
     */
    id: string;
  }>();

  const iframe = ref<HTMLIFrameElement>();

  const url = computed(() => `${window.location.origin}/sandbox?id=${props.id}`);
</script>

<style scoped>
  iframe {
    border: none;
    width: 100%;
  }

  a {
    float: right;
  }
</style>
