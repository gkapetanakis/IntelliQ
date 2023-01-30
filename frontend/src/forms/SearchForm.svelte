<script>
    import { fetchInfo } from "../stores/dataStores";
    import { createEventDispatcher } from "svelte";
    import { searchQuestionnaire } from "../lib/search";
    import Card from "./Card.svelte";

    let dispatch = createEventDispatcher();
    let inputText = "";

    async function handleSubmit() {
        const questionnaireData = await searchQuestionnaire(inputText.trim());
        if ($fetchInfo.status > 199 && $fetchInfo.status < 300)
            dispatch("foundQuestionnaire", questionnaireData);
    }
</script>

<Card>
    <header>
        <h1>Welcome to intelliQ</h1>
    </header>
    <form on:submit|preventDefault={handleSubmit}>
        <input type="text" bind:value={inputText} placeholder="Enter a Questionnaire ID">
        <button type="submit" disabled={!inputText}>Submit</button>
        {#if !inputText}
        <p>Questionnaire must have an ID.</p>
        {/if}
    </form>
</Card>