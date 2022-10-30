<script setup lang="ts">
import { SearchTarget } from "@/models/SearchTarget";
import { SortingDirection } from "@/models/SortingDirection";
import { useStore } from "@/store/appStore";
import { computed, ref, watch } from "vue";

const appStore = useStore();

const emits = defineEmits<{
  (e: "on-search-input", newValue: string): void;
}>();

const sortingDirection = ref([
  {
    direction: SortingDirection.DESC,
    icon: "⇩",
  },
  {
    direction: SortingDirection.ASC,
    icon: "⇧",
  },
]);

const updateSortDirection = (event: SortingDirection) => {
  appStore.dispatch("updateDirection", event);
};

const updateTarget = (target: SearchTarget) => {
  appStore.dispatch("updateSearchTarget", target);
};

const currentTarget = computed(() => appStore.state.searchTarget);

const currentDirection = computed(() => appStore.state.sortingDirection);

const scopedSearch = ref("");

watch(
  () => scopedSearch.value,
  () => emits("on-search-input", scopedSearch.value)
);
</script>

<template>
  <div>
    <div class="search-field__controls">
      <button
        class="search-field__contrls__button"
        v-for="target in SearchTarget"
        @click="updateTarget(target)"
        :key="target"
        :class="{ active: currentTarget === target }"
      >
        {{ target }}
      </button>
    </div>
    <div class="search-field">
      <input type="text" placeholder="Search" v-model="scopedSearch" />
      <button
        class="search-field__button"
        v-for="direction in sortingDirection"
        :key="direction.direction"
        @click="updateSortDirection(direction.direction)"
        :class="{ active: direction.direction === currentDirection }"
      >
        {{ direction.icon }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-field {
  width: 100%;
  padding: 16px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  position: relative;
}
input {
  width: 80%;
  outline: none;
  border: none;
  border: 1px solid white;
  border-radius: 8px 0px 0px 8px;
  background-color: rgb(195, 195, 195);
  padding: 4px 8px;
  font-size: 20px;
  height: 40px;
}
.search-field__button {
  width: 10%;
  outline: none;
  border: 1px solid white;
  border-radius: 0;
  cursor: pointer;
}
.search-field__button:last-child {
  border-radius: 0px 8px 8px 0px;
}
.search-field__button:hover {
  background-color: rgb(196, 195, 195);
}
.search-field__contrls__button {
  width: calc(100% / 3);
  outline: none;
  border: 1px solid white;
  cursor: pointer;
}
.search-field__contrls__button:hover {
  background-color: rgb(220, 217, 217);
}

.active {
  background-color: rgb(193, 193, 193);
}
</style>
