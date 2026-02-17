<template>
  <Layout v-if="Layout">
    <DynamicComponent v-if="DynamicComponent" />
  </Layout>
</template>

<script lang="ts" setup>
import { onBeforeMount, shallowRef, type Component } from "vue";
import { parseQuery } from "vue-router";

import sandbox from "do11y:sandbox";
import options from "do11y:options";

const query = parseQuery(window.location.search);

const Layout = shallowRef<Component>();

const DynamicComponent = shallowRef<Component>();

onBeforeMount(async () => {
  const { component } = sandbox.find(({ url }) => url === query.id) ?? {};

  Layout.value = (await options.Sandbox?.())?.default;
  DynamicComponent.value = await component?.();
});
</script>
