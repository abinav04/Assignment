import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: {type: String},
  company: {type:String},
  address:{
    city: {type:String},
    zipcode: {type:String},
    geo:{
        lat:{type:String},
        lng:{type:String}
    }
  }
},{timestamps:true});

export default mongoose.model("User",UserSchema);
