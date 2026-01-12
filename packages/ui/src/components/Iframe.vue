<template>
  <iframe ref="iframe" @load="onLoad" />

  <Teleport v-if="hasLoaded" :to="iframe?.contentWindow?.document.body">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, nextTick, useTemplateRef } from 'vue';

  defineOptions({
    inheritAttrs: false,
  });

  const iframe = useTemplateRef('iframe');

  const hasLoaded = ref(false);

  const onLoad = async () => {
    await nextTick();
    hasLoaded.value = true;
  };
</script>
