const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const getAllUser = asyncHandler(async (req, res) => {
    // Lấy các tham số truy vấn từ request
    const query = { ...req.query };
    // console.log(query, typeof (req.query));
    // Tách các trường đặc biệt ra khỏi truy vấn
    /**Trong một ứng dụng web, khi người dùng gửi các yêu cầu tìm kiếm hoặc lọc dữ liệu, 
     * có thể có các tham số hoặc trường không phải là một phần của dữ liệu thực tế mà họ muốn truy vấn.
    Việc loại bỏ các trường không mong muốn giúp đảm bảo rằng chỉ những trường hợp thích hợp 
    và an toàn được sử dụng trong truy vấn. */
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    // Loại bỏ các trường đặc biệt khỏi truy vấn
    excludedFields.forEach((item) => {
        delete query[item];
        // console.log(query);
    });
    //object->json->object hop le(thay the nhung cai toan tu nhu gte|gt thanh $gte|$gt)
    // Định dạng các toán tử để phù hợp với cú pháp của Mongoose
    let queryString = JSON.stringify(query); //object -> json
    // console.log(queryString, typeof queryString);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    // Chuyển đổi truy vấn đã định dạng thành đối tượng JSON
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
            //role is a enum [99,2002]: 99 is user role, 2002 is admin role
            { role: { $regex: req.query.query, $options: 'i' } },
        ]
    }

    // Tạo một lệnh truy vấn mà không thực hiện nó ngay lập tức
    let queryCommand = User.find(formattedQueries);
    // Thực hiện truy vấn bằng cách sử dụng await

    //Sorting
    if (req.query.sort) {
        // console.log('req.query.sort', req.query.sort);
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log('sortBy', sortBy);
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



module.exports = {
    getAllUser,
}