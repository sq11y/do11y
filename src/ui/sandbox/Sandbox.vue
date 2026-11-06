<template>
  <Layout v-if="Layout">
    <DynamicComponent v-if="DynamicComponent" />
  </Layout>

  <DynamicComponent v-else-if="DynamicComponent" />
</template>

<script lang="ts" setup>
import { onBeforeMount, shallowRef, type Component } from "vue";
import { parseQuery } from "vue-router";

import sandboxes from "do11y:sandboxes";
import Layout from "do11y:sandbox";

const query = parseQuery(window.location.search);

const DynamicComponent = shallowRef<Component>();

onBeforeMount(async () => {
  const { component } = sandboxes.find(({ url }) => url === query.id) ?? {};

  if (!component) {
    throw new Error(`No component with id ${query.id}`);
  }

  DynamicComponent.value = await component();
});
</script>
