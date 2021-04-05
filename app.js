const app = require("express")();
require("dotenv").config();

app.use(require("cors")());
app.use("/", require("./routes"));

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log(`App it running on port ${process.env.PORT || 3000}`);
  }
});
