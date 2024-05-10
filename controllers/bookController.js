const Book = require('../models/book');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');


const createBook = asyncHandler(async (req, res) => {
    const { title, genre, author, description,
        publication_date, totalPage } = req.body;
    console.log(req?.files)
    const thumb = req.files?.thumb[0].filename;
    const fileReader = req.files?.fileReader[0].filename;
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error('No files were uploaded');
    }
    if (thumb) {
        req.body.thumb = thumb;
    }
    if (fileReader) {
        req.body.fileReader = fileReader;
    }

    if (!(title || genre || author || description || publication_date || totalPage)) {
        throw new Error('Missing required fields')
    }

    req.body.slug = slugify(title);

    const book = await Book.create(req.body);
    return res.status(201).json({
        status: book ? true : false,
        message: book ? 'Book created successfully' : 'Book not created',
        data: book
    })

})

const getBooks = asyncHandler(async (req, res) => {
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
    if (query?.title) {
        formattedQueries.title = { $regex: query.title, $options: 'i' };
    }
    if (query?.author) {
        formattedQueries.author = { $regex: query.author, $options: 'i' };
    }
    if (query?.genre) {
        formattedQueries.genre = { $regex: query.genre, $options: 'i' };
    }
    if (req.query.query) {
        delete formattedQueries.query;
        const regexQuery = { $regex: req.query.query, $options: 'i' };
        formattedQueries['$or'] = [
            { title: regexQuery },
            { genre: regexQuery },
            { author: regexQuery },
        ];
    }

    let queryCommand = Book.find(formattedQueries).populate('ratings.ratingBy', 'name avatar updatedAt');

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
    const total = await Book.countDocuments(formattedQueries);
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        results: response.length,
        books: response ? response : 'Can not get books',
    });
})

const getOneBook = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const book = await Book.findByIdAndUpdate(bid,
        {
            $inc: { totalView: 1 }
        },
        {
            new: true,
        }).populate('ratings.ratingBy', 'name avatar updatedAt');
    // console.log(product?.ratings?.postedBy);
    return res.status(200).json({
        status: book ? true : false,
        message: book ? 'Get book successfully' : 'Can not get this book',
        book: book,
        rs: book?.ratings?.ratingBy,
    });
})



const updateBook = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const { title } = req.body;
    // Lấy thông tin ảnh từ req.files
    console.log(req.files)
    // Lưu trữ file EPUB trên máy chủ hoặc sử dụng dịch vụ lưu trữ khác
    if (req.files?.thumb) {
        req.body.thumb = req.files?.thumb[0].filename;
    }
    if (req.files?.fileReader) {
        req.body.fileReader = req.files?.fileReader[0].filename;
    }
    if (req.body.title) {
        req.body.slug = slugify(title);
    }
    // req.body.slug = slugify(title);

    const updatedBook = await Book.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    return res.status(200).json({
        status: updatedBook ? true : false,
        message: updatedBook ? 'Update product successfully' : 'Can not update product',
        updatedBook: updatedBook,
    });
})

const deleteBook = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bid);
    return res.status(200).json({
        status: deletedBook ? true : false,
        message: deletedBook ? 'Delete product successfully' : 'Can not delete product',
        deletedBook: deletedBook,
    });
})

const ratingBook = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, bid, updatedAt } = req.body;
    if (!star || !bid) {
        throw new Error('Missing input');
    }
    const ratingBook = await Book.findById(bid);
    const alreadyRating = ratingBook?.ratings?.find((item) => item?.ratingBy.toString() === _id);
    // console.log({ alreadyRating });
    if (alreadyRating) {
        //update lai star va comment
        await Book.updateOne(
            { ratings: { $elemMatch: alreadyRating } },
            { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, 'ratings.$.updatedAt': updatedAt } },
            { new: true },
        );
    } else {
        //add new start and comment
        await Book.findByIdAndUpdate(bid, { $push: { ratings: { star, comment, ratingBy: _id, updatedAt } } }, { new: true });
        // console.log({ response });
    }
    //sum ratings
    const updatedBook = await Book.findById(bid);
    const ratingCount = updatedBook?.ratings?.length;
    const sumRatings = updatedBook?.ratings?.reduce((sum, item) => {
        return sum + +item.star;
    }, 0);
    updatedBook.totalRating = (sumRatings / ratingCount).toFixed(1);
    await updatedBook.save();
    return res.status(200).json({
        status: true,
        message: 'Rating successfully',
        updatedBook,
    });
})

module.exports = {
    createBook, getBooks, getOneBook, updateBook, deleteBook, ratingBook
}