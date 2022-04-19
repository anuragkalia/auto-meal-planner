<script lang="ts">
  import { MealTime, scalarMultiplyNutrition } from "./lib/db";

  import { getMealForDay, parseNutrients } from "./lib/meal";
  import ShareBtn from "./ShareBtn.svelte";

  export let relativeDay = 0;
  export let mealTime: MealTime;

  const mealItemsPromise = getMealForDay(mealTime, relativeDay);

  const tablePromise = mealItemsPromise.then((mealItems) => {
    const thead: string[] = [];
    const tbody: string[][] = [];
    mealItems.forEach((mealItem, mealIdx) => {
      const nutrientString = parseNutrients(
        scalarMultiplyNutrition(mealItem.nutrients, mealItem.multiple)
      );
      addNewRow();
      addToRow("Name", mealItem.name, mealIdx);
      addToRow("Qty", `${mealItem.qty} x${mealItem.multiple}`, mealIdx);
      addToRow("Calories", nutrientString[0], mealIdx);
      addToRow("Carbs", nutrientString[1], mealIdx);
      addToRow("Fats", nutrientString[2], mealIdx);
      addToRow("Protein", nutrientString[3], mealIdx);
    });

    return { thead, tbody };

    function addToRow(colName: string, colValue: string, rowIdx: number) {
      if (rowIdx === 0) {
        thead.push(colName);
      }

      tbody[tbody.length - 1].push(colValue);
    }

    function addNewRow() {
      tbody.push([]);
    }
  });

  function toSharedText(head: string[], body: string[][]) {
    return toSharedTextRow(head) + body.map(toSharedTextRow).join("");
  }

  function toSharedTextRow(row: string[]) {
    return row.join("\t") + "\n";
  }
</script>

{#await tablePromise then { tbody, thead }}
  <table>
    <thead>
      <tr>
        {#each thead as tcell}
          <th>{tcell}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each tbody as trow}
        <tr>
          {#each trow as tcell}
            <td>{tcell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
  <ShareBtn shareText={toSharedText(thead, tbody)} />
{/await}
