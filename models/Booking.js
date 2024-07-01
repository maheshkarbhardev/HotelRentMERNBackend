const mongoose=require("mongoose");

const BookingSchema=new mongoose.Schema(
    {
         customerId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"                            //Taking reference from User schema
         },
         hostId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
         },
         listingId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Listing"                          //Taking reference from Listing schema
         },
         startDate:{
            type:String,
            required:true,
         },
         endDate:{
            type:String,
            required:true,
         },
         totalPrice:{
            type:Number,
            required:true
         }
    },
    {timestamps:true}
);

const Booking=mongoose.model("Booking",BookingSchema);
module.exports=Booking;