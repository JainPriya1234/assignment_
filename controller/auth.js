const { createCustomError } = require('../errors/customAPIError');
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const Instructor = require('../model/instructor');
const jwt = require('jsonwebtoken')


const login = async(req,res,next) =>{
   try{
    const {instructorName} = req.body;
    const instructor = await Instructor.findOne({instructorName});
    if (!instructor) {
        const message = "Instructor not found";
        return next(createCustomError(message, 404));
    }

    // creating  JWT Token 
    const token = instructor.generateJWT();

    res.status(200).json(sendSuccessApiResponse({ "token": token }));
   }
   catch(err){
        return createCustomError(err, 400);
   }
}

const signUp = async(req,res,next)=>{
    try{
        const {instructorName} = req.body;
        await Instructor.create({
            instructorName: instructorName
        })
        res.status(200).json(sendSuccessApiResponse("instructor created successfully "));
    }
    catch(err){
        return createCustomError(err, 400);
    }
}


module.exports = {login,signUp}