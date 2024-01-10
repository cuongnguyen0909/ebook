const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const getUSers = asyncHandler(async (req, res) => {
    // Lấy các tham số truy vấn từ request
    const query = { ...req.query };
    // console.log(query, typeof (req.query));

    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    // Loại bỏ các trường đặc biệt khỏi truy vấn
    excludedFields.forEach((item) => {
        delete query[item];
        // console.log(query);
    });
    let queryString = JSON.stringify(query); //object -> json
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    let formattedQueries = JSON.parse(queryString); //json->object

    // Filtering
    if (query?.name) {
        formattedQueries.name = { $regex: query.name, $options: 'i' };
    }
    if (req.query.query) {
        delete formattedQueries.query;
        formattedQueries['$or'] = [
            { name: { $regex: req.query.query, $options: 'i' } },
            { email: { $regex: req.query.query, $options: 'i' } },
            { role: { $regex: req.query.query, $options: 'i' } },
        ]
    }

    let queryCommand = User.find(formattedQueries);

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    //Filter limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    //pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    const response = await queryCommand.exec();
    // console.log(response);
    // Đếm số lượng tài liệu thỏa mãn truy vấn
    const total = await User.countDocuments(formattedQueries);
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        // results: response.length,
        users: response ? response : 'Can not get all user',
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select('-password')
    return res.status(200).json({
        status: user ? true : false,
        message: user ? 'Get current user successfully' : 'Can not get current user',
        user: user,
    });
});



module.exports = {
    getUSers,
    getCurrentUser
}