<script>
    import Button from "./Button.svelte";
    import Card from "./Card.svelte";

    const minChars = 1;
    let inputText = ""; 

    async function searchQuestionnaire(ID) {
        try {
            let url = ""
            + `http://${import.meta.env.VITE_APP_HOST}`
            + `:${import.meta.env.VITE_APP_PORT}`
            + `${import.meta.env.VITE_APP_BASE_URL}/`
            + `questionnaire/${ID}`;

            const response = await fetch(url);

            const {questionnaireID, questionnaireTitle, questions} = await response.json();
            const questionnaire = {questionnaireID, questionnaireTitle, questions};
            console.log(questionnaire);
        } catch (e) {
            console.log(e.message);
        }
    }
</script>

<Card>
    <header>
        <h1>Welcome to intelliQ</h1>
    </header>
    <form on:submit|preventDefault={() => searchQuestionnaire(inputText)}>
        <div class="questionnaire-input">
            <input type="text" bind:value={inputText} placeholder="Enter a Questionnaire ID">
            <Button disabled={inputText.trim().length < minChars}></Button>
        </div>

    </form>
</Card>