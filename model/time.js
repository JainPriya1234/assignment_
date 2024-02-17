const mongoose = require("mongoose")

const timeSchema = new mongoose.Schema({
    instructorId:{
        type:mongoose.Types.ObjectId,
        ref:"instructor"
    },
    dayId:{
        type:mongoose.Types.ObjectId,
        ref:"dayTable"
    }, 
    //TODO : DATE VALIDATOR
    CheckIn:{
        type: String,
        default: null  
    },
    checkOut:{
        type: Date,
        default: null
    }
});

module.exports =  mongoose.model("time", timeSchema, "time");