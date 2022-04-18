type BreakfastMealName =
  | "boiled eggs"
  | "milk"
  | "cheese omelette with 3 eggs"
  | "besan chila"
  | "mixed dal dosa"
  | "moong sprouts"
  | "pesarattu"
  | "soya curry"
  | "Muesli";

enum PRIORITY {
  HIGH,
  LOW,
  NORMAL,
  NEVER,
  ALWAYS,
}

type Nutrition = [number, number, number, number];

type SingleMealItem = {
  nutrients: Nutrition;
  qty: string;
  priority: PRIORITY;
  multiple: number;
  addedSince: string;
};

type SingleMealMap = {
  [P in BreakfastMealName]: SingleMealItem;
};

const singleBreakfastData: SingleMealMap = {
  "boiled eggs": {
    nutrients: [68, 0.5, 4.7, 5.5],
    qty: "1 medium",
    priority: PRIORITY.ALWAYS,
    multiple: 3,
    addedSince: "2022/3/14",
  },
  milk: {
    nutrients: [58.2, 4.8, 3, 3],
    qty: "100mL",
    priority: PRIORITY.NEVER,
    multiple: 1,
    addedSince: "2022/3/14",
  },
  "cheese omelette with 3 eggs": {
    nutrients: [493, 10, 37, 20],
    qty: "1",
    priority: PRIORITY.NEVER,
    multiple: 1,
    addedSince: "2022/3/14",
  },
  "besan chila": {
    nutrients: [109, 10.8, 5.4, 4.1],
    qty: "1 medium",
    priority: PRIORITY.NORMAL,
    multiple: 3,
    addedSince: "2022/3/14",
  },
  "mixed dal dosa": {
    nutrients: [151, 21.9, 5, 4.4],
    qty: "1 medium",
    priority: PRIORITY.NORMAL,
    multiple: 3,
    addedSince: "2022/3/14",
  },
  "moong sprouts": {
    nutrients: [151, 21.9, 5, 4.4],
    qty: "80g",
    priority: PRIORITY.NORMAL,
    multiple: 1.5,
    addedSince: "2022/3/14",
  },
  pesarattu: {
    nutrients: [154, 18.5, 5.5, 7.8],
    qty: "1 medium",
    priority: PRIORITY.NORMAL,
    multiple: 3,
    addedSince: "2022/3/14",
  },
  "soya curry": {
    nutrients: [110, 9.5, 5.7, 5.6],
    qty: "150g",
    priority: PRIORITY.NORMAL,
    multiple: 1,
    addedSince: "2022/3/14",
  },
  Muesli: {
    nutrients: [159, 32.2, 2.4, 3.2],
    qty: "40g",
    priority: PRIORITY.NEVER,
    multiple: 2.5,
    addedSince: "2022/3/14",
  },
};

type ComboMealList = {
  name: string;
  combo: BreakfastMealName[];
  priority: PRIORITY;
  addedSince: string;
}[];

const comboBreakfastData: ComboMealList = [
  {
    name: "milk + muesli",
    combo: ["milk", "Muesli"],
    priority: PRIORITY.ALWAYS,
    addedSince: "2022/3/14",
  },
];

type MealListItem = SingleMealItem & { name: string };

export { singleBreakfastData, comboBreakfastData, PRIORITY };

export type { MealListItem, Nutrition, SingleMealMap, ComboMealList };
