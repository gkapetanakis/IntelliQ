<!-- A generic wrapper for our stuff. We want them to look like
     cards, hence the name -->

<div class="card">
    <slot></slot>
</div>

<style>
    .card {
      background-color: #f5f5f5;
      padding: 20px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      width: 100%;
      max-width: 500px;
      margin: 20px auto;
      text-align: center;
    }
  </style>