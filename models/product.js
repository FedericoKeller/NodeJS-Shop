const fs = require('fs');
const path = require('path');
const pathUtil = require('../util/path');
const Cart = require('./cart');
const p = path.join(pathUtil, 'data', 'products.json');


const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if(err) { 
           return cb([]);
        }
        cb(JSON.parse(fileContent));
    })
}

module.exports =  class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if(this.id) {
                const existingProductIndex =products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });

            } else {
                this.id = Math.random().toString();
                products.push(this);    
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }

        });
    }

    static deleteById(id) {
    
        getProductsFromFile(products => {
            const productIndex = products.findIndex(prod => prod.id == id);
            let updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if(!err) {
                    Cart.deleteProduct(id, products[productIndex].price);

                }
            });
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(product => product.id == id);
            cb(product);
        
        })
    }
}