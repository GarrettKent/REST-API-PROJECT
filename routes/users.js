const express = require('express');
const router = express.Router();
const {User} = require("../models");
const authorize = require('./authorize');
const bcryptjs = require("bcryptjs");

//Using GET, a user that is authorized is retrieved with a status of 200. password, createdAt, and updatedAt are filtered out
router.get("/", authorize , (req, res) => {
    res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.emailAddress,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress
    });
    res.status(200);
});

//Using POST, a user is created
router.post("/", (req, res, next) => { 
    if (req.body.emailAddress) {
        User.findOne({ where: { emailAddress: req.body.emailAddress }})
    .then( email => {            
        //If is already created
        if (email) {
            const err = new Error('Email address already exists');
            err.status = 400;
            next(err);
        } else {
            //Hashed the password
            req.body.password = bcryptjs.hashSync(req.body.password);                
            User.create(req.body)
            .then(() => {
                res.location('/');
                res.status(201).end();
            })
            .catch (err => {
                if (err.name === "SequelizeValidationError") {
                    err.message = "All data must be entered";
                    err.status = 400;
                    next(err);
                } else {
                    err.status = 400;
                    next(err);
                }
        });
    } 
});       

    } else {
        const err = new Error('Enter the necessary information');
        err.status = 400;
        next(err);  
    }   
});

module.exports = router;