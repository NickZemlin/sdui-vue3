<script setup lang="ts">
import { createNewsEntity, NewsEntity } from "@/models/NewsEntity";
import { useStore } from "@/store/appStore";
import { computed, ref } from "vue";

const appStore = useStore();

const dispatchUpdate = (entity: NewsEntity) => {
  appStore.dispatch("addNewsEntity", entity);
};

interface FormValue {
  [key: string]: string;
}

const formValue = ref<FormValue>({
  title: "",
  body: "",
  author: "",
});

const areFieldsEmpty = computed(() => {
  return Object.keys(formValue.value).reduce((acc, el) => {
    if (!formValue.value[el]) {
      acc = true;
    }
    return acc;
  }, false);
});

const actionName = computed(() => "Create entity");

const createEntity = () => {
  const entity = createNewsEntity({
    title: formValue.value.title,
    body: formValue.value.body,
    author: formValue.value.body,
    id: Math.random(),
  });
  dispatchUpdate(entity);
};
</script>

<template>
  <div class="form-component">
    <div>
      <h2>Title</h2>
      <input type="text" placeholder="Title" v-model="formValue.title" />
      <h2>Body</h2>
      <input type="text" placeholder="Body" v-model="formValue.body" />
      <h2>Author</h2>
      <input type="text" placeholder="Author" v-model="formValue.author" />
    </div>
    <button :disabled="areFieldsEmpty" @click="createEntity">
      {{ actionName }}
    </button>
  </div>
</template>

<style scoped>
.form-component {
  position: relative;
}

input {
  width: 100%;
}

button {
  margin-top: 32px;
  width: 100%;
}
</style>
