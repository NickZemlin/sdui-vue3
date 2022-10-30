import {
  rankings,
  type BaseSorter,
  type MatchSorterOptions,
  type RankedItem,
  type KeyOption,
  type RankingInfo,
  type Ranking,
  type IndexableByString,
  type KeyAttributes,
  type KeyAttributesOptions,
  type ValueGetterKey,
} from "@/models/SorterModels";

matchSorter.rankings = rankings;

const defaultBaseSortFn: BaseSorter<unknown> = (a, b) =>
  String(a.rankedValue).localeCompare(String(b.rankedValue));

function matchSorter<ItemType = string>(
  items: ReadonlyArray<ItemType>,
  value: string,
  options: MatchSorterOptions<ItemType> = {}
): Array<ItemType> {
  const {
    keys,
    threshold = rankings.MATCHES,
    baseSort = defaultBaseSortFn,
    sorter = (matchedItems) =>
      matchedItems.sort((a, b) => sortRankedValues(a, b, baseSort)),
  } = options;
  const matchedItems = items.reduce(reduceItemsToRanked, []);
  return sorter(matchedItems).map(({ item }) => item);

  function reduceItemsToRanked(
    matches: Array<RankedItem<ItemType>>,
    item: ItemType,
    index: number
  ): Array<RankedItem<ItemType>> {
    const rankingInfo = getHighestRanking(item, keys, value, options);
    const { rank, keyThreshold = threshold } = rankingInfo;
    if (rank >= keyThreshold) {
      matches.push({ ...rankingInfo, item, index });
    }
    return matches;
  }
}

function getHighestRanking<ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>> | undefined,
  value: string,
  options: MatchSorterOptions<ItemType>
): RankingInfo {
  if (!keys) {
    const stringItem = item as unknown as string;
    return {
      rankedValue: stringItem,
      rank: getMatchRanking(stringItem, value, options),
      keyIndex: -1,
      keyThreshold: options.threshold,
    };
  }
  const valuesToRank = getAllValuesToRank(item, keys);
  return valuesToRank.reduce(
    (
      { rank, rankedValue, keyIndex, keyThreshold },
      { itemValue, attributes },
      i
    ) => {
      let newRank = getMatchRanking(itemValue, value, options);
      let newRankedValue = rankedValue;
      const { minRanking, maxRanking, threshold } = attributes;
      if (newRank < minRanking && newRank >= rankings.MATCHES) {
        newRank = minRanking;
      } else if (newRank > maxRanking) {
        newRank = maxRanking;
      }
      if (newRank > rank) {
        rank = newRank;
        keyIndex = i;
        keyThreshold = threshold;
        newRankedValue = itemValue;
      }
      return { rankedValue: newRankedValue, rank, keyIndex, keyThreshold };
    },
    {
      rankedValue: item as unknown as string,
      rank: rankings.NO_MATCH as Ranking,
      keyIndex: -1,
      keyThreshold: options.threshold,
    }
  );
}

function getMatchRanking<ItemType>(
  testString: string,
  stringToRank: string,
  options: MatchSorterOptions<ItemType>
): Ranking {
  testString = prepareValueForComparison(testString, options);
  stringToRank = prepareValueForComparison(stringToRank, options);

  if (stringToRank.length > testString.length) {
    return rankings.NO_MATCH;
  }

  if (testString === stringToRank) {
    return rankings.CASE_SENSITIVE_EQUAL;
  }

  testString = testString.toLowerCase();
  stringToRank = stringToRank.toLowerCase();

  if (testString === stringToRank) {
    return rankings.EQUAL;
  }

  if (testString.startsWith(stringToRank)) {
    return rankings.STARTS_WITH;
  }

  if (testString.includes(` ${stringToRank}`)) {
    return rankings.WORD_STARTS_WITH;
  }

  if (testString.includes(stringToRank)) {
    return rankings.CONTAINS;
  } else if (stringToRank.length === 1) {
    return rankings.NO_MATCH;
  }

  if (getAcronym(testString).includes(stringToRank)) {
    return rankings.ACRONYM;
  }

  return getClosenessRanking(testString, stringToRank);
}

function getAcronym(string: string): string {
  let acronym = "";
  const wordsInString = string.split(" ");
  wordsInString.forEach((wordInString) => {
    const splitByHyphenWords = wordInString.split("-");
    splitByHyphenWords.forEach((splitByHyphenWord) => {
      acronym += splitByHyphenWord.substr(0, 1);
    });
  });
  return acronym;
}

