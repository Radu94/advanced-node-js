const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const requireLogin = require('../middlewares/requireLogin');
const { accessKeyId, secretAccessKey } = require('../config/keys');
const {getSignedUrl} = require("../controllers/uploadController");

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2'
});

module.exports = (app) => {
  app.get('/api/upload', requireLogin, async (req, res) => {
    const {Key, url} = await getSignedUrl({s3})(req.user.id, req.query.Key);
    res.send({ Key, url });
  });
};
