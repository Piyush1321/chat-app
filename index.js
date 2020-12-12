const express = require('express') 
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose')
const passport = require('passport')



const app = express()



const http = require('http').createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public')) 
app.use(session({
    secret : 'secret-key',
    resave : false,
    saveUninitialized : false
}))

mongoose.connect('mongodb+srv://piyush:1332001@cluster0.6o6is.mongodb.net/mydb?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {console.warn('db connected')}).catch(() => {console.warn('db connection failed')})


app.use('/', require('./routes/main'))

const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

app.listen(3000,function (req,res) {
    console.log("Server is running on 3000")
})

