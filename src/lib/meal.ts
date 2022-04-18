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

        return scalarMultiplyNutrition(nutrients, multiple);
      })
      .reduce((nutrients_sum, nutrients_current) => {
        return addNutrition(nutrients_sum, nutrients_current);
      }, getZeroNutrition());

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

function getZeroNutrition(): Nutrition {
  return [0, 0, 0, 0];
}

function addNutrition(nutrients_sum: Nutrition, nutrients_current: Nutrition) {
  const final: Nutrition = [...nutrients_sum];

  for (let i = 0; i < final.length; i++) {
    final[i] = final[i] + nutrients_current[i];
  }

  return final;
}

function scalarMultiplyNutrition(nutrients: Nutrition, multiple: number) {
  const final: Nutrition = getZeroNutrition();

  for (let i = 0; i < final.length; i++) {
    final[i] = nutrients[i] * multiple;
  }
  return final;
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

function parseNutrients(nutrients: Nutrition) {
  return [
    `${nutrients[0].toFixed(2)} cal`,
    `${nutrients[1].toFixed(2)}g`,
    `${nutrients[2].toFixed(2)}g`,
    `${nutrients[3].toFixed(2)}g`,
  ];
}

export { getMealForDay, parseNutrients, scalarMultiplyNutrition };

export type { MealType };
