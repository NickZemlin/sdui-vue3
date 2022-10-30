<script setup lang="ts">
import { createNewsEntity, type NewsEntity } from "@/models/NewsEntity";
import { useStore } from "@/store/appStore";
import { computed } from "vue";
import { ref } from "vue";

interface Props {
  newsEntity: NewsEntity;
}

const props = defineProps<Props>();
const appStore = useStore();

const scopedEntity = ref(createNewsEntity(props.newsEntity));

const handleChange = () => {
  const field = document.getElementsByClassName(classGen());
  scopedEntity.value.title = field[0].innerHTML;
  scopedEntity.value.author = field[1].innerHTML;
  scopedEntity.value.body = field[2].innerHTML;
  appStore.dispatch("editEntity", scopedEntity.value);
};

const editMode = ref(false);
const toggleEditMode = () => {
  if (editMode.value) {
    handleChange();
  }
  editMode.value = !editMode.value;
};
const buttonText = computed(() => (editMode.value ? "save" : "edit"));

const classGen = () => {
  return `${props.newsEntity.id}selector`;
};
</script>

<template>
  <div class="news-card" :class="{ 'news-card--editable': editMode }">
    <button class="news-card__edit" @click="toggleEditMode">
      {{ buttonText }}
    </button>
    <h5 class="news-card__text" :class="classGen()" :contenteditable="editMode">
      {{ newsEntity.title }}
    </h5>
    <h6 class="news-card__text" :class="classGen()" :contenteditable="editMode">
      {{ newsEntity.author }}
    </h6>
    <p class="news-card__text" :class="classGen()" :contenteditable="editMode">
      {{ newsEntity.body }}
    </p>
  </div>
</template>

<style scoped>
.news-card {
  width: 100%;
  height: 200px;
  border: 0.5px solid rgb(122, 122, 122);
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #c0c5d7;
  position: relative;
  cursor: default;
}
.news-card__edit {
  position: absolute;
  right: 16px;
  top: 16px;
}

.news-card__text {
  padding: 0px 8px;
  transition: all 0.3s ease;
}

h5 {
  font-size: 32px;
  margin-bottom: 4px;
  width: calc(100% - 48px);
}
h6 {
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 8px;
}
p {
  visibility: visible !important;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
}
button {
  width: 35px;
  height: 35px;
}

.news-card--editable > .news-card__text {
  background-color: white;
  cursor: text;
  border-radius: 8px;
}
</style>
