<script>
    import { chosenOpt, clearStorage, fetchInfo } from "../stores/dataStores";
    import { createEventDispatcher } from "svelte";
    import { searchNextQuestion,searchNextQuestionID } from "../lib/search";
    import { doAnswerAndStartSession } from "../lib/answer";
    import Card from "./Card.svelte";

    let dispatch = createEventDispatcher();

    export let questionnaireInfo;
    export let questionsArray;
    export let nextQuestion;
    export let session;
    let profileText = "";

    const { questionnaireID, questionnaireTitle } = questionnaireInfo;
    const { qID, qtext, required, type, options } = nextQuestion;

    if (type === "profile") $chosenOpt = options[0];

    async function submitAnswer() {
        let nextQuestionID = searchNextQuestionID(
            questionsArray,
            nextQuestion,
            $chosenOpt);

        session = await doAnswerAndStartSession(
            questionnaireID,
            qID,
            session,
            ((type === "question")?$chosenOpt.optID:profileText));
        
        if ($fetchInfo.status > 199 && $fetchInfo.status < 300) {
            dispatch("answeredQuestion", {nextQuestionID, session});
        }

        $chosenOpt = null;
    }

    async function replaceRegex(content) {
        const regex = /\[\*(.*?)\]/g;
        let match;
        let result = {
            qID: null,
            optID: null
        };

        while ((match = regex.exec(content)) !== null) {
            if (result.optID === null) {
                result.optID = match;
                continue;
            }

            if (result.optID[1].includes(match[1])) {
                result.qID = match;
            }
            else {
                result.qID = result.optID;
                result.optID = match;
            }
        }

        if (result.qID !== null && result.optID !== null) {
             const {nextQuestion: referencedQuestion} = await searchNextQuestion({
                questionnaireID,
                questionnaireTitle,
                nextQuestionID: result.qID[1]});
            
            if ($fetchInfo.status > 199 && $fetchInfo.status < 300) {
                const {qtext, options} = referencedQuestion;
                const opttxt = options.find(option => option.optID === result.optID[1]).opttxt;

                content = content.replace(result.optID[0], `"${opttxt}"`);
                content = content.replace(result.qID[0], `"${qtext}"`);
                }
        }
        return content;
    }

    function handleClear() {
        (type === "question")? ($chosenOpt = null) : (profileText = "");
    }

    function handleCancel() {
        clearStorage();
    }

</script>

<Card>
    <header>
        <h1>{questionnaireTitle}</h1>
        {#await replaceRegex(qtext)}
            <p>{qtext}</p>
        {:then questionText}
            <p>{questionText}</p>
        {/await}
    </header>
        <form id="question-form" on:submit|preventDefault={submitAnswer}>
            {#if type==="question"}
                {#each options as option (option.optID)}
                <label>
                    <input type="radio" name="option" value={option} bind:group={$chosenOpt}>
                    {option.opttxt}
                </label>
                {/each}
            {:else if type==="profile"}
                <label>
                    <input type="text" name="option" bind:value={profileText} placeholder="fill in your information">
                </label>
            {/if}
        </form>
        <button form="question-form" type="submit" disabled={((type==="question")?!$chosenOpt:!profileText) && required}>Submit</button>
        <button form="question-form" type="button" on:click={handleClear}>Clear</button>
        <button form="question-form" type="button" on:click={handleCancel}>Cancel</button>
</Card>
