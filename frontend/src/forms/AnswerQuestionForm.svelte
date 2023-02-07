<script>
    import { chosenOpt, clearStorage } from "../stores/dataStores";
    import { createEventDispatcher } from "svelte";
    import { searchNextQuestion,searchNextQuestionID } from "../lib/search";
    import { doAnswerAndStartSession } from "../lib/answer";
    import Card from "./Card.svelte";

    const keywordForTextQuestions = "TXT";

    let dispatch = createEventDispatcher();

    // parameters that are passed through the parent (App.svelte)
    export let questionnaireInfo;
    export let questionsArray;
    export let nextQuestion;
    export let session;


    /* ------------------------------------------------------------------------------ */
    // destructure data in a proper format
    const { questionnaireID, questionnaireTitle } = questionnaireInfo;
    const { qID, qtext, required: requiredString, options: someOptions } = nextQuestion;

    const required = requiredString.toLowerCase() !== "false"; 
    let options = setUpOptions(someOptions);
    /* ------------------------------------------------------------------------------ */

    // submitAnswer = find the ID of the next Question +
    //                send the POST request +
    //                if this is the first question you answer get a session ID +
    //                make $chosenOpt null for the next question +
    //                notify parent for new data or errors
    async function submitAnswer() {
        try {
            let nextQuestionID = searchNextQuestionID(
            questionsArray,
            nextQuestion,
            $chosenOpt);

        session = await doAnswerAndStartSession(
            questionnaireID,
            qID,
            session,
            (foundTextKeyword($chosenOpt.optID)?$chosenOpt.opttxt:$chosenOpt.optID));

        $chosenOpt = null;
        dispatch("answeredQuestion", {nextQuestionID, session});
        } catch (err) {
            dispatch("errorOccured", err);
        }

    }

    // questions can reference at most one other question (should be multiple choice)
    async function replaceRegex(content) {
        const regex = /\[\*(.*?)\]/g; // look for strings like this one: "[*<string>]"
        let match;
        let result = {
            qID: null,
            optID: null
        };

        // find questionID and optionID, the questionID should be a substring of the optionID
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

        // search for the replacement text and do the replacement, handle errors...
        if (result.qID !== null && result.optID !== null) {
            try {
                const referencedQuestion = await searchNextQuestion({
                questionnaireID,
                questionnaireTitle,
                nextQuestionID: result.qID[1]});
            
                const {qtext, options} = referencedQuestion;
                const opttxt = options.find(option => option.optID === result.optID[1]).opttxt;

                content = content.replace(result.optID[0], `"${opttxt}"`);
                content = content.replace(result.qID[0], `"${qtext}"`);
            } catch (err) {
                dispatch("errorOccured", err);
                return;
            }

        }

        // return the edited (or not) string
        return content;
    }

    // clear user's choice, edits in text fields, etc...
    function handleClear() {
        $chosenOpt = null;
        options = setUpOptions(someOptions);
    }

    // delete local Storage, which deletes the state of our app
    function handleCancel() {
        clearStorage();
    }

    // question IDs that include the keyword are answered by user input text
    function foundTextKeyword(text) {
        return text.includes(keywordForTextQuestions);
    }

    // determine whether the submit button will be disabled or not
    function calculateDisabled(option) {
        if(!required) return false;

        if (!!option) {
            if(foundTextKeyword(option.optID)) {
            return !option.opttxt; // text questions
            }
            return !option; // non text questions
        }
        return true;
    }
    // make the disabled variable reactive to the users choice
    $: disabled = calculateDisabled($chosenOpt);

    // setUpOptions = erase text fields of text questions and for convenience to the user
    // if there is only one option in a text question, choose it by default.
    function setUpOptions(someOptions) {
        const options = someOptions.map(option => {
            return foundTextKeyword(option.optID)? {...option, opttxt: null}: option;
        })
        if (options.length === 1 && foundTextKeyword(options[0].optID)) {
            $chosenOpt = options[0];
        }
        return options;
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
        {#each options as option (option.optID)}
        <label>
            {#if foundTextKeyword(option.optID)} <!-- For text questions, allow the user to pick the text option and then
                                                      show only the text input field -->
                {#if $chosenOpt?.optID !== option.optID} <!-- $chosenOpt could be null here... -->
                <input type="radio" name="option" value={option} bind:group={$chosenOpt}>
                fill this field
                {:else}
                <input type="text" name="option" bind:value={$chosenOpt.opttxt} placeholder="enter your information">
                {/if}
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
