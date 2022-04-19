import { getDate } from "./day";
import seedrandom from "seedrandom";
import { getMealData, MealItem, MealTime, PRIORITY } from "./db";

import type { Nutrition } from "./db";

const MULTIPLES_MAP = {
  [PRIORITY.HIGH]: 5,
  [PRIORITY.NORMAL]: 3,
  [PRIORITY.LOW]: 1,
};

function getProbableMeal(allMealItems: MealItem[], seed: string) {
  const finalItems: MealItem[] = [];
  const probableItems: MealItem[] = [];

  allMealItems.forEach((mealItem) => {
    switch (mealItem.priority) {
      case PRIORITY.ALWAYS:
        finalItems.push(mealItem);
        break;
      case PRIORITY.HIGH:
      case PRIORITY.NORMAL:
      case PRIORITY.LOW:
        for (let i = 0; i < MULTIPLES_MAP[mealItem.priority]; i++) {
          probableItems.push(mealItem);
        }
        break;
    }
  });

  const rng = seedrandom(seed);
  const indexPerDayPerMeal = Math.floor(rng() * probableItems.length);
  const selectedItem = probableItems[indexPerDayPerMeal];

  finalItems.push(selectedItem);

  return finalItems;
}

let mealDataCache: MealItem[] | undefined;

async function getMealForDay(meal: MealTime, relativeDay = 0) {
  if (!mealDataCache) {
    mealDataCache = await getMealData();
  }

  console.log({ mealDataCache });

  const absoluteDate = getDate(relativeDay);

  const filteredMealItems = mealDataCache.filter(function validMealItem(
    mealItem
  ) {
    return (
      mealItem.addedSince <= absoluteDate &&
      mealItem.isLikedBy.includes("anurag")
    );
  });

  const seed = absoluteDate + meal;

  return getProbableMeal(filteredMealItems, seed);
}

function parseNutrients(nutrients: Nutrition) {
  return [
    `${nutrients.calories.toFixed(2)} cal`,
    `${nutrients.carbs.toFixed(2)}g`,
    `${nutrients.fat.toFixed(2)}g`,
    `${nutrients.protein.toFixed(2)}g`,
  ];
}

export { getMealForDay, parseNutrients };
