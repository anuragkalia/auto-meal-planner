<script lang="ts">
  import { getDate } from "./lib/day";

  import Meal from "./Meal.svelte";

  const relativeDay = 0;

  const date = getDate(relativeDay);
</script>

<main>
  <h1>Meal for the day!</h1>
  <h2>Today is {date}</h2>
  <h3>Breakfast</h3>

  <Meal {relativeDay} mealTime="breakfast" />
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
