// importing express itself
const express = require('express')

// a module (library) to manage server-sided sessions. (Will be helpful later when we need to `pass` arguments between different requests for the same user.)
const session = require('express-session')

// creating an app (analogous to `app = Flask(__name__)` if you know it)
const app = express()

// Defining the port. All you need to know is that when you run the frontend & backend on your machine, they should have different ports to be able to distinguish them.
const port = 3000

// http://localhost:{port}/

// this is to use json when sending responses to a request. Search what a json is (very important). For short, think of it as a python dictionary or javascript object
app.use(express.json());

// setting up a handler for when the frontend send a request to the endpoint (/ping, so if the server is running on `http://localhost:3000/`)
// localhost is just saying: your PC. And the port as we said to make you run both frontend and backend on the same PC
// so when we send a get request to `http://localhost:3000/ping`, it is handlend by what is below
app.get("/ping", (req, res)=>{
    
    // setting up a response
    res.json({ success: true, res: "pong" });

})




// this is to start the server. The console.log() is analogous to print in python
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
  })