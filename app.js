const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const setUpNunjucks = require('./helpers/nunjuck_helpers');
const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;
const app = express();

app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');

setUpNunjucks(app);


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(express.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})

