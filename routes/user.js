const router=require("express").Router();

const Booking=require("../models/Booking");
const User=require("../models/User");
const Listing=require("../models/Listing");

//Get API For Trip List

router.get("/:userId/trips",async(req,res)=>{
    try{
        const {userId}=req.params; //To get userId from URL
        const trips=await Booking.find({customerId:userId}).populate("customerId hostId listingId"); //finding userId which is same as customerId from database and return that data from database.
        res.status(202).json(trips);

    }catch(err){    
        console.log(err);
        res.status(404).json({message:"Cannot Find Trips" ,error:err.message})
    }
})

//Add listing to Wishlist
router.patch("/:userId/:listingId", async (req, res) => {
    try {
      const { userId, listingId } = req.params;
      const user = await User.findById(userId);
      const listing = await Listing.findById(listingId).populate("creator");
  
      const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);
  
      if (favoriteListing) {
        user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
        await user.save();
        res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList });
      } else {
        user.wishList.push(listing);
        await user.save();
        res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList });
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ error: err.message });
    }
  });

  //Get PropertyList
  router.get("/:userId/properties",async(req,res)=>{
    try{
        const {userId}=req.params; //To get userId from URL
        const properties=await Listing.find({creator:userId}).populate("creator") 
        res.status(202).json(properties);

    }catch(err){    
        console.log(err);
        res.status(404).json({message:"Cannot Find Properties" ,error:err.message})
    }
})

//Get API for Reservation List

router.get("/:userId/reservations",async(req,res)=>{
  try{
      const {userId}=req.params; //To get userId from URL
      const reservations=await Booking.find({hostId:userId}).populate("customerId hostId listingId"); //finding userId which is same as customerId from database and return that data from database.
      res.status(202).json(reservations);

  }catch(err){    
      console.log(err);
      res.status(404).json({message:"Cannot Find Reservations" ,error:err.message})
  }
})

module.exports=router;
