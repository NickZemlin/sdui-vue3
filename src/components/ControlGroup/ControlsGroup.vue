<script setup lang="ts">
import { ref } from "vue";

interface Button {
  text: string;
  method: () => void;
}

const emit = defineEmits<{
  (e: "toggleForm"): void;
}>();

const buttons = ref<Button[]>([
  {
    text: "Toggle form",
    method: () => emit("toggleForm"),
  },
]);
</script>

<template>
  <div class="controls-group">
    <h1 v-for="button in buttons" :key="button.text" @click="button.method">
      {{ button.text }}
    </h1>
  </div>
</template>
