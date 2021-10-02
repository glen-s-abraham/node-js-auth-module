const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/AppError');
const userRouter = require('./routes/UserRoutes');
const handler = require('./controllers/ErrorController');
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/users',userRouter);
//error handler for unhandled routes
app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`,404));
});

app.use(handler);

module.exports = app;
