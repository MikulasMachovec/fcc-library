/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'POST test title'
          })
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title')
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.deepEqual(res.body,'missing required field title')
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isAtLeast(res.body.length,1)
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
     
      before((done) => {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Get book by id',
            commentcount: 0,
            comments: [],
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            test_ID = res.body._id; 
            done();
          });
      });
      
      test('Test GET /api/books/[id] with id not in db', (done) => {
        const invalid_ID = 12345;
        chai.request(server)
          .get(`/api/books/${invalid_ID}`)
          .end((err,res)=>{
            assert.equal(res.status,200);
            assert.deepEqual(res.body, 'no book exists')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${test_ID}`) 
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.body._id, test_ID); 
            assert.equal(res.body.title, 'Get book by id'); 
            assert.equal(res.body.commentcount, 0); 
            assert.isArray(res.body.comments); 
            assert.lengthOf(res.body.comments, 0); 
            done();
          });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      before((done) => {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Post book test',
            commentcount: 0,
            comments: [],
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            post_test_ID = res.body._id; 
            done();
          });
      });
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${post_test_ID}`)
        .send({
          comment: 'Test comment'
        })
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.isObject(res.body);
          assert.equal(res.body._id, post_test_ID)
          assert.isAtLeast(res.body.commentcount, 1)
          assert.isArray(res.body.comments)
          assert.isAtLeast(res.body.comments.length,1)
          done()
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${post_test_ID}`)
        .send({})
        .end((err,res)=>{
          assert.equal(res.status,200);
          assert.deepEqual(res.body, 'missing required field comment')
          done()
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/invalid_ID')
          .send({
            comment: 'This should fail'
          })
          .end((err,res)=>{
            assert.equal(res.status,200);
            assert.deepEqual(res.body,'no book exists')
            done()
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      before((done) => {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Delete book test',
            commentcount: 0,
            comments: [],
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            delete_test_ID = res.body._id; 
            done();
          });
          
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${delete_test_ID}`)
          .end((err,res)=>{
            assert.equal(res.status,200);
            assert.deepEqual(res.body,'delete successful')
            done()
          })
      });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/invalidId')
          .end((err,res)=>{
            assert.equal(res.status,200);
            assert.deepEqual(res.body,'no book exists')
            done()
          })
      });

    });

  });

});
