const DayTable = require('../model/dayTable')
const Time = require('../model/time')
const Instructor = require('../model/instructor')
const { createCustomError } = require('../errors/customAPIError');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');

const checkIn = async (req, res,next) => {
    try {
        const {instructorId,checkInTime, date} = req.body;

        // Find instructor by ID
        const instructor = await Instructor.findById(instructorId);
        if (!instructor) {
            const message= "instructor not found";
            return next(createCustomError(message, 400));
        }

        const dayTable= await DayTable.findOneAndUpdate({
            instructorId : instructorId
        },{},{upsert:true, new: true})
        console.log(dayTable);
        //check checkIN
        const isCheckIn= await Time.findOne({
            dayId: dayTable._id
        })
        if(isCheckIn){
            const message= `Already Checked-In, Please CheckOut first !`;
            return next(createCustomError(message, 400));
        }
        // Add check-in time
        await Time.create({
            dayId: dayTable._id
        });
        const response= 'Check-in recorded successfully';
        res.status(200).json(sendSuccessApiResponse(response));
    } catch (err) {
        console.error(err);
        return createCustomError(err,400)
    }
};



module.exports = {checkIn}