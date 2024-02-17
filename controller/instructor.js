const DayTable = require('../model/dayTable')
const Time = require('../model/time')
const Instructor = require('../model/instructor')
const { createCustomError } = require('../errors/customAPIError');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const moment = require("moment-timezone");

const checkIn = async (req, res,next) => {
    try {
        const instructorId = req.instructor.id

        // Marking Present
        const dayTable= await DayTable.findOneAndUpdate({
            instructorId : instructorId
        },{},{upsert:true, new: true})
        console.log(dayTable);

        //check checkIN Time
        const isCheckIn= await Time.findOne({
            dayId: dayTable._id,
        })
        if(isCheckIn){
            const message= `Already Checked-In, Please CheckOut first!`;
            return next(createCustomError(message, 400));
        }

        // Adding check-in time
        await Time.create({
            dayId: dayTable._id,
            checkIn: moment.utc().tz("Asia/Kolkata").format('HH:mm:ss')
        });
        const response= 'Check-in recorded successfully';
        res.status(200).json(sendSuccessApiResponse(response));
    } catch (err) {
        console.error(err);
        return createCustomError(err,400)
    }
};


function calculateTotalTime(checkIn, checkOut) {
    const checkInTime = moment(checkIn, 'HH:mm:ss');
    const checkOutTime = moment(checkOut, 'HH:mm:ss');
    const duration = moment.duration(checkOutTime.diff(checkInTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const totalTime = hours*60 + minutes;
    return totalTime;
};

const checkOut = async(req,res,next)=>{
    try{
        const instructorId = req.instructor.id
        const dayTable = await DayTable.findOne({instructorId:instructorId})

        // Check CheckIn Time
        const isCheckIn = await Time.findOne({dayId:dayTable._id})  
        if(!isCheckIn){
            const message= `Not Checked-In, Please CheckIn first!`;
            return next(createCustomError(message, 400));
        }
        if(isCheckIn.checkOut){
            const message= `Already Checked-Out, Please CheckIn Again!`;
            return next(createCustomError(message, 400));
        }
        
        // Adding Checkout Time
        const checkOut = moment.utc().tz("Asia/Kolkata").format('HH:mm:ss');


        // calculating Total Time Spend and Adding to dayTime
        const totalTime = calculateTotalTime(isCheckIn.checkIn, checkOut);
        dayTable.totalTime += totalTime;
        await dayTable.save();

        // Removing Time data
        await isCheckIn.deleteOne();
        const response= 'Check-Out successfully';
        res.status(200).json(sendSuccessApiResponse(response));
    }
    catch(err){
        return createCustomError(err,400);
    }
}


const genMonthlyReport = async(req,res,next)=>{
    try{
        const year = req.params.year;
        const month = req.params.month;
        
        const startDate = moment.utc().year(year).month(month - 1).startOf('month').format();
        const endDate = moment.utc().year(year).month(month - 1).endOf('month').format();

        const result = await DayTable.aggregate([
            {
                $match:{
                    date:{
                        "$gte":new Date(startDate),
                        "$lt":new Date(endDate)
                    }
                }
            },
            {
                $group:{
                    _id:"$instructorId",
                    totalMinutes:{$sum:"$totalTime"}
                }
            }
        ])
        res.status(200).json(sendSuccessApiResponse(result));
    }
    catch(err){
        return createCustomError(err,400);
    }
}


module.exports = {checkIn, checkOut, genMonthlyReport}