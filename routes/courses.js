const express = require('express');
const router = express.Router();
const {Course} = require("../models");
const {User} = require("../models");
const authorize = require('./authorize');

//Using GET, retreive the list of courses and filters out createdAt and updatedAt
router.get('/', (req, res, next) => {
    Course.findAll({
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
      ],

      include: [
        {
          model: User,
          attributes: [
              "id", 
              "firstName", 
              "lastName", 
              "emailAddress"]
        }
      ]
    }).then(courses => {
        //retrieves list and status of 200
        res.json(courses);
        res.status(200);
        //Catch error
    }).catch(err => {       
            err.status = 400;
            next(err);        
    }); 
});

//Using GET, a specific course is retrieved by id and filters out createdAt and updatedAt
router.get('/:id', (req, res, next) => {
    Course.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            "id",
            "title",
            "description",
            "estimatedTime",
            "materialsNeeded",
            "userId"
      ],
      include: [
        {
          model: User,
          attributes: [
              "id", 
              "firstName", 
              "lastName", 
              "emailAddress"
            ]
        }
      ]
    }).then( course => {
        if(course) {
            //Retrieve course and send 200 status if course is found
            res.json(course);
            res.status(200);  
        } else {
            const err = new Error('Course cannot be found');
            err.status = 400;
            next(err);
        }
    });
})

//Using POST, a course can be created
router.post("/", authorize, (req, res, next) => { 
    if (req.body.title) {
        //In case the course being created already exists
        Course.findOne({ where: { title: req.body.title }})
            .then( title => {
                if (title) {
                    const err = new Error('This course already exists');
                    err.status = 400;
                    next(err);                   
                }else {
                req.body.userId = req.currentUser.id;              
                //Course is created and sends status of 201, ending the process.
                Course.create(req.body)
                .then( course => {
                    console.log('The course is now available');
                    res.location('/api/courses/' + course.id);
                    res.status(201).end();
                })
                .catch (err => {
                    if (err.name == "SequelizeValidationError") {
                        err.message = "All data must be entered";
                        err.status = 400;
                        next(err); 
                    } else {
                        err.status = 400;
                        next(err);
                    }
                });            
            }
        })
    }else {
        const err = new Error('Enter a course title');
        err.status = 400;
        next(err);
    }
});

//Using PUT, a selected course can be updated
router.put('/:id', authorize, (req, res, next) => {
       //Finds course using id 
        Course.findOne({ where: {
            id: req.body
        }})
        .then (course => {
            if (course) {
                course.update(req.body); 
               //If course id does not equal the users id, an error appears                
            } else if (course.userId !== req.currentUser.id) {
                //Send 403 error if user does not own course
                const err = new Error('You cannot update this course');
                err.status = 403;
                next(err);
            } else {                
                //If the course is not found
                const err = new Error('Course cannot be found');
                err.status = 400;
                next(err);
            }
        })
        .then( () => {
            res.status(204).end();
        })
        .catch(err => {
            if (err.name === "SequelizeValidationError") {
                err.message = "Enter all information";
                err.status = 400;
                next(err);
            } else {
                err.status = 400;
                next(err);
            } 
        })    
});

//Using DELETE, a course is deleted. 
router.delete('/:id', authorize, (req, res, next) => {
        //Finds course using id
        Course.findOne({ where: { id: req.body }
    })
    .then (course => {
        if (course) {
            course.destroy();
            res.status(204).end();                
        } else if (course.userId !== req.currentUser.id) {               
            //Sends 403 error if user does not own course
            const err = new Error('You cannot delete this course');
            err.status = 403;
            next(err);
        } else {               
            //If the course is not found
            const err = new Error('Course cannot be found');
            err.status = 400;
            next(err);
        }
    }) 
    .catch(err => {
        if (err.name === "SequelizeValidationError") {
            err.message = "Enter all information";
            err.status = 400;
            next(err);
        } else {
            err.status = 400;
            next(err);
        } 
    })
});

module.exports = router; 