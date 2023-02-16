<script>
    import { createEventDispatcher } from "svelte";
    import { searchQuestionnaire } from "../functionUtils/search";
    import Card from "./Card.svelte";

    let dispatch = createEventDispatcher();
    let inputText = "";

    async function handleSubmit() {
        const questionnaireData = await searchQuestionnaire(inputText.trim());
        if (!!questionnaireData) { // in case of an error searchQuestionnaire returns nothing
            dispatch("foundQuestionnaire", questionnaireData);
        }
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
        <p>Questionnaire must have an ID</p>
        {/if}
    </form>
</Card>

<style>
  
    .card header h1 {
      font-size: 32px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #333;
    }
  
    .card form input {
      padding: 10px;
      font-size: 16px;
      border: none;
      border-bottom: 2px solid #333;
      width: 80%;
      margin-bottom: 20px;
    }
  
    .card form button {
      padding: 10px 20px;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .card form button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  
    .card form p {
      font-size: 1em;
      color: #737373;
      margin: 1em 0;
      text-align: center;
    }
  </style>