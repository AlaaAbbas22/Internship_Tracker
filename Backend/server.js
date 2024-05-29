require('dotenv').config();

// importing modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid').v4;
const cors = require('cors')

const app = express();
const port = 3000;

app.use(express.json());

// initializing a cookie for the session
app.use(session({
    secret: process.env["secretkey"],  // a secret string used to sign the session ID cookie
    resave: false,  // don't save session if unmodified
    saveUninitialized: false  // don't create session until something stored
}));

// enabling all origins
app.use(cors())


// importing the db and the models
const db = require("./db");
const User = db.User;



// hashing function
function hasher(pass){
    return new Promise(resolve => {bcrypt.hash(pass,0, (err, hash) => {
        if (err) {
            console.log(err)
            return;
        }
    resolve(hash)
    })});
}


// comparing user input with the hashed password
function password_check(pass, hashed_pass){
    return new Promise(resolve => {bcrypt.compare(pass, hashed_pass, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error comparing passwords:', err);
            return;
        }
    resolve(result)
    })});
}




// setting up a handler for when the frontend send a request to the endpoint (/ping, so if the server is running on `http://localhost:3000/`)
// localhost is just saying: your PC. And the port as we said to make you run both frontend and backend on the same PC
// so when we send a get request to `http://localhost:3000/ping`, it is handlend by what is below
app.get("/ping", (req, res)=>{
    // setting up a response
    res.send({ success: true, res: "pong" });
})


app.post('/login', async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    
    const user = await User.find({email:email}).exec()
    if (user ==[]){
        res.send({result:"Not found"})
        return
    }

    if (password_check(password, user[0].password)){
        const uid = uuidv4()
        req.session["uid"] = uid
        user[0].sessions.push(uid)
        user[0].save()
        res.send({result:"Authenticated"})
    } else {
        res.send({result:"Wrong Password"})
    }
        
})

app.get('/authenticated', async (req, res)=>{
    const uid = req.session["uid"]
    if (uid==undefined){
        res.send({result:"Not Authenticated"})
    } else {
        const user = await User.find({sessions:uid}).exec()
        if (user != []){
            res.send({result: user[0].email})
            return;
        }
        res.send({result:"Session Id not found"})
    }
})

// this is to start the server. The console.log() is analogous to print in python
app.listen(port, async () => {

    /*// testing user
    const user = User({
        email: "Alaa@aabbas.co",
        password: await hasher("Minerva123"),
        sessions: [],
      })
      console.log(user)
    user.save()*/

    console.log(`Express app listening on port ${port}`)
  })