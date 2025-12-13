<template>
  <nav>
    <ul>
      <template v-for="route of routes" :key="route.path">
        <li>
          <router-link :to="route.path">
            {{ route.meta.title }}
          </router-link>
        </li>
      </template>
    </ul>
  </nav>

  <RouterView />
</template>

<script lang="ts" setup>
  import routes from 'do11y:routes';
  import './style.css';
</script>

<style>
  button {
    width: max-content;
  }
</style>
