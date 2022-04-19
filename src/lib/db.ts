import { set } from "lodash-es";

enum PRIORITY {
  HIGH,
  LOW,
  NORMAL,
  NEVER,
  ALWAYS,
}

type Nutrition = {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
};

type MealTime = "breakfast";

type Person = "anurag" | "akhilesh";

type MealItem = {
  name: string;
  qty: string;
  nutrients: Nutrition;
  mealTime: MealTime[];
  isLikedBy: Person[];
  priority: PRIORITY;
  multiple: number;
  addedSince: string;
  isCompound: boolean;
};

type NutritionDB = {
  [P in keyof Nutrition]: string;
};

type MealItemDB = {
  [P in keyof MealItem]: MealItem[P] extends Nutrition ? NutritionDB : string;
};

function getZeroNutrition(): Nutrition {
  return { calories: 0, carbs: 0, fat: 0, protein: 0 };
}

function addNutrition(A: Nutrition, B: Nutrition): Nutrition {
  return {
    calories: A.calories + B.calories,
    carbs: A.carbs + B.carbs,
    fat: A.fat + B.fat,
    protein: A.protein + B.protein,
  };
}

function scalarMultiplyNutrition(A: Nutrition, multiple: number): Nutrition {
  return {
    calories: A.calories * multiple,
    carbs: A.carbs * multiple,
    fat: A.fat * multiple,
    protein: A.protein * multiple,
  };
}

function stripQuotes(str: string) {
  if (str[0] === '"' && str[str.length - 1] === '"') {
    return str.slice(1, str.length - 1);
  }
  return str;
}

async function getMealData() {
  const response = await fetch("/meal_db.tsv");
  const file = await response.text();

  const [header, ...data] = file.split("\n");

  const headerArray = header.split("\t").map(stripQuotes);

  const rawData = data.map(function convertToObject(row) {
    const rowObj: Partial<MealItemDB> = {};
    const rowArray = row.split("\t").map(stripQuotes);

    headerArray.forEach((colName, i) => {
      set(rowObj, colName, rowArray[i]);
    });

    return rowObj;
  });

  const rawCompoundData: Partial<MealItemDB>[] = [],
    rawSingleData: Partial<MealItemDB>[] = [];

  rawData.forEach((mealItemDB) => {
    if (mealItemDB.isCompound !== "") {
      rawCompoundData.push(mealItemDB);
    } else {
      rawSingleData.push(mealItemDB);
    }
  });

  const mappedSingleData = rawSingleData.map(function toMealItemDB(rowObj) {
    const mealItem: MealItem = {
      name: rowObj.name,
      qty: rowObj.qty,
      nutrients: toNutrition(rowObj.nutrients),
      mealTime: toMealTime(rowObj.mealTime),
      isLikedBy: toLikedBy(rowObj.isLikedBy),
      priority: toPriority(rowObj.priority),
      multiple: Number.parseInt(rowObj.multiple),
      addedSince: rowObj.addedSince,
      isCompound: false,
    };

    return mealItem;
  });

  const mappedCompoundData = rawCompoundData.map(function toCompoundMealItemDB(
    rowObj
  ) {
    const compoundNutrition = rowObj.isCompound
      .split(",")
      .map((name) => {
        const foundItem = mappedSingleData.find(
          (mealItem) => mealItem.name === name
        );
        return foundItem;
      })
      .map((mealItem) => {
        return scalarMultiplyNutrition(mealItem.nutrients, mealItem.multiple);
      })
      .reduce((nutrients_soFar, nutrients_current) => {
        return addNutrition(nutrients_current, nutrients_soFar);
      }, getZeroNutrition());

    const mealItem: MealItem = {
      name: rowObj.name,
      qty: "N/A",
      nutrients: compoundNutrition,
      mealTime: toMealTime(rowObj.mealTime),
      isLikedBy: toLikedBy(rowObj.isLikedBy),
      priority: toPriority(rowObj.priority),
      multiple: 1,
      addedSince: rowObj.addedSince,
      isCompound: true,
    };

    return mealItem;
  });

  const finalMealData = mappedSingleData.concat(mappedCompoundData);

  return finalMealData;
}

function toNutrition(nutrientsDB: NutritionDB): Nutrition {
  const UNIT_STRIPPER_REGEX = /(.*)\S*(cal|g)/;
  const [, caloriesStr] = nutrientsDB.calories.match(UNIT_STRIPPER_REGEX);
  const [, carbsStr] = nutrientsDB.carbs.match(UNIT_STRIPPER_REGEX);
  const [, fatStr] = nutrientsDB.fat.match(UNIT_STRIPPER_REGEX);
  const [, proteinStr] = nutrientsDB.protein.match(UNIT_STRIPPER_REGEX);

  const nutrients: Nutrition = {
    calories: Number.parseFloat(caloriesStr),
    carbs: Number.parseFloat(carbsStr),
    fat: Number.parseFloat(fatStr),
    protein: Number.parseFloat(proteinStr),
  };

  return nutrients;
}

function toMealTime(mealTimeDb: string): MealTime[] {
  const mealTime: MealTime[] = [];
  mealTimeDb.split(",").forEach((str) => {
    switch (str) {
      case "B":
        mealTime.push("breakfast");
        break;
    }
  });

  return mealTime;
}

function toLikedBy(mealTimeDb: string): Person[] {
  const mealTime: Person[] = [];
  mealTimeDb.split(",").forEach((str) => {
    switch (str) {
      case "K":
        mealTime.push("anurag");
        break;
      case "G":
        mealTime.push("akhilesh");
        break;
    }
  });

  return mealTime;
}

function toPriority(priorityDB: string): PRIORITY {
  switch (priorityDB) {
    case "NORMAL":
      return PRIORITY.NORMAL;
    case "ALWAYS":
      return PRIORITY.ALWAYS;
    case "NEVER":
      return PRIORITY.NEVER;
    case "LOW":
      return PRIORITY.LOW;
    case "HIGH":
      return PRIORITY.HIGH;
  }
}

export { getMealData, PRIORITY, scalarMultiplyNutrition };

export type { MealItem, Nutrition, MealTime, Person };
