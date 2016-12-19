import express from "express";
import os from "os";
import fs from "fs";
import path from "path";
import multer from "multer";
import pug from "pug";
import async from "async";
import underscore from "underscore";
import mongoose from "mongoose";
const router = express.Router();

const upload = multer({dest: os.tmpdir()})
import {Pizza,Order, Complain, Admin} from "../models/Model";

/* GET home page. */
router.get('/', function(req, res, next) {
    Pizza.find({},(err, pizza)=>{
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{pizza:pizza})
        }
    })
});
router.get('/contacts', function(req, res, next) {
    res.render("contacts");
});
router.get('/login',(req, res)=>{
  "use strict";
  if (req.session.user) {
    res.redirect("/adminpage");
  }
  else{
    res.render("login");
  }
});
router.get('/logout', (req, res) => {
    "use strict";
    // req.logout();
    delete req.session.user;
    req.session.save((err) => {
        if (err) {
            console.error(err);
            res.redirect('/');
        }
        else {
            res.redirect("/");
        }
    });
});
router.get('/adminpage', (req, res) => {
    "use strict";
    if(req.session.user){
        Pizza.find({},(err, pizza) =>{
            if(err){
                res.status(500);
            }
            else{
                Complain.find({},(err, complain) =>{
                    if(err){
                        res.status(500);
                    }
                    else{
                        res.render("adminpage", {pizza : pizza, complain: complain});
                    }
                })

            }
        })
    }
    else {
      res.render("login");
    }

});
router.post('/login', (req, res) => {
    "use strict";
    Admin.findByEmail(req.body.username, (err, user) => {
        if (err) {
            res.redirect('/admin');
        }
        else {
            req.session.user = user;
            req.session.save((err) => {
                if (err) {
                    console.error(err);
                    res.redirect('/admin');
                }
                else {
                    res.redirect("/");
                }
            });
        }
    })
});
router.post('/personalarea', (req, res) => {
    res.render("personalarea")
});
router.post('/createPizza', upload.single('file'), (req, res, next) => {
    "use strict";
    if (req.file) {
        if (req.file.size > 8388608) next("Размер фотографии слишком большой (8мб максимум)");
        const newFileName = Date.now() + req.file.originalname;
        fs.readFile(req.file.path, (err, content) => {
            if (err) {
                next(err);
            }
            else {
                fs.writeFile(path.join(__dirname, '../public/images/pizzas/') + newFileName, content, (err) => {
                    if (err) {
                        next(err);
                    }
                    else {
                        Pizza.create({
                            name: req.body.name,
                            description: req.body.description,
                            cover: 'images/pizzas/' + newFileName,
                            smallprice: req.body.smallPrice,
                            middleprice: req.body.middlePrice,
                            highprice: req.body.highPrice
                        }, (err, pizza) => {
                            if (err) {
                                next(err);
                            }
                            else{
                                let template = pug.renderFile(path.join(__dirname, '../models/PizzaCard.pug'), {pizza: pizza});
                                res.status(200).json({html:template});
                            }
                        })
                    }
                })
            }
        })
    }
    else {
        Pizza.create({
            name: req.body.name,
            description: req.body.description,
            cover: 'images/dc.png',
            price: req.body.price
        }, (err,pizza) => {
            if (err) {
                next(err);
            }else{
                let template = pug.renderFile(path.join(__dirname, '../models/PizzaCard.pug'), {pizza: pizza});
                res.status(200).json({html:template});
            }
        })
    }
});
router.post('/removePizza', (req, res) => {
    "use strict";
    if (!req.body.id) res.sendStatus(400);
    Pizza.findById(req.body.id,(err, doc) => {
        if (doc.cover == 'images/dc.png') {
            doc.remove({_id: req.body.id},(err) => {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.sendStatus(200)

                    }
                });
        }
        else {
            fs.unlink(path.join(__dirname, '../public/') + doc.cover, (err) => {
                Pizza.remove({_id: req.body.id},(err) => {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else {
                        res.sendStatus(200);
                    }
                })
            });
        }
    });
});
/*router.post('/giveInput', (req, res) => {
   "use strict"
    Pizza.findById(req.body.id,(err, pizza) =>{
        let template = pug.renderFile(path.join(__dirname, '../models/PizzaInput.pug'), {pizza: pizza});
        res.status(200).json({html:template});
    })
});*/
router.post('/changePizza', (req, res) => {
    console.log(req.body);
    Pizza.findByIdAndUpdate(req.body.id,{
            $set: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            }
        },
        {new: true},
        function (err) {
            if (err) {
                res.sendStatus(500);
            }
            else{
                res.sendStatus(200);
            }
    })
});
router.post('/complain', (req, res, next) => {
    "use strict"
    Complain.create({
        name: req.body.name,
        email: req.body.author,
        description: req.body.description
    },(err, pizza) => {
        if (err) {
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    })
});
router.post('/removeComplain', (req, res) =>{
    "use strict";
    Complain.findById(req.body.id,(err, doc) => {
            doc.remove({_id: req.body.id},(err) => {
                if (err) {
                    res.sendStatus(500);
                }
                else {
                    res.sendStatus(200)

                }
            });

    });
});
router.post('/orderPizza', (req, res) => {
    "use strict"
    console.log(req.body);
    Order.create({
        name: req.body.name,
        size: req.body.author,
        price: req.body.description,
        adress: req.body.adress,
        tel: req.body.tel
    },(err, pizza) => {
        if (err) {
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    })
});
module.exports = router;
