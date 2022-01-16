let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send({ 
        error: false, 
        message: 'Welcome',
        written: 'Petch',
        published_on: 'http://petch.dev'
    });
})

// connect to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api'
})
dbCon.connect();

// retrieve all book
app.get('/books', (req, res) => {
    dbCon.query("SELECT * FROM books", (error, results, fields) => {
        if (error) throw error;
        let message = ""
        if(results === undefined || results.length == 0){
            message = "Book table is empty"
        }else{
            message = "Succesfully retrieve all books"
        }
        return res.send({ error: false, data: results, message: message});
    });
});

//add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validate
    if(!name || !author){
        return res.status(400).send({ error: true, message: "please provide book name and author"});
    }else{
        dbCon.query("INSERT INTO books (name, author) VALUES(?, ?) ", [name, author], (error, results, fields) => {
            if (error) throw error;
            let message = ""
            return res.send({ error: false, data: results, message: "add new book succesfully"});

        });
    }
});

// retrieve book by id
app.get('/book/:id', (req, res) => {
    let id = req.params.id;
    if(!id){
        return res.status(400).send({ error: true, message: "please provide book id"});
    }else{
        dbCon.query("SELECT * FROM books WHERE id = ?", id,  (error, results, fields) => {
            if (error) throw error;
            let message = ""
            if(results === undefined || results.length == 0){
                message = "book not found"
            }else{
                message = "Succesfully retrieve book"
            }
            return res.send({ error: false, data: results[0], message: message});
        });
    }
});

//update book with id
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;
    if(!id || !name || !author){
        return res.status(400).send({ error: true, message: "please provide book id, name, author"});
    }else{
        dbCon.query("UPDATE books SET name = ?, author = ? WHERE id = ?", [name, author, id],  (error, results, fields) => {
            if (error) throw error;
            let message = ""
            if(results.changedRows == 0){
                message = "book not found or data same "
            }else{
                message = "Succesfully updated book"
            }
            return res.send({ error: false, data: results, message: message});
        });
    }
});

//delete book by id
app.delete('/book', (req, res) => {
    let id = req.body.id;
    if(!id){
        return res.status(400).send({ error: true, message: "please provide book id"});
    }else{
        dbCon.query("DELETE FROM books WHERE id = ?", id,  (error, results, fields) => {
            if (error) throw error;
            let message = ""
            if(results.affectedRows === 0){
                message = "book not found"
            }else{
                message = "Succesfully deleted book"
            }
            return res.send({ error: false, data: results, message: message});
        });
    }
});

app.listen(3001, () => {
    console.log('Node run on port 3001')
});

module.exports = app;
