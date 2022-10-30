<script setup lang="ts">
class Link {
  routeName!: string;
  text!: string;
  constructor(name: string, text: string) {
    this.routeName = name;
    this.text = text;
  }
}

const routerLinks: Link[] = [
  new Link("home", "Home"),
  new Link("infoView", "Sample zero"),
  new Link("Sample_Page_1", "First sample"),
  new Link("Sample_Page_2", "Seoncd sample"),
];
</script>

<template>
  <div class="navigation-bar">
    <RouterLink
      v-for="link in routerLinks"
      :key="link.text"
      :to="{ name: link.routeName }"
      >{{ link.text }}</RouterLink
    >
  </div>
</template>

<style scoped>
.navigation-bar {
  display: flex;
  flex-direction: column;
}

a {
  text-decoration: none;
  color: black;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease-in-out;
}

.router-link-active {
  border-bottom: 2px solid black;
}
</style>
