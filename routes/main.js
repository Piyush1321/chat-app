const { render } = require('ejs');
const express = require('express')
const mongoose = require('mongoose')
const { check } = require('express-validator')
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer')
const loginSchema = require('../models/loginSchema');
const bcrypt = require('bcrypt')
const passport = require('passport')




let transport = nodemailer.createTransport({
    service : 'gmail',
    auth: {
        user : 'piyushkumar1321@gmail.com',
        pass : 'rare1332001'
    }
})

const router = express.Router()

var VerificationCode


router.get('/', (req,res) => {

    res.render('home')
})
 var realUser
router.post('/', (req,res) => {
    
})

router.get('/chatPage', (req, res) => {
    res.render('index',{realUser})
})
router.post('/register',[check('name','Invaild name').isLength({min:3}),
check('email','Invalid Email').isEmail(),
check('password', 'Passoword must contain 5 character').isLength({min:5}),

], (req,res) => {
    req.session.name = req.body.name
    req.session.email = req.body.email
    req.session.password = req.body.password

    

    error = validationResult(req)
    array = error.array()
    let msg = {success : 200,
        error : []}
    array.forEach(element => {
        msg.error.push(element.msg)
    });
    loginSchema.findOne({
        email : req.body.email 
    }).then((user) => {
        if(user)
        {
            //console.log("element found")
            msg.error.push("Email Already Registered")
            msg.success = 500
            console.log(msg.success)
            return res.send(msg)
        }
        else{
                if(req.body.PasswordMatched == 0)
                {
                    msg.error.push("Password Not Matched")
                }

                console.log(msg.success+" array ")

                if(msg.error.length == 0)
                {
                    console.log(req.body.email)
                    VerificationCode = Math.floor(1000 + Math.random() * 9000);
                    let mailOptions = {
                        from : 'piyushkumar1321@gmail.com',
                        to : req.body.email,
                        subject : 'Email Verification',
                        text : 'your verification no : '+VerificationCode
                    }
                    
                    transport.sendMail(mailOptions, (err, data) => {
                        if(err)
                        {
                            console.log("Email not Sent")
                        }
                        else
                        {
                            console.log("Email Sent")
                        }
                    })

        return res.send(msg)
    }
    else{
        msg.success = 500
        return res.send(msg)
    }
        }
        
     })
    
   // console.log(arrayElement)
    
})


router.get('/emailCheck', (req, res) => {
    res.render('emailVerification')
})

router.post('/emailCheck', (req,res) => {
    if(VerificationCode == req.body.NO)
    {
        bcrypt.hash(req.session.password, 10, (err, hash) => {
            var userlogin = new loginSchema({
                _id : new mongoose.Types.ObjectId,
                name : req.session.name,
                email : req.session.email,
                password : hash
            })
            userlogin.save().then((result) => {console.warn(result)}).catch((err) => {console.warn(err)})
        });
        res.render('mainpage')
    }
    else{
        console.log("wrong verification code")
        
    }
})

router.get('/mainpage', (req, res) => {
    res.render('mainpage',{realUser})
})

router.post('/mainpage', (req,res) => {
    console.log(req.body.search)
    loginSchema.find({
        name : req.body.search
    }).then((user) => {
        if(user.length > 0)
        {
            res.render('mainpage',{user})
        }
        else{
            console.log('no user found')
        }
        
     })
})

router.get('/chatpage', (req,res) => {
    res.render('index')
})

module.exports = router