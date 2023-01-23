<script>
    import Button from "./Button.svelte";
    import Card from "./Card.svelte";

    let text = "";
    let minChars = 1;
    let btnDisabled = true;
    let message;

    function handleInput() {
        if (text.trim().length >= minChars) {
            message = null;
            btnDisabled = false;
        }
    }

    async function searchQuestionnaire() {
        if (text.trim().length < minChars) return;

        const questionnaireID = text;
        try {
            let endpoint = `http://${import.meta.env.VITE_APP_HOST}` +
            `:${import.meta.env.VITE_APP_PORT}` +
            `${import.meta.env.VITE_APP_BASE_URL}/` +
            `questionnaire/${questionnaireID}`;
            //let endpoint = "http://127.0.0.1:9103/intelliq_api/questionnaire/QQ000"

            console.log(endpoint);

            const response = await fetch(endpoint);
            const data = await response.json();

            console.log(data);


        } catch (e) {
            console.log(e.message);
        }

    }

</script>

<Card>
    <header>
        <h2>Enter a Questionnaire ID</h2>
    </header>
    <form on:submit|preventDefault={searchQuestionnaire}>
        <div class="questionnaire-input">
            <input type="text" on:input={handleInput} bind:value={text} placeholder="Enter a Questionnaire ID">
            <Button disabled={btnDisabled}></Button>
        </div>
        {#if message}
        <div class="message">
            {message}
        </div>
        {/if}
    </form>
</Card>

