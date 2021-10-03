const {promisify} = require('util');
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

exports.protect = catchAsync(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in',401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if(!user){
        return next(new AppError('The user for this token no longer exist',401));
    }
    if(user.isPasswordChanged(decoded.iat)){
        return next(new AppError('The user changed password recently relogin to continue',401)); 
    }
    req.user = user;
    next();
    
});