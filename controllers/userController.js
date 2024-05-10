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

    let queryCommand = User.find(formattedQueries).populate('wishlist', 'title thumb description author genre');

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

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    const user = await User.findById(_id).populate('wishlist', 'title');
    const alreadyProduct = user.wishlist?.find((item) => item.toString() === bid);
    if (alreadyProduct) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: bid } },
            { new: true }
        )
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your wishlist successfully' : 'Can not update wishlist',
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: bid } },
            { new: true }
        )
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your wishlist successfully' : 'Can not update wishlist',
        });
    }
})

const updateCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { name, phone } = req.body;
    if (req.file) {
        req.body.avatar = req.file.filename;
    }
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing Input');
    const user = await User.findByIdAndUpdate(_id,
        {
            name, phone, avatar: req.body.avatar
        }, { new: true, }).select('-password -role');
    return res.status(200).json({
        status: res ? true : false,
        message: res ? 'Updated information successfully' : 'Can not update profile!',
        user: user,
    });
})
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { role, status } = req.body;
    if (Object.keys(req.body).length === 0) throw new Error('Missing Input');
    const user = await User.findByIdAndUpdate(uid,
        {
            role, status
        }, {
        new: true,
    }).select('-password');
    return res.status(200).json({
        status: user ? true : false,
        updatedUser: user ? 'Updated user successfully' : 'Can not update user!',
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password, newPassword, reNewPassword } = req.body;
    console.log(password, newPassword, reNewPassword)
    if (!password) {
        return res.status(400).json({
            status: false,
            message: 'Password is required',
        });
    }
    if (!newPassword) {
        return res.status(400).json({
            status: false,
            message: 'New password is required',
        });
    }
    if (!reNewPassword) {
        return res.status(400).json({
            status: false,
            message: 'Confirm new password is required',
        });
    }

    const user = await User.findOne({ _id });
    // console.log(user)
    if (!user) {
        return res.status(400).json({
            status: false,
            message: 'User not found',
        });
    }

    if (!await user.isCorrectPassword(password)) {
        return res.status(400).json({
            status: false,
            message: 'Password not matched',
        });
    }

    if (newPassword !== reNewPassword) {
        return res.status(400).json({
            status: false,
            message: 'Password not matched',
        });
    }

    if (password === newPassword) {
        return res.status(400).json({
            status: false,
            message: 'New password must be different from old password',
        });
    }
    user.password = newPassword;
    await user.save()
    return res.status(200).json({
        status: user ? true : false,
        message: user ? 'Change password successfully' : 'Something went wrong. Please check again.',
    });
})
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const user = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        status: user ? true : false,
        message: user ? 'Deleted user successfully' : 'Can not delete user!',
    });
})

module.exports = {
    getUSers,
    getCurrentUser,
    addToWishlist,
    updateCurrentUser,
    changePassword,
    updateUserByAdmin,
    deleteUser
}