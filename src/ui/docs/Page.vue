<template>
  <Layout v-if="Layout">
    <slot />
  </Layout>

  <slot v-else />
</template>

<script lang="ts" setup>
import { onBeforeMount, shallowRef, type Component } from "vue";

import options from "do11y:options";
import css from "do11y:css";

const Layout = shallowRef<Component>();

onBeforeMount(async () => {
  Layout.value = (await options.Layout?.())?.default;

  const stylesheet = document.createElement("style");
  stylesheet.innerHTML = css;

  document.head.appendChild(stylesheet);
});
</script>
