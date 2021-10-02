const User = require('./../models/User');
const catchAsync = require('./../utils/CatchAsync');

exports.getAllUsers = catchAsync(async (req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
    status: 'success',
    results:users.length,
    data: {
        users
    },
    });
});

exports.createUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'route not implemented'
    });
}

exports.getSingleUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'route not implemented'
    });
}

exports.updateUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'route not implemented'
    });
}

exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status:'error',
        message:'route not implemented'
    });
}