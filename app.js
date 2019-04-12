const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin1:abcdef123@ds131983.mlab.com:31983/einhorn');

const Book = require('./models/book');
const User = require('./models/user');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
// setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// routes
// landing page: localhost:5000/
app.get('/', (request, response)=> {
    //response.send('This is my landing page');
    response.render('index', {
        pageTitle: 'Landing page'
    }); //index.hbs and layout.hbs
});

// get registration form
app.get('/registration', (request, response)=> {
    response.render('signUp', {
        pageTitle: 'Registration Page'
    }); //signUP.hbs and layout.hbs
});

app.post('/registration', (req, res)=> {
    // if any data come from the form than render to success
    console.log(req.body);

    let newUser = new User ({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        website: req.body.website,
        location: req.body.location
    });

    newUser.save(err => {
        if(err) throw err;
        res.redirect('/user/list');
    });
}); 

app.get('/user/list', (req, res) => {
    const query = User.find();
    query.exec((err, result) => {
        // console.log(result)
        if(err) throw err;
        res.render('userList', {
            pageTitle: 'User List',
            users: result
        });
    });
});

app.get('/userdetails', (req, res) => {
    const query = User.find();
    query.exec((err, result) => {
        // console.log(result)
        if(err) throw err;
        res.render('userdetails', {
            pageTitle: 'User Details',
            users: result
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/gallary', (req, res) => {
    res.render('gallary');
});

app.post('/login', (req, res) => {
    console.log(req.body);

    let emailFromBody = req.body.email;
    if(emailFromBody) {

    let users = User.findOne({
        email: emailFromBody
    });

        //response.json(req.body.username);

    users.exec((err, result) => {
        if(err) throw err;
        console.log(result);
        if(!result) {
            res.redirect('/registration');
        }
        else {
        res.render('profile', {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                website: req.body.website,
                location: req.body.location,
                pageTitle: 'My Profile Page'
            });
        }
            });
        }else {
            res.redirect('login');
        }    
});

//find all the users form the database
//CRUD application

app.get('/book', (req, res) => {
    res.render('bookForm', {
        pageTitle: 'My Book Form'
    });
});

app.post('/book/add', (req, res) => {
    console.log(req.body);
     let newBook = new Book ({
        title: req.body.title,
        author: req.body.author,
        published: req.body.published,
        language: req.body.language,
        description: req.body.description,
        updatedDate: Date() 
    });

    newBook.save(err => {
        if(err) throw err;
        res.redirect('/book/list');
    });
});

app.all('/book/list', (req, res) => {
    const query = Book.find();
    if(req.body.author) {
        query.where({
            author: req.body.author
        });
    }
    query.exec((err, result) => {
        // console.log(result)
        if(err) throw err;
        res.render('booklist', {
            pageTitle: 'Book List',
            books: result
        });
    });
});

app.get('/book/delete/:id', (req, res)=> {
    let bookId = req.params.id;
    //res.send('Book Id I clicked is:' + bookId);
    const query = Book.findByIdAndDelete({_id: bookId});
    query.exec(function(err, result) {
        res.redirect('/book/list');
    });
});

//update
app.get('/book/update/:id', (req, res) => {
    let bookId = req.params.id;
    const query = Book.findById({_id: bookId});
    query.exec ((err, result) => {
        if(err) throw err;
        //res.json(result); //for testing
        // change old value with new
        res.render('bookdetail', { 
            pageTitle: 'Book Details',
            book: result
         });
    });
});

app.post('/book/update', (req, res) => {
    const query = Book.findById ({ _id: req.body.id});
    query.exec((err, result) => {
        if(err) throw err;
        result.title = req.body.title;
        result.author = req.body.author;
        result.published = req.body.published;
        result.language = req.body.language;
        result.description = req.body.description;
        result.updatedDate = Date.now();
        result.save(function() {
            res.redirect('/book/list');
        });
    });
});

/*
app.post('/book/search/', (req, res) => {
    let author = req.body.author;
    console.log(author);
    const searchQuery = Book.find();
    if(req.body.author) {
        searchQuery.where({
            author: req.body.author
        });
    }
});
*/

// localhost:5000/users
app.get('/users', (req, res) => {
   /* let users = [
    {
        name: "Ariful",
        age: 28,
        role: "teacher",
        id: 1
    },
    {
        name: "Gabi",
        age: 30,
        role: "Student",
        id: 2
    }
   ]; */
   // getting users list from some website
   let getUsers = fetch('https://jsonplaceholder.typicode.com/users');
   getUsers
   .then(res=> res.json())
   .then(users=>{
        res.render('userList', {
            pageTitle: "All users list",
            users: users //some data about users
        });
   });
   //res.send('Hi Users routes is working');
});

// localhost:5000/user/1
app.get('/user/:id', (req, res)=> {
    let userId = req.params.id;
    console.log(req.params);
    let findUser = fetch('https://jsonplaceholder.typicode.com/users/' + userId);
    findUser
    .then(res=> res.json())
    .then(user=> {
        res.render('profile', {
            pageTitle: "All users list",
            user: user
        });
    });
    //res.send('One user with Id ' + userId);
});


// making a route
app.get('/page1', (req, res) => {
    res.send('working');
});

app.get('/page2', (req, res) => {
    //res.send('hi I am page 2');
    res.sendFile(__dirname + '/page2.html');
});

app.get('/page3', (req, res) => {
    let user = {
        name: "PINK",
        age: 18,
        country: "USA"
    };
    res.json(user);
    //res.send(user);
}) 

app.get('/page4', (req, res) => {
    let user = {
        name: "PINK",
        age: 18,
        country: "USA"
    };
    res.send('hi' + JSON.stringify(user));
    //res.send('hi' + user);
});

app.get('/page5/:something', (req, res) => {
    res.send('The path is 5001/page5/' + req.params.something);
});

app.get('/page6/:friend/:id', (req, res) => {
    res.send('my friend is: ' + req.params.friend + ' id: ' + req.params.id);
});

/* app.get('*', (req, res, next) => {
    res.redirect('/'); //if no routes than go to homepage
}); */

const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> {
    console.log('This app is running on port ' + PORT);
});
