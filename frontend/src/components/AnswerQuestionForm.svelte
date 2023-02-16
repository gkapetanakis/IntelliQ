<script>
    import { writable } from "svelte/store";
    import { clearStorage, seenQuestions } from "../dataUtils/stores";
    import { createEventDispatcher } from "svelte";
    import { searchNextQuestionID } from "../functionUtils/search";
    import { doAnswerAndStartSession } from "../functionUtils/answer";
    import Card from "./Card.svelte";

    const openStringQuestion = "<open string>";
    let dispatch = createEventDispatcher();
    const chosenOpt = writable(null);

    // parameters that are passed through the parent (App.svelte)
    export let questionnaireInfo;
    export let questionsArray;
    export let nextQuestion;
    export let session;

    // ------------------------------------------------------------------------------ 
    // destructure data in a proper format
    const { questionnaireID, questionnaireTitle } = questionnaireInfo;
    const { qID, qtext: sometext, required: requiredString, options} = nextQuestion;

    const required = requiredString.toLowerCase() !== "false";
    // the required field is given as a string. We turn it into a boolean (or numerical)
    // value first

    const isOpenString =
        (options.length === 1) &&
        (options[0].opttxt === openStringQuestion);

    if (isOpenString) {
        $chosenOpt = options[0];
        options[0].opttxt = ""; // this is where we'll write the
    }                           // user's answer

    const qtext = replaceRegex(sometext);

    // to present the above data more properly: we do the following destructuring
    // { questionnaireID, questionnaireTitle } from questionnaireInfo
    // { qID, qtext, required, options } from nextQuestion
    // and we format each object in the appropriate type for the rest of the program
    // ------------------------------------------------------------------------------ 

    async function submitAnswer() {
        let nextQuestionID = searchNextQuestionID(
            questionsArray,
            nextQuestion,
            $chosenOpt);

        let optionID;
        if (isOpenString) {
            optionID = $chosenOpt.opttxt;
        }
        else if (!!$chosenOpt) {
            optionID = $chosenOpt.optID;
        }
        else {
            optionID = "";
        }
        session = await doAnswerAndStartSession( // if an error occurs
            questionnaireID,                     // this returns nothing
            qID,
            session,
            optionID);
        
        // submit answer was successfull
        seenQuestions.update(val =>
        [...val, {
            qID,
            qtext,
            options,
            ans: (!!$chosenOpt) ? $chosenOpt.opttxt : ""}]);
        // save the question

        $chosenOpt = null;
        if (!!session) {
            dispatch("answeredQuestion", {nextQuestionID, session});
        }
    }

    function replaceRegex(content) {
        const regex = /\[\*(.*?)\]/g; // look for strings like this one: "[*string]"
        let match;
        let matchings = [];

        let lookup;
        while ((match = regex.exec(content)) !== null) {
            const word = match[1];
            // maybe it's a qID
            lookup = $seenQuestions.filter(question => question.qID === word);
            if (lookup.length) {
                matchings = [...matchings, { original: match[0], replacement: lookup[0].qtext }];
                continue;
            }

            // maybe it's an optID
            lookup = $seenQuestions.filter(question => {
                for (const option of question.options) {
                    if (option.optID === word)
                        return true;
                }
                return false;
            });
            if (lookup.length) {
                let opttxt;
                for (const option of lookup[0].options) {
                    if (option.optID === word) {
                        opttxt = option.opttxt;
                        break;
                    }
                }
                matchings = [...matchings, { original: match[0], replacement: opttxt }];
            }
        } // regex.exec returns in match the following: match[0] = "[*string]", match[1] = "string"
          // and this is really helpful for us

        for (const { original, replacement } of matchings) {
            content = content.replace(original, `"${replacement}"`);
            // We want the replacement to appear in "" for styling reasons!
        }

        return content;
    }

    function handleClear() {
        $chosenOpt = null;
        if (isOpenString) {
            $chosenOpt = options[0];
            options[0].opttxt = "";
        }
    }

    // delete local Storage, which deletes the state of our app
    function handleCancel() {
        clearStorage();
    }

    // determine whether the submit button will be disabled or not
    function calculateDisabled(option) {
        if(!required) return false;

        if (!!option) {
            if(isOpenString) {
                return !option.opttxt; // text questions
            }
            return false; // non text questions
        }
        return true;
    }
    // make the disabled variable reactive to the users choice
    $: disabled = calculateDisabled($chosenOpt);

</script>

<Card>
    <header>
        <h1>{questionnaireTitle}</h1>
        <p>{qtext}</p>
    </header>
    <form id="question-form" on:submit|preventDefault={submitAnswer}>
        {#each options as option (option.optID)}
        <label>
            {#if isOpenString}
                <input type="text" name="option" bind:value={$chosenOpt.opttxt} placeholder="enter your information">
            {:else}
                <input type="radio" name="option" value={option} bind:group={$chosenOpt}>
                {option.opttxt}
            {/if}
        </label>
        {/each}
    </form>
    <button form="question-form" type="submit" {disabled}>Submit</button>
    <button form="question-form" type="button" on:click={handleClear}>Clear</button>
    <button form="question-form" type="button" on:click={handleCancel}>Cancel</button>
</Card>

<style>
    header {
    text-align: center;
    padding: 1em;
    }

    h1 {
        text-align: center;
        font-size: 1.5em;
        margin-bottom: 0.5em;
        color: #4d4d4d;
    }

    p {
        font-size: 1.5em;
        margin-bottom: 1em;
        color: #737373;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1em;
    }

    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 0.5em;
        font-size: 1.4em;
        color: #737373;
    }

    input[type="radio"], input[type="text"] {
        margin-right: 0.5em;
        border-radius: 5px;
        border: 1px solid #737373;
        padding: 0.5em;
        font-size: 0.8em;
    }

    button[type="submit"], button[type="button"] {
        border-radius: 5px;
        border: 1px solid #737373;
        padding: 0.5em 1em;
        font-size: 1.2em;
        margin-top: 1em;
        margin-right: 0.5em;
        background-color: white;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    button[type="submit"]:disabled, button[type="button"]:disabled {
        background-color: #f2f2f2;
        cursor: not-allowed;
    }

    button[type="submit"]:hover, button[type="button"]:hover {
        background-color: #737373;
        color: white;
    }
</style>