<template>
  <div class="iframe-wrapper">
    <iframe ref="iframe" :title="`Sandbox for ${title}`" :src="url" />
  </div>

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  const props = defineProps<{
    title: string;
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
</style>
