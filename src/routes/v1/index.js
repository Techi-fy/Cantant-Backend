const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const generalRoute = require('./general.route');
const bankRoute = require('./bank.route');
const transactionRoute = require('./transaction.route');


const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/general',
    route: generalRoute,
  },
  {
    path: '/bank',
    route: bankRoute,
  },
  {
    path: '/transaction',
    route: transactionRoute,
  },
  
  ];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;