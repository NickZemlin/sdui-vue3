export type KeyAttributes = {
  threshold?: Ranking;
  maxRanking: Ranking;
  minRanking: Ranking;
};
export interface RankingInfo {
  rankedValue: string;
  rank: Ranking;
  keyIndex: number;
  keyThreshold: Ranking | undefined;
}

export interface ValueGetterKey<ItemType> {
  (item: ItemType): string | Array<string>;
}
export interface IndexedItem<ItemType> {
  item: ItemType;
  index: number;
}
export interface RankedItem<ItemType>
  extends RankingInfo,
    IndexedItem<ItemType> {}

export interface BaseSorter<ItemType> {
  (a: RankedItem<ItemType>, b: RankedItem<ItemType>): number;
}

export interface Sorter<ItemType> {
  (matchItems: Array<RankedItem<ItemType>>): Array<RankedItem<ItemType>>;
}

export interface KeyAttributesOptions<ItemType> {
  key?: string | ValueGetterKey<ItemType>;
  threshold?: Ranking;
  maxRanking?: Ranking;
  minRanking?: Ranking;
}

export type KeyOption<ItemType> =
  | KeyAttributesOptions<ItemType>
  | ValueGetterKey<ItemType>
  | string;

export interface MatchSorterOptions<ItemType = unknown> {
  keys?: ReadonlyArray<KeyOption<ItemType>>;
  threshold?: Ranking;
  baseSort?: BaseSorter<ItemType>;
  keepDiacritics?: boolean;
  sorter?: Sorter<ItemType>;
}
export type IndexableByString = Record<string, unknown>;

export const rankings = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0,
} as const;

export type Ranking = typeof rankings[keyof typeof rankings];
