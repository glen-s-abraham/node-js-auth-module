const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please enter a valid username']
        },
        email:{
            type:String,
            required:[true,'Please enter a valid email id'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'Please enter a valid email format']
        },
        photo:String,
        password:{
            type:String,
            required:[true,'Please enter a password'],
            minlength:8,
            select: false 
        },
        passwordConfirm:{
            type:String,
            required:[true,'Please confirm your password'],
            validate:{
                //only works on create() and save()
                validator:function(el){
                    return el == this.password;
                },
                message:`passwords Doesn't match`
            }
        },
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.isCorrectPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User',userSchema);
module.exports = User;