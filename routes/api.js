/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

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

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      res.json({})
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      res.json({})
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try{
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
