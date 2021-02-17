const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');
const uuid = require('uuid/v1');
const { getBlogById, getBlogsByUserId, postNewBlog } = require('../controllers/blogController');

const { accessKeyId, secretAccessKey } = require('../config/keys');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2'
});


const Blog = mongoose.model('Blog');
module.exports = (app) => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blogObject = await getBlogById({ Blog, s3 })(req.user.id, req.params.id);
    res.send(blogObject);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await getBlogsByUserId({Blog})(req.user.id);
    res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
    const { title, content } = req.body;
    imguuid = uuid();
    const blog = await postNewBlog({Blog})(title, content, imguuid, req.user.id);

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
