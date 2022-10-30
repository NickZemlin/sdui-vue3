export interface NewsEntityModel {
  id: number;
  title: string;
  body: string;
  author: string;
}

export class NewsEntity implements NewsEntityModel {
  id!: number;
  title!: string;
  body!: string;
  author!: string;

  constructor(NewsEntityApi: NewsEntityModel) {
    Object.assign(this, NewsEntityApi);
  }
}

export const createNewsEntity = (NewsEntityApi: NewsEntityModel) => {
  return new NewsEntity({
    id: NewsEntityApi.id,
    title: NewsEntityApi.title,
    body: NewsEntityApi.body,
    author: NewsEntityApi.author,
  });
};
