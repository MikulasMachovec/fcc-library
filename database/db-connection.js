const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookModel = require(process.cwd() + '/database/book-schema.js');


module.exports = function (app) {
    (async () => {
        try {
            if (!process.env.DB) throw new Error("Database URL (DB) is missing in environment variables.");

            await mongoose.connect(process.env.DB);
            console.log('Database connected successfully');
            
            app.locals.BookModel = BookModel;
        
        } catch (error) {
            console.error( error.message );
        }
    })();
};
