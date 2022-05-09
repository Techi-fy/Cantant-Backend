const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});
