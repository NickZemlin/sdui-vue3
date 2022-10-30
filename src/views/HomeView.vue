<script setup lang="ts">
import ControlsGroup from "@/components/ControlGroup/ControlsGroup.vue";
import FormComponent from "@/components/FormComponent/FormComponent.vue";
import NewsCard from "@/components/NewsCard/NewsCard.vue";
import SearchField from "@/components/SearchField/SearchField.vue";
import { matchSorter } from "@/helpers/sorter";
import { SortingDirection } from "@/models/SortingDirection";
import { useStore } from "@/store/appStore";
import { computed, ref } from "vue";

const appStore = useStore();

const showForm = ref(false);
const toggleForm = () => {
  showForm.value = !showForm.value;
};

const currentSearch = ref("");

const updateCurrentSearch = (event: string) => {
  currentSearch.value = event;
};

const currentTarget = computed(() => appStore.state.searchTarget);
const currentDirection = computed(() => appStore.state.sortingDirection);

const newsPresenter = computed(() => {
  if (currentSearch.value) {
    const matched = matchSorter(appStore.state.news, currentSearch.value, {
      keys: [currentTarget.value],
    });
    if (currentDirection.value === SortingDirection.ASC) {
      return matched.reverse();
    }
    return matched;
  }
  return appStore.state.news;
});
</script>

<template>
  <div class="home-view">
    <SearchField @on-search-input="updateCurrentSearch" />
    <div class="news-container">
      <TransitionGroup name="list">
        <NewsCard
          class="news-card"
          v-for="item in newsPresenter"
          :key="item.id + item.title"
          :news-entity="item"
        />
      </TransitionGroup>
    </div>
    <div class="controls-container">
      <ControlsGroup @click="toggleForm" />
      <FormComponent class="form-component" v-if="showForm" />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 500px;
  position: relative;
}

.news-card {
  margin-bottom: 32px;
}

.controls-container {
  position: fixed;
  top: 32px;
  left: 32px;
}

.controls-group {
  margin-bottom: 64px;
  cursor: pointer;
  user-select: none;
  width: 300px;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
