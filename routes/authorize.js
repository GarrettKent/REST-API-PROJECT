'use strict';

const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {User} = require('../models');
 
module.exports = (req, res, next) => {
    //Holds error messages
    let message = null;
     
    const credentials = auth(req);
    if (credentials) {
       
        //Find user with corresponding email address
        User.findOne({
            where: { emailAddress: credentials.name }            
        }).then(user => {
            if (user) {
                let authenticated = bcryptjs.compareSync(credentials.pass, user.password);
                //if passwords match, access to routes
                if(authenticated) {
                    req.currentUser = user;
                    next();
                } else {
                    //if passwords don't match, no access to routes
                    message= "Incorrect password";
                    res.json({ message: message });
                    res.status(401);
                }
            } else {
                message= "Incorrect email";
                res.json({ message: message });
                res.status(401);
            }
        });
    } else {
         //Credentials are not filled in with a status of 401
         const err = new Error('Enter the correct information where it is needed');
         err.status= 401;
         next(err);
    }
};