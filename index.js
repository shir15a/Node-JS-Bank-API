const express = require("express");
const bodyParser = require("body-parser");

const bankRoute = require("./routes/Bank.routes");

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/bankApi", bankRoute);

app.listen(port, () => {
  console.log(`appleication start at ${port}`);
});