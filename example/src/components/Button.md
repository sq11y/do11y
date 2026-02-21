---
title: "Button"
slug: "/button"
---

<script setup>
  import { useRoute } from 'vue-router';

  import ButtonComponent from '@/components/Button.vue';
  import ButtonSandbox from './Button.sandbox.vue';

  import meta from './Button.vue?meta';

  const route = useRoute();
</script>

# {{ route.meta.title }} {#title}

## Sandbox iframe

<ButtonSandbox title="Button" />

## Vue components in markdown

<ButtonComponent>
  A gray button <strong>NOT</strong> inside a sandbox
</ButtonComponent>

## API

```
{{ meta }}
```

<style lang="scss">
  @use "../utils.scss";

  button {
    background: #dedede;
    @include utils.button;
  }
</style>
