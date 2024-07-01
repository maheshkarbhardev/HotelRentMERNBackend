const express = require("express");
const router = express.Router();

const Booking=require("../models/Booking"); //Imported Booking Schema

//Creating Booking API

router.post("/create",async(req,res) =>{
    try{
        const {customerId,hostId,listingId,startDate,endDate,totalPrice}=req.body; //We get this data from user;

        const newBooking=new Booking({customerId,hostId,listingId,startDate,endDate,totalPrice})
        await newBooking.save(); //Booking data will save into the database
        res.status(200).json(newBooking) //successfully status updated.
    }catch (err){
        console.log(err);
        res.status(400).json({message:"Fail To Create New Booking",error:err.message})
    }
})

module.exports=router;

