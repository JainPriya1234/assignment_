const mongoose = require("mongoose")
const moment = require("moment-timezone");

const timeSchema = new mongoose.Schema({
    dayId:{
        type:mongoose.Types.ObjectId,
        ref:"dayTable"
    }, 
    checkIn:{
        type: String,
        required :[true,"Plase Give Check-In Time"]
    },
    checkOut:{
        type: String,
    }
});

module.exports =  mongoose.model("time", timeSchema, "time");