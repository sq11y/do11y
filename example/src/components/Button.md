---
title: 'Button'
slug: '/button'
---

<script setup>
  import { useRoute } from 'vue-router';

  import ButtonComponent from './Button.vue';
  import ButtonSandbox from './Button.sandbox.vue?iframe';
  import ButtonExample from './Button.example.vue?iframe';

  import meta from './Button.vue?meta';

  const route = useRoute();
</script>

# {{ route.meta.title }} {#title}

## Sandbox iframe

<ButtonSandbox title="Button" />

## Iframe

<ButtonExample content="A transparent button inside an iframe" />

## Vue components in markdown

<ButtonComponent>
  A transparent button <strong>NOT</strong> inside a sandbox or iframe
</ButtonComponent>

## API

```
{{meta}}
```
