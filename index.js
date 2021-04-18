const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')

const bankRoute = require("./routes/Bank.routes");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use("/api/bankApi", bankRoute);


app.listen(process.env.PORT || port, () => {
  console.log(`appleication start at ${port}`);
});