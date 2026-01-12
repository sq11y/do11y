<template>
  <ButtonComponent>{{ content }}</ButtonComponent>
</template>

<script lang="ts" setup>
  import ButtonComponent from './Button.vue';

  defineProps<{
    content: string;
  }>();
</script>
