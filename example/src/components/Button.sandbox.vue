<!-- prettier-ignore -->

<template>
  <ExampleButton>
    A blue button inside a sandbox
  </ExampleButton>
</template>

<script lang="ts" setup>
import ExampleButton from "./Button.vue";
</script>

<style lang="scss">
@use "../utils.scss";

button {
  color: darkblue;
  border: 1px dashed darkblue;
  background-color: lightblue;

  @include utils.button;
}
</style>
