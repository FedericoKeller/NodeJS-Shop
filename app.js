const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const errorController = require('./controllers/error');
const app = express();

app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');


nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
});




const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(express.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);