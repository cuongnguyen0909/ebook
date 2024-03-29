const Genre = require('../models/genre');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const createGenre = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new Error('Missing required fields')
    }
    console.log(req.file)

    if (req.file) {
        req.body.thumb = req.file.filename;
    }
    const genre = await Genre.create(req.body);
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
    let thumb = '';

    if (req.file) {
        thumb = req.file.filename;
    }
    const genre = await Genre.findByIdAndUpdate(gid, { ...req.body, thumb }, { new: true });
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

const getGenreById = asyncHandler(async (req, res) => {
    const { gid } = req.params;
    const genre = await Genre.findById(gid);
    res.status(200).json({
        status: genre ? true : false,
        message: genre ? 'Get genre by id successfully' : 'Get genre by id failed',
        data: genre
    })
})

module.exports = {
    createGenre, getAllGenres, updateGenre, deleteGenre,
    getGenreById
}