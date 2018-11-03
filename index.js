if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const express = require('express');
const cloudinary = require('cloudinary');
//const ejs = require('ejs');
const data = require('./public/data.json');
var cookieParser = require('cookie-parser');

const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const multer = require('multer');

const githubApi =
  'https://api.github.com/repos/ThomasAndrewMacLean/SterDerZeeComic/contents/public/data.json';

const githubSecret = process.env.GITHUBTOKEN;
const fetch = require('node-fetch');
//const db = require('monk')('localhost/test')

const db = require('monk')(`mongodb://dbReadWrite:${
    process.env.MONGO_PW
  }@cluster0-shard-00-00-hfoch.mongodb.net:27017,cluster0-shard-00-01-hfoch.mongodb.net:27017,cluster0-shard-00-02-hfoch.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`);
let images = db.get('images');
let volgorde = db.get('volgorde');
let users = db.get('users');

const OAuth2Client = require('google-auth-library').OAuth2Client;

const CLIENT_ID =
  '171417293160-m0dcbi10fgm434j0l73m1t9t0rnc48o8.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);
const app = express();

app.use(cookieParser());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: only images!');
    }
  }
}).single('image');

// auth = (req, res, next) => {
//     console.log(req);
//     next();

// }
app.get('/init', (req, res) => {
  res.status(200).json('ok');
});
app.get('/users', (req, res) => {
  users.find().then(d => res.status(200).json(d));
});

// app.get('/login', (req, res) => res.render('login'));
// app.get('/nope', (req, res) => res.render('nope'));
app.post('/setVolgorde', (req, res) => {
  const token = req.cookies['auth-token'];

  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              volgorde
                .update(
                  {
                    id: 'volgorde'
                  },
                  req.body.nieuweVolgorde
                )
                .then(v => {
                  res.status(200).json(v);
                });
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      });
  }
});
app.post('/addUserToDb', (req, res) => {
  const token = req.cookies['auth-token'];

  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              users
                .insert({
                  email: req.body.newEmail
                })
                .then(r => res.status(200).json(r));
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      });
  }
});
app.post('/removeUserFromDb', (req, res) => {
  const token = req.cookies['auth-token'];

  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              users
                .remove({
                  email: req.body.newEmail
                })
                .then(r => res.status(200).json(r));
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      });
  }
});
app.get('/opladen', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    console.log('SEND TO LOGIN');
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              res.render('opladen');
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      }) //.catch(err => console.log(err))
      .catch(err => {
        console.log('ERROR CAUGHT... ');
        console.log(err);
        res.render('login');
      });
  }
});

app.get('/data', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    console.log('SEND TO LOGIN');
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              res.render('data', data);
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      }) //.catch(err => console.log(err))
      .catch(err => {
        console.log('ERROR CAUGHT... ');
        console.log(err);
        res.render('login');
      });
  }
});

app.get('/contact', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              res.render('contact');
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      })
      .catch(err => {
        console.log('ERROR CAUGHT... ');

        console.log(err);
        res.render('login');
      });
  }
});
app.get('/adduser', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              users.find().then(allUsers => {
                res.render('addUser', {
                  users: allUsers
                });
              });
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      })
      .catch(err => {
        console.log('ERROR CAUGHT... ');

        console.log(err);
        res.render('login');
      });
  }
});
app.get('/volgorde', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    res.render('login');
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
              volgorde
                .find({
                  id: 'volgorde'
                })
                .then(volg => {
                  images.find({}).then(images => {
                    console.log(volg[0].volgorde);

                    let imagesOpVolgorde = volg[0].volgorde.map(v => images.find(i => i._id.toString() == v));
                    console.log(imagesOpVolgorde);

                    res.render('volgorde', {
                      images: imagesOpVolgorde
                    });
                  });
                });
            } else {
              console.log('TICKET IS NOT CORRECT EMAIL');
              res.render('nope');
            }
          });
      })
      .catch(err => {
        console.log('ERROR CAUGHT... ');

        console.log(err);
        res.render('login');
      });
  }
});
app.get('/story', (req, res) => res.render('story'));

app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'hello world!'
  });
});

app.delete('/data', (req, res) => {
  let reallyDelete = true;
  if (reallyDelete) {
    images.remove({});
    volgorde.remove({});

    volgorde.insert({
      id: 'volgorde',
      volgorde: []
    });
    res.status(200).json({
      message: 'data is gone...'
    });
  }
});
app.get('/getVolgordeJson', (req, res) => {
  console.log('gettting data');
  volgorde
    .findOne({
      id: 'volgorde'
    })
    .then(d => {
      res.status(200).json(d);
    });
});
app.get('/strip', (req, res) => {
  volgorde
    .find({
      id: 'volgorde'
    })
    .then(volg => {
      images.find({}).then(images => {
        let imagesOpVolgorde = volg[0].volgorde.map(v => images.find(i => i._id.toString() == v));
        res.status(200).json({
          strip: imagesOpVolgorde
        });
      });
    });
});
cloudinary.config({
  cloud_name: 'dictffhrv',
  api_key: 864653742581441,
  api_secret: process.env.API_SECRET_CLOUDINARY
});

app.post('/uploadfile', (req, res) => {
  console.log('upload starting...');

  console.log(req.query);

  upload(req, res, err => {
    if (err) {
      console.log('err1');
      console.log(err);
    } else {
      if (req.file == undefined) {
        console.log('no file???');
      } else {
        // console.log(req.file);

        cloudinary.uploader.upload(req.file.path, function (result) {
          console.log(result);
          let imageData = {
            width: result.width,
            height: result.height,
            url: result.secure_url,
            originalName: result.original_filename,
            name: req.query.name,
            description: req.query.desc
          };

          images.insert(imageData).then(img => {
            volgorde
              .find({
                id: 'volgorde'
              })
              .then(d => {
                console.log(d);

                d[0].volgorde.push(img._id);
                volgorde.update(
                  {
                    id: 'volgorde'
                  },
                  d[0]
                );
                res.status(200).json({
                  imageData
                });
              });
          });
        });
      }
    }
  });
});

app.post('/saveFormData', (req, res) => {
  const token = req.cookies['auth-token'];
  if (!token) {
    res.status(403).send();
  } else {
    client
      .verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      })
      .then(ticket => {
        users
          .find({
            email: ticket.getPayload().email
          })
          .then(emails => {
            if (emails.length === 1) {
          
              fetch(githubApi, {
                method: 'GET',
                headers: {
                  authorization: `Bearer ${githubSecret}`,
                  'Content-Type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(j => {
                  console.log(j);
                  const bodyForGithub = {
                    message: 'update the data',
                    committer: {
                      name: 'Ster der zee site',
                      email: 'comicsterderzee@gmail.com'
                    },
                    sha: j.sha,
                    content: Buffer.from(JSON.stringify(req.body)).toString('base64')
                  };
                    fetch(githubApi, {
                      method: 'PUT',
                      headers: {
                        authorization: `Bearer ${githubSecret}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(bodyForGithub)
                    }).then(res => {
                      console.log(res);
                    });
                });

              res.status(200).json({});
            } else {
              res.status(403).send();
            }
          });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
});
app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));
app.get('*/*', (req, res) => res.render('home'));

app.listen(process.env.PORT || 8083, () => console.log('All is ok, check it on port ' + (process.env.PORT || 8083)));