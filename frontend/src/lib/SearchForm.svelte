<script>
    import { createEventDispatcher } from "svelte";
    import { searchQuestionnaire } from "./functions/search";
    import Card from "./Card.svelte";

    let dispatch = createEventDispatcher();

    const minChars = 1;
    let inputText = "";
    
    $: disableSubmit = inputText.trim().length < minChars;

    async function handleSubmit() {
        try {
            const questionnaireData = await searchQuestionnaire(inputText.trim());
            dispatch("foundQuestionnaire", questionnaireData);
        } catch (e) {
            console.log(e.message);
        }

    }
</script>

<Card>
    <header>
        <h1>Welcome to intelliQ</h1>
    </header>
    <form on:submit|preventDefault={handleSubmit}>
        <div>
            <input type="text" bind:value={inputText} placeholder="Enter a Questionnaire ID">
            <button type="submit" disabled={disableSubmit}>Submit</button>
        </div>
        {#if disableSubmit}
        <p>Questionnaire must have an ID.</p>
        {/if}
    </form>
</Card>