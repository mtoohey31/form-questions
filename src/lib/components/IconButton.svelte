<script lang="ts">
  export let icon: string;
</script>

<button
  class="bg-googleBlue hover:shadow-blue h-google transition text-white shadow-md p-2 border-googleBlue border"
  on:click
>
  <svg viewBox="0 0 24 24" class="h-full fill-current">
    <path d={icon} />
  </svg>
</button>
