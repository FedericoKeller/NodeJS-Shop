const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const setUpNunjucks = require("./helpers/nunjuck_helpers");
const errorController = require("./controllers/error");

const mongoose = require("mongoose");
const DATABASE_CONNECTION = require("./util/database").DATABASE_CONNECTION;
const User = require("./models/user");

const app = express();

app.engine("njk", nunjucks.render);
app.set("view engine", "njk");

setUpNunjucks(app);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("61672b977ffbe7aaab05a592")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(DATABASE_CONNECTION)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Federico",
          email: "test@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
