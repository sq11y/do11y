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

  <fieldset>
    <legend>Code theme</legend>

    <label>
      <input v-model="theme" type="radio" value="vitesse-light" name="theme" />
      Light
    </label>
    <label>
      <input v-model="theme" type="radio" value="vitesse-dark" name="theme" />
      Dark
    </label>
    <label>
      <input v-model="theme" type="radio" value="vitesse-black" name="theme" />
      Black
    </label>
  </fieldset>

  <main>
    <article :data-theme="theme">
      <RouterView />
    </article>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import routes from "do11y:routes";

const theme = ref("vitesse-light");
</script>

<style>
html {
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  font-family: sans-serif;
  accent-color: #4d9375;
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

a,
button {
  cursor: pointer;
}

a {
  color: #3d7f62;
}

button:disabled,
button[aria-disabled="true"] {
  cursor: default;
}

body {
  margin: 2rem auto;
  inline-size: min(90dvw, 40rem);

  font-size: 1rem;
}

fieldset {
  margin-block: 2rem;

  display: flex;
  gap: 1rem;

  padding: 0.5rem 1rem;
}

nav ul {
  display: flex;
  align-items: center;
  gap: 2rem;

  margin-block-end: 2rem;
  margin-inline-start: 1rem;
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

.shiki {
  white-space: pre-wrap;

  padding: 1.25rem;

  border-radius: 0.5rem;
  border: 1px solid #eee;
}

.shiki code {
  display: block;
}

.shiki .highlighted,
.shiki .diff {
  display: inline-block;
  inline-size: calc(100% + (2 * 1.25rem));
  margin-inline-start: -1.25rem;
  padding-inline: 1.25rem;
}

.shiki .highlighted.warning {
  background-color: #ffedd9;
}

[data-theme="vitesse-dark"] .shiki .highlighted.warning {
  background-color: #462c0f;
}

[data-theme="vitesse-black"] .shiki .highlighted.warning {
  background-color: #3a2003;
}
</style>
