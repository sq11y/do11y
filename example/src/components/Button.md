---
title: 'Button'
slug: '/button'
---

<script setup>
  import { useRoute } from 'vue-router';

  import ButtonComponent from './Button.vue';

  const route = useRoute();
</script>

# {{ route.meta.title }} {#title}

## Sandbox

<SandboxPlayground title="Button" id="button" />

## Usage

<ButtonComponent>
  This example button doesn't have blue text since the button above is in a sandbox
</ButtonComponent>

## API

[? Button API]: ./Button.vue
