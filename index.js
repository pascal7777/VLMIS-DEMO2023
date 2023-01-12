if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')


const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const userRoutes = require('./routes/users');
const siteRoutes = require('./routes/sites');
const productRoutes = require('./routes/products');
const commentRoutes = require('./routes/comments');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/vlmis';
const secret = process.env.SECRET || 'squirrel';

const MongoStore = require('connect-mongo');

// local db connect: 
// mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
// Mongo Atlas connect
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
// app.use('/sites', siteRoutes);
// app.use('/products', productRoutes);

// app.use(cookieParser());

const store =  MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
}
});

store.on("error", function(e){
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    name: 'vientiane',
    secret,
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
  
// const scriptSrcUrls = [
 
//     'https://stackpath.bootstrapcdn.com/',
//     'https://api.tiles.mapbox.com/',
//     'https://api.mapbox.com/',
//     'https://kit.fontawesome.com/',
//     'https://cdnjs.cloudflare.com/',
//     'https://cdn.jsdelivr.net/'
//   ];
//   const styleSrcUrls = [
//     'https://kit-free.fontawesome.com/',
//     'https://stackpath.bootstrapcdn.com/',
//     'https://api.mapbox.com/',
//     'https://api.tiles.mapbox.com/',
//     'https://fonts.googleapis.com/',
//     'https://use.fontawesome.com/',
//     'https://cdn.jsdelivr.net/',
//     'https://ichef.bbci.co.uk/'  // I had to add this item to the array 
//   ];
//   const connectSrcUrls = [
//     'https://api.mapbox.com/',
//     'https://a.tiles.mapbox.com/',
//     'https://b.tiles.mapbox.com/',
//     'https://events.mapbox.com/',
    
//   ];
//   const fontSrcUrls = [];
//   app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: [],
//         connectSrc: ["'self'", ...connectSrcUrls],
//         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//         workerSrc: ["'self'", 'blob:'],
//         objectSrc: [],
//         imgSrc: [
//           "'self'",
//           'blob:',
//           'data:',
//           'https://res.cloudinary.com/duwph1blp/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//           'https://images.unsplash.com/',
          
//         ],
//         fontSrc: ["'self'", ...fontSrcUrls]
//       }
//     })
//   );



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/sites', siteRoutes)
app.use('/products', productRoutes)
app.use('/products/:id/comments', commentRoutes)


app.locals.moment = require('moment');

app.get('/', catchAsync(async (req, res) => {
    res.render('home2')
}))


// ++++flash messages++++





// ++++Product Stock Routes++++
// app.get('/products', async (req, res) => {
//     const products = await Product.find({})
//     res.render('products/index', { products })
// })


// ++++ Error handling ++++

app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Ahum,... something went wrong'
    res.status(statusCode).render('error', { err })
})



// +++++ listening +++++

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listens on Port ${PORT}`)
})


// app.listen(3000, () => {
//     console.log("APP IS LISTENING ON PORT 3000!")
// })