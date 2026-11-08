<template>
  <Layout v-if="Layout" />
  <RouterView v-else />
</template>

<script lang="ts" setup>
import Layout from "do11y:page-layout";
import "do11y:css";
</script>
