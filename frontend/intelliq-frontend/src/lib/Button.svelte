<script>
    export let disabled = false;
</script>

<!--
should have been disabled={disabled} but
if names match svelte takes care of it
-->
<button {disabled}>
    <slot></slot>
</button>