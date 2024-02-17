const express = require("express");
const router = express.Router();
const {login,signUp} = require('../controller/auth');
const {checkIn}=require('../controller/instructor');
//const { validateDateTimeMiddleware } = require('../middleware/validateDateTimeMiddleware');

router.get("/", (req, res) => {
    res.send("API  is running!!!");
});
 
//auth routes
router.post("/login",login)
router.post("/signup",signUp)

//instructor routes
router.post("/instructor/checkin",checkIn)
//router.post("/instructor/checkout",instructor.checkOut)


module.exports = router;
