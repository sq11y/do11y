---
title: 'Button'
slug: '/button'
---

<script setup>
  import { useRoute } from 'vue-router';

  import ButtonComponent from './Button.vue';
  import meta from './Button.vue?meta';

  const route = useRoute();
</script>

# {{ route.meta.title }} {#title}

## Sandbox

<SandboxIframe title="Button" id="button" />

## Usage

<ButtonComponent>

A transparent button **NOT** inside a sandbox

</ButtonComponent>

## API

```
{{meta}}
```
