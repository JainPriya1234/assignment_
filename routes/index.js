const express = require("express");
const router = express.Router();
const {login,signUp} = require('../controller/auth');
const {checkIn,checkOut,genMonthlyReport}=require('../controller/instructor');
const { authorization } = require("../middleware/authorization");
//const { validateDateTimeMiddleware } = require('../middleware/validateDateTimeMiddleware');

router.get("/", (req, res) => {
    res.send("API  is running!!!");
});
 
//auth routes
router.post("/login",login)
router.post("/signup",signUp)

//instructor routes
router.post("/instructor/checkin",authorization,checkIn)
router.post("/instructor/checkout",authorization,checkOut)
router.post("/instructor/report/:year/:month",genMonthlyReport)



module.exports = router;

