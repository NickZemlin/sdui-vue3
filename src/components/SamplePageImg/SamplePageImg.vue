<script setup lang="ts">
interface Props {
  imgSrc: string;
}

defineProps<Props>();
</script>

<template>
  <img :src="imgSrc" class="sample-page-img" />
</template>

<style scoped>
.sample-page-img {
  height: 80vh;
  object-fit: cover;
}
</style>
