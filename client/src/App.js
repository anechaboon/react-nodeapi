import Axios from 'axios'
import { useState } from 'react'
import $ from 'jquery';

function App() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");

  const [edtName, setEdtName] = useState("");
  const [edtAuthor, setEdtAuthor] = useState("");

  const [bookList, setBookList] = useState([]);

  const getBooks = () => {
    Axios.get('http://localhost:3001/books').then((response) => {
      setBookList(response.data.data);
    });
  }

  const addBook = () => {
    Axios.post('http://localhost:3001/book', {
      name:name,
      author:author,
    }).then(() => {
      setBookList([
        ...bookList,
        {
          name:name,
          author:author,
        }
      ])
    });
  }
  
  const updateBook = (id) => {
    Axios.put('http://localhost:3001/book',{name:edtName, author:edtAuthor, id:id}).then((response) => {
      setBookList(
        bookList.map((val) => {
          return val.id == id ? {
            id: val.id,
            name: edtName,
            author: edtAuthor
          } : val;
        })
      )
    })

    
  }

  $( "body" ).delegate( ".btn-edit-book", "click", function( event ) {
    const id = $(this).closest('.card-body').attr("data-id");
    $(`.card-body[data-id=${id}] > .name > .col-md-10 > .card-text`).addClass('hide');
    $(`.card-body[data-id=${id}] > .name > .col-md-10 > .input-name`).removeClass('hide');
  
    $(`.card-body[data-id=${id}] > .author > .card-text`).addClass('hide');
    $(`.card-body[data-id=${id}] > .author > .input-author`).removeClass('hide');
  
    $(`.card-body[data-id=${id}] > .name > .col-md-1 > .btn-edit-book`).addClass('hide');
    $(`.card-body[data-id=${id}] > .name > .col-md-1 > .btn-update-book`).removeClass('hide');
  })

  return (
    <div className="App container">
      <h1>Books</h1>
      <div className="book">
        <form action="">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" placeholder="Enter Name" onChange={(event)=>{setName(event.target.value)}}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Author</label>
            <input type="text" className="form-control" placeholder="Enter Author" onChange={(event)=>{setAuthor(event.target.value)}}></input>
          </div>
          <button className="btn btn-success" onClick={addBook}>Add Book</button>
        </form>
      </div>

      <hr />

      <div className="books">
        <button className="btn btn-primary" onClick={getBooks}>Show Books</button>
        <br /><br />
        {bookList.map((val, key) => {
          return (
            <div className="book card">
              <div className="card-body text-left" data-id={val.id}>
                <div className='name row form-group'>
                  <div className="col-md-10">
                    <p className="card-text">Name: {val.name}</p>
                    <div className='input-name row hide'>
                      <p className="card-text col-md-1">Name: </p>
                      <input type="text" className='col-md-6' name="edtName" onChange={(event)=>{setEdtName(event.target.value)}}></input>
                    </div>
                  </div>
                  <div className='col-md-1'>
                    <button className='btn btn-warning btn-edit-book'>Edit</button>
                    <button className='btn btn-primary btn-update-book hide' onClick={() => {updateBook(val.id)}} >Update</button>
                  </div>
                </div>
                <div className="author col-md-12 form-group">
                  <p className="card-text">Author: {val.author}</p>
                  <div className='input-author row hide'>
                    <p className="card-text col-md-1">Author: </p>
                    <input type="text" className='col-md-6' name="edtAuthor" onChange={(event)=>{setEdtAuthor(event.target.value)}} ></input>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );

  
}


export default App;
