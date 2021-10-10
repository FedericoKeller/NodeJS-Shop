const path = require('path');
const express = require('express');

const nunjucks = require('nunjucks');
const setUpNunjucks = require('./helpers/nunjuck_helpers');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');



const app = express();

app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');

setUpNunjucks(app);


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(express.urlencoded({extended: false})); 
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});

User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// sequelize.sync({ force: true })
sequelize.sync()
.then(result => { 
    return User.findByPk(1);
})
.then(user => {
    if(!user)  {
        return User.create({
            name: 'Federico',
            email: 'test@test.com',
        })
    }
   return user;
})
.then(user => {
    return Promise.resolve([user, user.getCart()]);
})
.then(([user,cart]) => {
    cart.then(cartCreated => {
        if (!cartCreated) {
            return user.createCart();
        }
    })
})
.then(cart => {
    app.listen(3000);

})
.catch(err => console.log(err));

