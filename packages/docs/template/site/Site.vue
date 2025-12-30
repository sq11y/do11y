<template>
  <nav>
    <ul>
      <li v-for="route of routes" :key="route.path">
        <router-link :to="route.path">
          {{ route.meta.title }}
        </router-link>
      </li>
    </ul>
  </nav>

  <main>
    <article>
      <RouterView />
    </article>
  </main>
</template>

<script lang="ts" setup>
  import routes from 'do11y:routes';
  import './style.css';
</script>
