import express from "express";
const router = express.Router();
import {Admin} from "../models/Model";

/* GET home page. */
router.get('/', function(req, res, next) {
  Admin.find({}, (err, user) => {
    //console.log(req.body.adminname);
    console.log(user);
  })
  Admin.create({
    name: "ADMIN",
    surname: "ADMIN",
    email: "ADMIN@gmail.com",
    password: "12345"})

  res.render("index");
});
router.get('/admin', function(req, res, next) {
    res.render("admin");
});
router.get('/contacts', function(req, res, next) {
    res.render("contacts");
});
router.get('/login',(req, res)=>{
  "use strict";
  if (req.session.user) {
    res.redirect("/profile");
  }
  else{
    res.render("admin");
  }
});
router.post('/login', (req, res) => {
  "use strict";
  Admin.findByEmail(req.body.adminname, (err, user) => {
    if (err) {
      res.redirect('/login');
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
})
  "use strict";

module.exports = router;
