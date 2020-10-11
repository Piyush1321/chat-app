const express = require('express') 
const bodyParser = require('body-parser')

const app = express()

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'))


app.use('/', require('./routes/main'))

app.listen(3000,function (req,res) {
    console.log("Server is running on 3000")
})