<template>
  <Layout v-if="Layout" />
  <RouterView v-else />
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";

import Layout from "do11y:layout";
import css from "do11y:css";

onBeforeMount(async () => {
  const stylesheet = document.createElement("style");
  stylesheet.innerHTML = css;

  document.head.appendChild(stylesheet);
});
</script>
