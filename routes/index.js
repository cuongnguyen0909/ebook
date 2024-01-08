const { errorHandler, notFound } = require('../middlewares/errorHandler')
const authRouter = require('./authRoute');
const userRouter = require('./userRoute');


const initialRoute = (app) => {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
    app.use(notFound);
    app.use(errorHandler)
}

module.exports = initialRoute;