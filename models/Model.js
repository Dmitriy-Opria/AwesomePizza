/**
 * Created by user4 on 14.12.16.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminModel = new Schema({
    name: String,
    surname: String,
    avatar: {type: String, default: '/images/avatars/no-avatar_jpg.jpg'},
    email: String,
    tel: String,
    skype: String,
    password: String
});

const PizzaModel = new Schema({
    name: String,
    description: String,
    images: {type: Array, default: []},
    price: Number
});

const connection = mongoose.createConnection('mongodb://localhost:27017/awesomepizza');
const Admin = connection.model('Admin', AdminModel),
      Pizza = connection.model('Pizza', PizzaModel);

module.exports = {
    Admin: Admin,
    Pizza: Pizza
};