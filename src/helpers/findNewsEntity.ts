import type { NewsEntity } from "@/models/NewsEntity";

const findNewsEntity = (newsArr: NewsEntity[], target: NewsEntity) => {
  const targetId = target.id;
  return newsArr.reduce((result, el, index) => {
    if (el.id === targetId) {
      result = index;
    }
    return result;
  }, -1);
};

export default findNewsEntity;
