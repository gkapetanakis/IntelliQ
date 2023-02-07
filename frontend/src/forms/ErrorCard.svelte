<!-- same thing as card but for errors -->

<div class="error-card">
    <slot></slot>
</div>

<style>
    .error-card {
        background-color: #ffb3b3;
        color: #721c24;
        border: 1px solid #721c24;
        padding: 20px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        width: 100%;
        max-width: 500px;
        margin: 20px auto;
        font-weight: bold;
        text-align: center;
    }
  </style>