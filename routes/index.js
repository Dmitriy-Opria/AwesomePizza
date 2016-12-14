import express from "express";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("admin");
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
  Admin.findByEmail(req.body.username, (err, user) => {
    if (err) {
      res.redirect('/login');
    }
    else {
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.error(err);
          res.redirect('/login');
        }
        else {
          res.redirect("/personalarea");
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
