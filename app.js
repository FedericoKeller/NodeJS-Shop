const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();


nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
});

app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');



const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(express.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')))
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req,res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
})

app.listen(3000);