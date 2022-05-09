const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { fileParser } = require('express-multipart-file-parser');
const { Strategy } = require('passport-jwt');
var multer = require('multer');
var forms = multer();
require('./config/aws.config');
require('./triggers/triggers');
// require('./triggers/contract.triggers');
require('./triggers/cron-job')();
const queryString = require('query-string')
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(express.urlencoded({extended:false}));
app.use(forms.any());
// app.use(
//   fileParser({
//     rawBodyOptions: {
//       limit: '30mb', //file size limit
//     },
//     busboyOptions: {
//       limits: {
//         fields: 50, //Number text fields allowed
//       },
//     },
//   })
// );

app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
//---------------------------------------------------------------ROUGH
const stringifiedParams = queryString.stringify({
  client_id: process.env.APP_ID_GOES_HERE,
  redirect_uri: 'http://localhost:3000/auth/facebook/',
  scope: ['email', 'user_friends'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',
});

const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

//---------------------------------------------------------------DONE-ROUGH

// v1 api routes
app.use('/v1', routes);
app.get('/',(req,res)=>{
  res.send('----WELCOME TO UP4CHANGE----')
})

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
