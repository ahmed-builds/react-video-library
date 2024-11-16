var express = require("express");
var app = express();
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;
var mongoConnect = 'mongodb://127.0.0.1:27017';
let port = 3030;
let selectedDb = 'reactVideoLibrary';
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

// Registers New User
app.post('/register-user', (req, res) => {
    var registrationData = {
        regId: parseInt(req.body.regId),
        userName: req.body.username,
        userId: req.body.userid,
        eMail: req.body.useremail,
        mobile: req.body.usercontact,
        password: req.body.userpassword,
        gender: req.body.usergender,
        userType: 'U',
        date: new Date()
    }
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('registeredUsers').insertOne(registrationData).then(() => {
            console.log('User Registered Successfully.');
            res.end();
        });
    });
});

// Get All Users
app.get('/get-users', (req, res) => {
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('registeredUsers').find({ userType: "U" }).toArray().then(documents => {
            res.send(documents);
            res.end();
        });
    });
});

// VALIDATE USER ID FOR REGISTRATION FORM
app.get('/validate-user/:checkUser', (req, res) => {
    var checkUser = req.params.checkUser;
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('registeredUsers').findOne({ userId: checkUser }).then(documents => {
            res.send(documents);
            res.end();
        });
    });
});

// GET USER BY REG ID IRRESPECTIVE OF USERTYPE
app.get('/get-user/:userId', (req, res) => {
    var userId = parseInt(req.params.userId);
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('registeredUsers').findOne({ regId: userId }).then(documents => {
            res.send(documents);
            res.end();
        });
    });
});

// Get All Videos
app.get('/get-videos', (req, res) => {
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videosInventory').find({}).toArray().then(videos => {
            res.send(videos);
            res.end();
        });
    });
});

// Get specific Video
app.get('/get-video/:videoId', (req, res) => {
    var getVideoId = parseInt(req.params.videoId);
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videosInventory').findOne({ videoId: getVideoId }).then(getVideo => {
            res.send(getVideo);
            res.end();
        })
    });
});

// Get Videos based on Category
app.get('/get-videos/:videoCategory', (req, res) => {
    var getVideoCategory = parseInt(req.params.videoCategory);
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videosInventory').find({ videoCategory: getVideoCategory }).toArray().then(categoryVideos => {
            res.send(categoryVideos);
            res.end();
        });
    });
});

/****************************
 * 
 * ADMIN APIs starts here
 * 
 * ************************ */

// CREATE CATEGORIES
app.post('/create-category', (req, res) => {
    var categoryDetails = {
        categoryId: parseInt(req.body.categoryId),
        categoryTitle: req.body.categoryTitle,
        categoryDescription: req.body.categoryDescription,
        createdOn: new Date()
    }
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videoCategories').insertOne(categoryDetails).then(createdCategory => {
            console.log('Category Created Successfully');
            res.end();
        });
    });
});

// GET AND DISPLAY CATEGORIES
app.get('/get-categories', (req, res) => {
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videoCategories').find({}).toArray().then(vidCategories => {
            res.send(vidCategories);
            res.end();
        });
    });
})

// CREATE AND ADD VIDEOS TO INVENTORY
app.post('/post-videos', (req, res) => {
    var videoInventory = {
        videoId: parseInt(req.body.videoId),
        videoCategory: parseInt(req.body.videoCategory),
        videoTitle: req.body.videoTitle,
        videoDescription: req.body.videoDescription,
        videoURL: req.body.videoURL,
        videoLikes: parseInt(req.body.videoLikes),
        videoDislikes: parseInt(req.body.videoDislikes),
        videoViews: parseInt(req.body.videoViews),
        videoStatus: parseInt(req.body.videoStatus),
        videoModifiedOn: new Date(),
        videoAddedOn: new Date()
    }
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videosInventory').insertOne(videoInventory).then(addedVideo => {
            console.log('Video Added to Inventory Successfully!');
            res.end();
        });
    });
});

// UPDATE VIDEO DETAILS
app.put('/update-video/:videoId', (req, res) => {
    var getVideoId = parseInt(req.params.videoId);
    var updateVideoInventory = {
        videoId: parseInt(req.body.videoId),
        videoCategory: parseInt(req.body.videoCategory),
        videoTitle: req.body.videoTitle,
        videoDescription: req.body.videoDescription,
        videoURL: req.body.videoURL,
        videoLikes: parseInt(req.body.videoLikes),
        videoDislikes: parseInt(req.body.videoDislikes),
        videoViews: parseInt(req.body.videoViews),
        videoStatus: parseInt(req.body.videoStatus),
        videoModifiedOn: new Date(),
        videoAddedOn: new Date()
    }
    mongoClient.connect(mongoConnect).then(mongoObj => {
        var database = mongoObj.db(selectedDb);
        database.collection('videosInventory').updateOne({ videoId: getVideoId }, { $set: updateVideoInventory }).then(addedVideo => {
            console.log('Video Updated in Inventory Successfully!');
            res.end();
        });
    });
});

app.listen(port);
console.log(`Server is listenting on http://127.0.0.1:${port}`)