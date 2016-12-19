const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PizzaModel = new Schema({
    name: String,
    description: String,
    cover: {type: String, default: '/images/dc.png'},
    smallprice: Number,
    middleprice: Number,
    highprice: Number,
});
const OrderModel = new Schema({
    id: String,
    size: String,
    price: String,
    adress: String,
    tel: String,
    dateOfcreation: {type: Date, default: Date.now}
});
const AdminModel = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String
});
const ComplainModel = new Schema({
    name: String,
    description: String,
    email: String,
    dateOfcreation: {type: Date, default: Date.now}
});

AdminModel.statics.findByEmail = (email, cb) => {
    return this.find({email: email}, cb);
};

const connection = mongoose.createConnection('mongodb://localhost:27017/awesomepizza');

const Pizza = connection.model('Pizza', PizzaModel),
      Admin = connection.model('Admin', AdminModel),
      Complain = connection.model('Complain', ComplainModel),
      Order = connection.model('Order', OrderModel)  ;
module.exports = {
    Pizza: Pizza,
    Admin: Admin,
    Complain: Complain,
    Order: Order
};