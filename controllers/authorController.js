const Author = require('../models/author');
const asyncHandler = require('express-async-handler');

const createAuthor = asyncHandler(async (req, res) => {
    const { name, date_of_birth, description } = req.body;
    if (!title || !date_of_birth) {
        throw new Error('Missing required fields')
    }

    const author = await Author.create({ ...req.body });
    res.status(201).json({
        success: author ? true : false,
        message: author ? 'Author created successfully' : 'Author not created',
        data: author
    })
})

const getAllAuthors = asyncHandler(async (req, res) => {
    const genres = await Author.find({});
    res.status(200).json({
        success: genres ? true : false,
        message: genres ? 'Get all authors successfully' : 'Get all authors failed',
        data: genres
    })
})

const updateAuthor = asyncHandler(async (req, res) => {
    const { aid } = req.params;
    const author = await Author.findByIdAndUpdate(gid, { ...req.body }, { new: true });
    res.status(200).json({
        success: author ? true : false,
        message: author ? 'Author updated successfully' : 'Author not updated',
        data: author
    })
})

const deleteAuthor = asyncHandler(async (req, res) => {
    const { aid } = req.params;
    const author = await Author.findByIdAndDelete(aid);
    res.status(200).json({
        success: author ? true : false,
        message: author ? 'Author deleted successfully' : 'Author not deleted',
        data: author
    })
})

module.exports = {
    createAuthor, getAllAuthors, updateAuthor, deleteAuthor
}