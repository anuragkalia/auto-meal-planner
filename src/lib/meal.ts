import { getDate } from "./day";
import seedrandom from "seedrandom";
import {
  singleBreakfastData,
  comboBreakfastData,
  PRIORITY,
  MealListItem,
} from "./db";

import type { Nutrition, SingleMealMap, ComboMealList } from "./db";

const MULTIPLES_MAP = {
  [PRIORITY.HIGH]: 5,
  [PRIORITY.NORMAL]: 3,
  [PRIORITY.LOW]: 1,
};

type MealType = "breakfast";

type MealTypeMap = {
  [P in MealType]: {
    singleMealMap: SingleMealMap;
    multiMealList: ComboMealList;
  };
};

const mealData: MealTypeMap = {
  breakfast: {
    singleMealMap: singleBreakfastData,
    multiMealList: comboBreakfastData,
  },
};

function getMealForDayInternal(
  meal: MealType,
  relativeDay = 0,
  singleMealMap: SingleMealMap,
  comboMealList: ComboMealList,
  nutrientThresholds: Nutrition
) {
  const absoluteDateString = getDate(relativeDay);
  const comboBreakfastDataFilled: MealListItem[] = getBackfilledComboItemsList(
    comboMealList,
    singleMealMap
  );

  const singleItemsAsList: MealListItem[] = Object.entries(singleMealMap).map(
    ([name, data]) => ({ ...data, name })
  );

  const allBreakfastItems = singleItemsAsList.concat(comboBreakfastDataFilled);

  const finalBreakfastItems: MealListItem[] = [];
  const probableItems: MealListItem[] = [];

  allBreakfastItems.forEach((mealItem) => {
    if (mealItem.addedSince <= absoluteDateString) {
      switch (mealItem.priority) {
        case PRIORITY.ALWAYS:
          finalBreakfastItems.push(mealItem);
          break;
        case PRIORITY.HIGH:
        case PRIORITY.NORMAL:
        case PRIORITY.LOW:
          for (let i = 0; i < MULTIPLES_MAP[mealItem.priority]; i++) {
            probableItems.push(mealItem);
          }
          break;
      }
    }
  });

  const rng = seedrandom(getDate(relativeDay) + meal);
  const indexPerDayPerMeal = Math.floor(rng() * probableItems.length);
  const selectedItem = probableItems[indexPerDayPerMeal];

  finalBreakfastItems.push(selectedItem);

  return finalBreakfastItems;
}

function getBackfilledComboItemsList(
  comboItemsList: ComboMealList,
  singleItemsMap: SingleMealMap
): MealListItem[] {
  return comboItemsList.map((data) => {
    const { priority, addedSince, name, combo } = data;

    const nutrients = combo
      .map((name) => {
        const { nutrients, multiple } = singleItemsMap[name];

        const final: Nutrition = [0, 0, 0, 0];

        for (let i = 0; i < final.length; i++) {
          final[i] = nutrients[i] * multiple;
        }
        return final;
      })
      .reduce(
        (nutrients_sum, nutrients_current) => {
          const final: Nutrition = [...nutrients_sum];

          for (let i = 0; i < final.length; i++) {
            final[i] = final[i] + nutrients_current[i];
          }

          return final;
        },
        [0, 0, 0, 0]
      );

    return {
      priority,
      addedSince,
      name,
      qty: "N/A",
      nutrients,
      multiple: 1,
    };
  });
}

function getMealForDay(meal: MealType, relativeDay = 0) {
  return getMealForDayInternal(
    meal,
    relativeDay,
    mealData[meal].singleMealMap,
    mealData[meal].multiMealList,
    [0, 0, 0, 0]
  );
}

export { getMealForDay };
