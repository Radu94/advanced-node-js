
const getBlogById = deps => async (userId, blogId) => {
  const { Blog, s3 } = deps;

  const blog = await Blog.findOne({
    _user: userId,
    _id: blogId
  });

  const key = `${userId}/${blog.imguuid}.jpeg`;
  const params = {
    Bucket: 'advancednodebucket',
    ResponseContentType: 'image/jpeg',
    Key: key
  };
  const signedUrl = s3.getSignedUrl('getObject', params);
  const blogObj = blog.toObject();
  blogObj.signedUrl = signedUrl;

  return blogObj;
};

const getBlogsByUserId = deps => async (userId) => {
  const { Blog } = deps;

  const blogs = await Blog
    .find({ _user: userId })
    .cache({ key: userId });
    return blogs;
}

const postNewBlog = deps => async (title, content, imguuid, userId) => {
  const { Blog } = deps;
  const blog = new Blog({
    title,
    content,
    imguuid,
    _user: userId
  });
  return blog;
}

module.exports = { getBlogById, getBlogsByUserId, postNewBlog };
