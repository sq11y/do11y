<template>
  <ExampleButton>A blue button with inside a sandbox.</ExampleButton>
</template>

<script lang="ts" setup>
  import ExampleButton from './Button.vue';
</script>

<style>
  button {
    color: darkblue;
    border: 1px dashed darkblue;
    background-color: lightblue;
  }
</style>
