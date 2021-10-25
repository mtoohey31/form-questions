<script lang="ts">
  export let disabled = false;
</script>

{#if disabled}
  <button
    {...$$props}
    class="h-google py-0 text-white hover:shadow-blue transition bg-blue-400 shadow-md p-2 border-blue-400 border whitespace-nowrap"
    on:click
  >
    <slot />
  </button>
{:else}
  <button
    {...$$props}
    class="h-google py-0 text-white hover:shadow-blue transition bg-googleBlue shadow-md p-2 border-googleBlue border whitespace-nowrap"
    on:click
  >
    <slot />
  </button>
{/if}
