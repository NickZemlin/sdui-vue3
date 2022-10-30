import MockNews from "@/mocks/NewsEntityMocks";
import type { NewsEntity } from "@/models/NewsEntity";
import { SortingDirection } from "@/models/SortingDirection";
import { SearchTarget } from "@/models/SearchTarget";
import type { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import findNewsEntity from "@/helpers/findNewsEntity";

interface AppStore {
  sortingDirection: SortingDirection;
  news: NewsEntity[];
  searchTarget: SearchTarget;
}

export const key: InjectionKey<Store<AppStore>> = Symbol();

export const store = createStore<AppStore>({
  state: {
    sortingDirection: SortingDirection.DESC,
    news: MockNews(5),
    searchTarget: SearchTarget.TITLE,
  },
  mutations: {
    ADD_NEWS_ENTITY(state, entity: NewsEntity) {
      state.news.unshift(entity);
    },
    UPDATE_DIRECTION(state, direction: SortingDirection) {
      state.sortingDirection = direction;
    },
    UPDATE_SEARCH_TARGET(state, target: SearchTarget) {
      state.searchTarget = target;
    },
    EDIT_ENTITY(state, target) {
      const targetIndex = findNewsEntity(state.news, target);
      state.news[targetIndex] = target;
    },
  },
  actions: {
    addNewsEntity(context, entity: NewsEntity) {
      context.commit("ADD_NEWS_ENTITY", entity);
    },
    updateDirection(context, direction: SortingDirection) {
      context.commit("UPDATE_DIRECTION", direction);
    },
    updateSearchTarget(context, target: SearchTarget) {
      context.commit("UPDATE_SEARCH_TARGET", target);
    },
    editEntity(context, target: NewsEntity) {
      context.commit("EDIT_ENTITY", target);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
