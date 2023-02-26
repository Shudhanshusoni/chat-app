const AsyncHandler = require("express-async-handler");
const User=require('../schema/userSchema')
const generateToken=require('../config/generateToken')

const registerUser=AsyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error('please Enter All Fields');
    }

    const userExists=await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('Email Already exists')
    }
    const user= await User.create({
        name,email,password,pic
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error('failed try again')
    }
}) 

const authUser=AsyncHandler( async(req,res)=>{
   const {email,password}=req.body;

   const user=await User.findOne({email});
   if(user && (await user.matchPassword(password))){
    res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),
    });
   }
   else{
    res.status(401);
    throw new Error("invalid credentials");
    
   }
})

const allUsers=AsyncHandler(async(req,res)=>{
const keyword=req.query.search?{
    $or:[
        {
            name:{$regex:req.query.search,$options:'i'}
        },
        {
            email:{$regex:req.query.search,$options:'i'}
        }
    ]
    
}:{}; 

const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
res.send(users);
})

module.exports={registerUser, authUser,allUsers}