function getClosenessRanking(
  testString: string,
  stringToRank: string
): Ranking {
  let matchingInOrderCharCount = 0;
  let charNumber = 0;
  function findMatchingCharacter(
    matchChar: string,
    string: string,
    index: number
  ) {
    for (let j = index, J = string.length; j < J; j++) {
      const stringChar = string[j];
      if (stringChar === matchChar) {
        matchingInOrderCharCount += 1;
        return j + 1;
      }
    }
    return -1;
  }
  function getRanking(spread: number) {
    const spreadPercentage = 1 / spread;
    const inOrderPercentage = matchingInOrderCharCount / stringToRank.length;
    const ranking = rankings.MATCHES + inOrderPercentage * spreadPercentage;
    return ranking as Ranking;
  }
  const firstIndex = findMatchingCharacter(stringToRank[0], testString, 0);
  if (firstIndex < 0) {
    return rankings.NO_MATCH;
  }
  charNumber = firstIndex;
  for (let i = 1, I = stringToRank.length; i < I; i++) {
    const matchChar = stringToRank[i];
    charNumber = findMatchingCharacter(matchChar, testString, charNumber);
    const found = charNumber > -1;
    if (!found) {
      return rankings.NO_MATCH;
    }
  }

  const spread = charNumber - firstIndex;
  return getRanking(spread);
}

function sortRankedValues<ItemType>(
  a: RankedItem<ItemType>,
  b: RankedItem<ItemType>,
  baseSort: BaseSorter<ItemType>
): number {
  const aFirst = -1;
  const bFirst = 1;
  const { rank: aRank, keyIndex: aKeyIndex } = a;
  const { rank: bRank, keyIndex: bKeyIndex } = b;
  const same = aRank === bRank;
  if (same) {
    if (aKeyIndex === bKeyIndex) {
      // use the base sort function as a tie-breaker
      return baseSort(a, b);
    } else {
      return aKeyIndex < bKeyIndex ? aFirst : bFirst;
    }
  } else {
    return aRank > bRank ? aFirst : bFirst;
  }
}

function prepareValueForComparison<ItemType>(
  value: string,
  { keepDiacritics }: MatchSorterOptions<ItemType>
): string {
  value = `${value}`;
  return value;
}

function getItemValues<ItemType>(
  item: ItemType,
  key: KeyOption<ItemType>
): Array<string> {
  if (typeof key === "object") {
    key = key.key as string;
  }
  let value: string | Array<string> | null | unknown;
  if (typeof key === "function") {
    value = key(item);
  } else if (item == null) {
    value = null;
  } else if (Object.hasOwnProperty.call(item, key)) {
    value = (item as IndexableByString)[key];
  } else if (key.includes(".")) {
    return getNestedValues<ItemType>(key, item);
  } else {
    value = null;
  }

  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [String(value)];
}

function getNestedValues<ItemType>(
  path: string,
  item: ItemType
): Array<string> {
  const keys = path.split(".");

  type ValueA = Array<ItemType | IndexableByString | string>;
  let values: ValueA = [item];

  for (let i = 0, I = keys.length; i < I; i++) {
    const nestedKey = keys[i];
    let nestedValues: ValueA = [];

    for (let j = 0, J = values.length; j < J; j++) {
      const nestedItem = values[j];

      if (nestedItem == null) continue;

      if (Object.hasOwnProperty.call(nestedItem, nestedKey)) {
        const nestedValue = (nestedItem as IndexableByString)[nestedKey];
        if (nestedValue != null) {
          nestedValues.push(nestedValue as IndexableByString | string);
        }
      } else if (nestedKey === "*") {
        nestedValues = nestedValues.concat(nestedItem);
      }
    }

    values = nestedValues;
  }

  if (Array.isArray(values[0])) {
    const result: Array<string> = [];
    return result.concat(...(values as Array<string>));
  }
  return values as Array<string>;
}

function getAllValuesToRank<ItemType>(
  item: ItemType,
  keys: ReadonlyArray<KeyOption<ItemType>>
) {
  const allValues: Array<{ itemValue: string; attributes: KeyAttributes }> = [];
  for (let j = 0, J = keys.length; j < J; j++) {
    const key = keys[j];
    const attributes = getKeyAttributes(key);
    const itemValues = getItemValues(item, key);
    for (let i = 0, I = itemValues.length; i < I; i++) {
      allValues.push({
        itemValue: itemValues[i],
        attributes,
      });
    }
  }
  return allValues;
}

const defaultKeyAttributes = {
  maxRanking: Infinity as Ranking,
  minRanking: -Infinity as Ranking,
};

function getKeyAttributes<ItemType>(key: KeyOption<ItemType>): KeyAttributes {
  if (typeof key === "string") {
    return defaultKeyAttributes;
  }
  return { ...defaultKeyAttributes, ...key };
}

export { matchSorter, rankings, defaultBaseSortFn };

export type {
  MatchSorterOptions,
  KeyAttributesOptions,
  KeyOption,
  KeyAttributes,
  RankingInfo,
  ValueGetterKey,
};
