<!-- prettier-ignore -->

<template>
  <ExampleButton>
    A green button inside a sandbox
  </ExampleButton>
</template>

<script lang="ts" setup>
import ExampleButton from "./Button.vue";
</script>

<style lang="scss">
@use "../utils.scss";

button {
  color: #173f2e;
  border: 1px dashed #173f2e;
  background-color: #9ad3ba;

  @include utils.button;
}
</style>
