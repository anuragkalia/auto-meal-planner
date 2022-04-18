<script lang="ts">
  import { getDate } from "./lib/day";

  import { getMealForDay } from "./lib/meal";

  const relativeDay = 0;

  const date = getDate(relativeDay);
  const breakfastItems = getMealForDay("breakfast", relativeDay);

  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Date = {date}
    breakfast =
    {#each breakfastItems as item}
      <p>{item.name}</p>
    {/each}
  </p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
