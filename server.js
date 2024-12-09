
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');

const addWishlistCount = require('./middleware/addWhishlistCount');
app.use(addWishlistCount);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride('_method'));

const connectDB = require('./config/connectionDb');
connectDB();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

const session = require('express-session')
app.use(session({
      secret: process.env.ACCESS_TOKEN_SECRET, // Replace with a strong secret key
      resave: false, // Prevents unnecessary session resaving
      saveUninitialized: true, // Saves uninitialized sessions
      cookie: {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
          expires: new Date(Date.now() +  60 * 1000) // 1 min
      },
  })
);

console.log(`App is running in ${process.env.NODE_ENV || 'production'} mode`);

let signupRouter = require('./routes/signup');
let loginRouter = require('./routes/login');
let forgetRouter = require('./routes/forget');
let otpRouter = require('./routes/otp');
let resetRouter = require('./routes/resetPassword');

const beginRoute = require('./routes/beginRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const homeRoutes = require('./routes/homeRoutes');

app.use('/signuser', signupRouter);
app.use('/loginuser', loginRouter);
app.use('/forget', forgetRouter);
app.use('/otp_no', otpRouter);
app.use('/resetPassword', resetRouter);

app.use('/start', beginRoute);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/home', homeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
