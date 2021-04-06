const app = require("express")();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(require("cors")({
  origin: "*",
  optionsSuccessStatus: 200
}));
app.use(require("cookie-parser")());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", require("./routes"));

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log(`App it running on port ${process.env.PORT || 3000}`);
  }
});
