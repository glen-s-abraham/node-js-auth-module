const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../models/User');
const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/CatchAsync');

const signToken = id =>{
    return jwt.sign(
        {id:id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_TTL
        }
    );
}
exports.signup = catchAsync(async(req,res,next)=>{
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status:'success',
        token:token,
        data:{
            user:newUser
        }
    });
});

exports.login = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new AppError('please enter an email and password',400));
    }
    const user = await User.findOne({email}).select('+password');
    if(!user || !await user.isCorrectPassword(password,user.password)){
        return next(new AppError('invalid email and password',401));
    }
    const token = signToken(user._id);
    res.status(200).json({
        status:'Success',
        token:token
    });
});