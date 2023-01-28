<script>
    import Button from "./Button.svelte";
    import Card from "./Card.svelte";

    export let questionnaireTitle = "";
    export let questionnaireID;
    export let qID;

    let question;

    async function getQuestion(questionnaireID, qID) {
        try {
            const url = ""
            + `http://${import.meta.env.VITE_APP_HOST}`
            + `:${import.meta.env.VITE_APP_PORT}`
            + `${import.meta.env.VITE_APP_BASE_URL}/`
            + "question/"
            + questionnaireID + "/"
            + qID;

            const response = await fetch(url);
            question = await response.json();
        } catch (e) {
            console.log(e.message);
        }
    }

</script>

<Card>
    <header>
        <h1>{questionnaireTitle}</h1>
    </header>
</Card>