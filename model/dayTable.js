const mongoose = require("mongoose");
const moment = require("moment-timezone");

const dayTableSchema = new mongoose.Schema({
    instructorId:{
        type: mongoose.Types.ObjectId,
        ref: "instructor"
    },
    date:{
        type: Date,
        default: () => moment.utc().tz("Asia/Kolkata").format('YYYY-MM-DD')
        // This will set the default date to the current date in Indian Standard Time (IST)
    },
    totalTime:{
        type: Number,
        default:0
    }
});

module.exports = mongoose.model("dayTable", dayTableSchema, "dayTable");
