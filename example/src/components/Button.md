---
title: 'Button'
slug: '/button'
---

<script setup>
  import { inject } from 'vue';

  import ButtonComponent from './Button.vue';

  const fm = inject('frontmatter');
</script>

# {{ fm.title }}

## Sandbox

<SandboxPlayground title="Button" id="button" />

## Usage

<ButtonComponent>
  This example button doesn't have blue text since the button above is in a sandbox
</ButtonComponent>

## API

[? Button API]: ./Button.vue
