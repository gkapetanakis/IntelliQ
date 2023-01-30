<script>
    import { createEventDispatcher } from "svelte";
    import { findNextQuestionID, doAnswerAndStartSession } from "./functions/answer";
    import Card from "./Card.svelte";

    let dispatch = createEventDispatcher();

    export let questionnaireInfo;
    export let questionsArray;
    const { questionnaireID, questionnaireTitle } = questionnaireInfo;

    export let nextQuestion;
    const { qID, qtext, required, type, options } = nextQuestion;

    export let session = null;

    let chosenOpt = null;

    async function submitAnswer() {
        let nextQuestionID = findNextQuestionID(
            questionsArray,
            nextQuestion,
            ((type ==="question")?chosenOpt:null));
        
        try {
            session = await doAnswerAndStartSession(
            questionnaireID,
            qID, session, ((type==="question")?chosenOpt.optID:chosenOpt));

            dispatch("answeredQuestion", {nextQuestionID, session});
        } catch (e) {
            console.log(e.message);
        }

    }

    function handleClear() {
        chosenOpt = null;
    }

</script>

<Card>
    <header>
        <h1>{questionnaireTitle}</h1>
        <p>{qtext}</p>
    </header>
        <form on:submit|preventDefault={submitAnswer}>
            {#if type==="question"}
            {#each options as option (option.optID)}
                <label>
                    <input type="radio" name="option" value={option} bind:group={chosenOpt}>
                    {option.opttxt}
                </label>
            {/each}
            {:else if type==="profile"}
                <label>
                    <input type="text" bind:value={chosenOpt} placeholder="fill in your information">
                </label>
            {/if}
            <button type="submit" disabled={!chosenOpt && required}>Submit</button>
            <button type="button" on:click={handleClear}>Clear</button>
            <button type="button">Cancel</button>
        </form>

</Card>