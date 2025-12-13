<template>
  <button :disabled="zoom === 500" type="button" @click="zoom += 25">Zoom in</button>
  <button :disabled="zoom === 25" type="button" @click="zoom -= 25">Zoom out</button>

  <div class="iframe-wrapper">
    <iframe ref="iframe" :title="`Sandbox for ${title}`" :src="url" />
  </div>

  <a :href="url" target="_blank" rel="noopener noreferrer">Open in a new tab</a>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';

  const props = defineProps<{
    title: string;
    id: string;
  }>();

  const iframe = ref<HTMLIFrameElement>();

  const zoom = ref(100);

  const url = computed(() => `${window.location.origin}/sandbox?id=${props.id}`);

  const setIframeStyle = (property: any, value: any) => {
    iframe.value?.contentDocument?.documentElement.style.setProperty(property, value);
  };

  watch(zoom, (newZoom) => {
    setIframeStyle('zoom', `${newZoom}%`);
  });
</script>

<style scoped>
  .iframe-wrapper {
    background-color: #eee;
    resize: both;
  }

  iframe {
    border: none;
    width: 100%;
  }

  a {
    padding-block-end: 2rem;
  }
</style>
