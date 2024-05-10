const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail')
const makeToken = require('uniqid');


const register = asyncHandler(async (req, res) => {
    const { email, password, name, phone } = req.body;
    console.log(req.body)
    if (!email) {
        return res.status(400).json({
            status: false,
            message: 'Email is required!',
        });
    }
    if (!password) {
        return res.status(400).json({
            status: false,
            message: 'Password is required!',
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            status: false,
            message: 'Password must be at least 6 characters!',
        });
    }
    if (!name) {
        return res.status(400).json({
            status: false,
            message: 'Name is required!',
        });
    }
    if (!phone) {
        return res.status(400).json({
            status: false,
            message: 'Phone number is required!',
        });
    }
    if (phone.length !== 10) {
        return res.status(400).json({
            status: false,
            message: 'Phone number must be 10',
        });
    }

    const user = await User.findOne({ email }); //{email: email}
    if (user) throw new Error(`Email ${user.email} already existed!`);
    else {
        const token = makeToken();
        const editedEmail = btoa(email) + '@' + token;
        const newUser = await User.create({
            email: editedEmail,
            password,
            name,
            phone,
        })
        if (newUser) {
            const html = `<h2>Register Code: </h2><br/><blockquote>${token}</blockquote>`;
            await sendMail({ email, html, subject: 'Confirm register account in Book Wanderer' });
        }
        setTimeout(async () => {
            await User.deleteOne({ email: editedEmail });
        }, [5 * 60 * 1000]);
        return res.json({
            status: newUser ? true : false,
            message: newUser ? 'Please check your email to complete registration.' : 'Something went wrong. Please check again.',
        })
    }
})

const finalRegister = asyncHandler(async (req, res) => {
    const { token } = req.params;
    //compare token with email
    const notActiveEmail = await User.findOne({ email: { $regex: new RegExp(`${token}$`) } });
    if (notActiveEmail) {
        notActiveEmail.email = atob(notActiveEmail?.email?.split('@')[0]);
        notActiveEmail.save();
    }
    return res.json({
        status: notActiveEmail ? true : false,
        response: notActiveEmail ? 'Register successfully. Please Login' : 'Something went wrong. Please check again.',
    })
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body)
    // if (!email) {
    //     res.status(400).json({
    //         status: false,
    //         message: 'Email is required',
    //     })
    // }
    // if (!password) {
    //     res.status(400).json({
    //         status: false,
    //         message: 'Password is required',
    //     })
    // }
    //repsonse se la mot instance cua mongo chu khong phai la mot object thuan(plain object)
    const user = await User.findOne({ email });
    const role = user.role;
    // console.log(response.isCorrectPassword(password));//Promise { <pending> }
    if (user.status !== 'active') {
        return res.status(400).json({
            status: false,
            message: 'Your account is not active. Please contract admin to active your account',
        })
    }
    if (user && (await user.isCorrectPassword(password))) {
        //su dung destructoring de remove passord va role khoi nguoi dung
        const { password, role, ...userData } = user.toObject();
        const accessToken = generateAccessToken(user._id, role);
        return res.status(200).json({
            status: true,
            accessToken,
            userData,
            role
        });
    } else {
        throw new Error('User not found or password not matched');
    }
});


module.exports = {
    register,
    finalRegister,
    login,
}