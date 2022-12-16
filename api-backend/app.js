const functionalityRouter = require("./routes/functional");

const express = require("express");

const app = express();

app.use("/intelliq_api", functionalityRouter);

app.listen(3000, console.log("App listening on port 3000"));