<script lang="ts">
  export let shareText;

  enum SHARED_STATE {
    UNTOUCHED,
    CLICKED,
    SHARED_SUCCESS,
    SHARED_ERROR,
  }

  let sharedState = SHARED_STATE.UNTOUCHED;

  function handleClick() {
    if (navigator.clipboard) {
      sharedState = SHARED_STATE.CLICKED;
      navigator.clipboard.writeText(shareText).then(
        () => {
          sharedState = SHARED_STATE.SHARED_SUCCESS;
        },
        () => {
          sharedState = SHARED_STATE.SHARED_ERROR;
        }
      );
    }
  }
</script>

{#if navigator.clipboard}
  <button type="button" on:click={handleClick}>
    {#if sharedState === SHARED_STATE.UNTOUCHED}
      Share
    {:else if sharedState === SHARED_STATE.CLICKED}
      Sharing...
    {:else if sharedState === SHARED_STATE.SHARED_SUCCESS}
      Shared!
    {:else if sharedState === SHARED_STATE.SHARED_ERROR}
      Error while sharing
    {/if}
  </button>
{/if}
