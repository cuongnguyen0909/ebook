const { errorHandler, notFound } = require('../middlewares/errorHandler')
const authRouter = require('./authRoute');
const userRouter = require('./userRoute');
const bookRouter = require('./bookRoute');
const genreRouter = require('./genreRoute');
const authorRouter = require('./authorRoute');

const initialRoute = (app) => {
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/book', bookRouter);
    app.use('/api/v1/genre', genreRouter);
    app.use('/api/v1/author', authorRouter);
    app.use(notFound);
    app.use(errorHandler)
}

module.exports = initialRoute;