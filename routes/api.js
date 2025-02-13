/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const BookModel = require(process.cwd() + '/database/book-schema.js')

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      let books = await BookModel.find();
      res.json(books)
    })

    .post(async (req, res) => {
      let bookTitle = req.body.title;
      try {
        if(!bookTitle){
         return res.json('missing required field title');
        }
      let newBook = await BookModel.findOne({ title : bookTitle })
      
      if(!newBook){
        newBook = new BookModel({
          title: bookTitle,
          comments: [],
          commentcount: 0
        });
        await newBook.save();
      }
      res.json(newBook)  
      } catch (error){
        res.json({error: error.message})
      }    
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res)=>{
      BookModel.deleteMany({})
      res.json('complete delete successful')
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      
      if(!mongoose.Types.ObjectId.isValid(bookid)){
        return res.json('no book exists');
      }
      
      let book = await BookModel.findOne({ _id: bookid})
   
      if(!book){
        return res.json('no book exists');
      }

      res.json(book)
    })
    
    .post(async(req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if(!mongoose.Types.ObjectId.isValid(bookid)){
        return res.json('no book exists');
      }

      if(!comment){
        return res.json('missing required field comment')
      }

      let book = await BookModel.findOne({_id: bookid})
      if(!book){
        return res.json('no book exists');
      }
      ++book.commentcount
      book.comments.push(comment)
      await book.save()
      res.json(book)
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try{
        if(!mongoose.Types.ObjectId.isValid(bookid)){
          return res.json('no book exists');
        }
        
        if(!bookid){
          res.json({ error: 'missing _id' })
        }
        const deleteBook = await BookModel.findByIdAndDelete(bookid);
        
        if(!deleteBook){
         return res.json('no book exists')
        }
        res.json('delete successful')
      }catch(error){
        res.json('no book exists')
      }
    });
  
};
