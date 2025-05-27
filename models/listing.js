const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
  title: {
   type:String,
   required:true,
  },
  description: String,
  image :{
        filename: String,
   url:{
    type:String,
    default:
      "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/",
    set: (v) =>
      v === ""
        ? "https://pixabay.com/photos/coast-landscape-nature-ocean-sea-1867704/"
        : v,
    }
  },
  price: {
    type:Number,
    default:0
  },
  location: String,
  country: String,
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type:Schema.Types.ObjectId,
    ref:"User",
  }
});

listingSchema.pre("save", function (next) {
  if (this.image && this.image.url === "") {
    this.image.url = "https://unsplash.com/photos/a-palm-tree-on-a-beach-with-the-ocean-in-the-background-v0h_ZMZuc9Y";
  }
  next();
});

listingSchema.post("/findOneAndDelete",async(listing) => {
  if(listing) {
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

