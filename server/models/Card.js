const {Schema, model, ObjectId} = require('mongoose');

const Card = new Schema({
    name:{type:String, unique:true, required:true},
    descriptions:{type: [String], unique:false, required:true},
    tags:{type:[String], unique:false, required:false},
    date:{type:Number, unique:false, required:true},
    user:{type:ObjectId, required:true, ref:'User'}
})

module.exports = model("Card", Card)