<template>
  <nav>
    <ul>
      <li>
        <router-link to="/">Do11y</router-link>
      </li>

      <li v-for="route of routes.filter((route) => route.meta.slug !== '/')" :key="route.path">
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
import routes from "do11y:routes";
</script>

<style>
html {
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  font-family: sans-serif;
}

*,
*::before,
*::after,
*::details-content {
  box-sizing: border-box;
  padding: 0;
}

*:not(dialog) {
  margin: 0;
}

:target {
  scroll-margin-block: 2em;
}

a,
button {
  cursor: pointer;
}

button:disabled,
button[aria-disabled="true"] {
  cursor: default;
}

pre {
  white-space: pre-wrap;
  inline-size: 100%;
}

body {
  margin: 2rem auto;
  inline-size: min(90dvw, 40rem);
}

nav ul {
  display: flex;
  align-items: center;
  gap: 2rem;

  margin-block-end: 2rem;
  margin-inline-start: 1rem;
}

pre {
  border-radius: 4px;
  padding: 1rem;

  background-color: #1a1a1a;
  color: #fff;
}

/* Heading directly after another heading */
:is(h1, h2, h3, h4, h5, h6) + :is(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 1.5rem;
}

/* Heading directly after content */
:not(h1, h2, h3, h4, h5, h6) + :is(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 2em;
}

/* Content directly after a heading */
:is(h1, h2, h3, h4, h5, h6) + :not(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 1.5em;
}

/* Content directly after content */
:is(article > div, iframe, p, small, blockquote, table, dl, pre, ol, ul, br)
  + :is(article > div, iframe, small, blockquote, table, dl, pre, ol, ul, br) {
  margin-block-start: 1em;
}

button {
  background-color: transparent;
  border: 1px solid #1a1a1a;
}
</style>
