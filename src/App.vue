<script setup lang="ts">
import { RouterView } from "vue-router";
import NavigationBar from "./components/Navigation/NavigationBar.vue";
</script>

<template>
  <div>
    <NavigationBar class="navigation-bar" />
    <RouterView />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

body {
  line-height: 1.6;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  justify-content: center;
  width: 100vw;
  padding: 32px 0px;
}

.navigation-bar {
  position: fixed;
  top: 32px;
  right: 32px;
}
</style>
