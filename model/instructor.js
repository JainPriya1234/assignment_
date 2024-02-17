const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const instructorSchema = new mongoose.Schema({
    instructorName:{
        type: String,
        unique:[true,'Username Already Exist'],
        required:[true,'Username is required']
    }
},
{
    methods:{
        generateJWT(){
            return jwt.sign({ instructorId: this._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
            });         
        }
    }
});

module.exports =  mongoose.model("instructor", instructorSchema, "instructor");