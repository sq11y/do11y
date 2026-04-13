<template>
  <main>
    <slot />
  </main>
</template>

<style>
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;

  display: grid;
  place-content: center;
  background-color: #eee;
}
</style>
