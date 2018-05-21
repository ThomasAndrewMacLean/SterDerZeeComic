if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const cloudinary = require('cloudinary');
const ejs = require('ejs');
var cookieParser = require('cookie-parser')

const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const multer = require('multer');
//const db = require('monk')('localhost/test')
const db = require('monk')(`mongodb://dbReadWrite:${process.env.MONGO_PW}@cluster0-shard-00-00-hfoch.mongodb.net:27017,cluster0-shard-00-01-hfoch.mongodb.net:27017,cluster0-shard-00-02-hfoch.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`)
let images = db.get('images')

const OAuth2Client = require('google-auth-library').OAuth2Client;


const CLIENT_ID = '171417293160-m0dcbi10fgm434j0l73m1t9t0rnc48o8.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const app = express();

app.use(cookieParser())
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'))

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb('Error: only images!')
        }
    }
}).single('image');

auth = (req, res, next) => {
    console.log(req);
    next();

}

app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));
app.get('/opladen', (req, res) => {
    const token = req.cookies['auth-token'];
    if (!token) {
        res.render('login')
    }
    client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    }).then(ticket => {
        if (ticket.getPayload().email === 'thomas.maclean@gmail.com') {
            res.render('opladen')
        } else {
            res.render('nope')
        }
    })
});
app.get('/contact', (req, res) => {
    const token = req.cookies['auth-token'];
    if (!token) {
        res.render('login')
    }
    client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    }).then(ticket => {
        if (ticket.getPayload().email === 'thomas.maclean@gmail.com') {
            res.render('contact')
        } else {
            res.render('nope')
        }
    })
});
app.get('/volgorde', (req, res) => {
    const token = req.cookies['auth-token'];
    if (!token) {
        res.render('login')
    }
    client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    }).then(ticket => {
        if (ticket.getPayload().email === 'thomas.maclean@gmail.com') {
            images.find({})
                .then(images => {
                    console.log('images');

                    res.render('volgorde', {
                        images
                    })
                })
        } else {
            res.render('nope')
        }
    })


});
app.get('/story', (req, res) => res.render('story'));

app.get('/test', (req, res) => {
    res.status(200).json({
        'message': 'hello world!'
    })
})

app.delete('/data', (req, res) => {
    //  images.remove({})
    res.status(200).json({
        'message': 'data is gone...'
    })
})
app.get('/data', (req, res) => {
    console.log('gettting data');
    images.find({})
        .then(d => {
            res.status(200).json(d);
        })
})
cloudinary.config({
    cloud_name: 'dictffhrv',
    api_key: 864653742581441,
    api_secret: process.env.API_SECRET_CLOUDINARY
});

app.post('/signin', (req, res) => {
    let token = req.body.token;
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['email'];
        console.log(userid);

        res.status(200).json(userid)
    }
    verify().catch(console.error);
});

app.post('/uploadfile', (req, res) => {
    console.log('upload starting...');


    console.log(req.query);

    upload(req, res, (err) => {
        if (err) {
            console.log('err1');
            console.log(err);
        } else {
            if (req.file == undefined) {

                console.log('no file???');
            } else {
                // console.log(req.file);

                cloudinary.uploader.upload(req.file.path, function (result) {
                    console.log(result)
                    let imageData = {
                        width: result.width,
                        height: result.height,
                        url: result.secure_url,
                        originalName: result.original_filename,
                        name: req.query.name,
                        description: req.query.desc
                    }

                    images.insert(imageData);
                    res.status(200).json({
                        imageData
                    })
                });

            }
        }
    });
});


app.listen(process.env.PORT || 8080, () => console.log('All is ok'));