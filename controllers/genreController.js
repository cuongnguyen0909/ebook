const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');

const createGenre = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new Error('Missing required fields')
    }
    console.log(req.file)

    // i want path thum is backend\uploads\images\1619792020000-1.jpg
    const thumb = req.file.path;

    if (thumb) {
        req.body.thumb = thumb;
    }
    console.log(thumb)

    const genre = await Genre.create({ ...req.body, thumb });
    res.status(201).json({
        status: genre ? true : false,
        message: genre ? 'Genre created successfully' : 'Genre not created',
        data: genre
    })
})

const getAllGenres = asyncHandler(async (req, res) => {
    const genres = await Genre.find({});
    res.status(200).json({
        status: genres ? true : false,
        message: genres ? 'Get all genres successfully' : 'Get all genres failed',
        data: genres
    })
})

const updateGenre = asyncHandler(async (req, res) => {
    const { gid } = req.params;
    const thumb = req.file.path;
    if (thumb) {
        req.body.thumb = thumb;
    }
    console.log({ ...req.body })
    const genre = await Genre.findByIdAndUpdate(gid, { ...req.body }, { new: true });
    res.status(200).json({
        status: genre ? true : false,
        message: genre ? 'Genre updated successfully' : 'Genre not updated',
        data: genre
    })
})

const deleteGenre = asyncHandler(async (req, res) => {
    const { gid } = req.params;
    const genre = await Genre.findByIdAndDelete(gid);
    res.status(200).json({
        status: genre ? true : false,
        message: genre ? 'Genre deleted successfully' : 'Genre not deleted',
        data: genre
    })
})

module.exports = {
    createGenre, getAllGenres, updateGenre, deleteGenre
}