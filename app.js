const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const setUpNunjucks = require("./helpers/nunjuck_helpers");
const errorController = require("./controllers/error");

const mongoose = require("mongoose");
const DATABASE_CONNECTION = require("./util/database").DATABASE_CONNECTION;

const app = express();

app.engine("njk", nunjucks.render);
app.set("view engine", "njk");

setUpNunjucks(app);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById("616488cea81bf0a86e9f1607")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(DATABASE_CONNECTION)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
