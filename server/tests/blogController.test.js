const { getBlogById, getBlogsByUserId, postNewBlog } = require('../controllers/blogController');

describe('tests for blog controller', () => {
  it('should call the blog db dependencies with passed args', async () => {
    const blogMock = { findOne: jest.fn() };
    const blogInstanceMock = { toObject: jest.fn() };
    blogInstanceMock.toObject.mockResolvedValueOnce({});
    blogMock.findOne.mockResolvedValueOnce(blogInstanceMock);

    const s3Mock = { getSignedUrl: jest.fn() };
    s3Mock.getSignedUrl.mockResolvedValueOnce("");

    const spy = jest.spyOn(blogMock, 'findOne');
    const spys3 = jest.spyOn(s3Mock, 'getSignedUrl');

    const deps = { Blog: blogMock, s3: s3Mock };

    await getBlogById(deps)('someId', 'anotherId');

    expect(spy).toHaveBeenCalledWith({ _user: 'someId', _id: 'anotherId' });
    expect(spys3).toHaveBeenCalledWith('getObject', { Bucket: 'advancednodebucket', ResponseContentType: 'image/jpeg', Key: 'someId/undefined.jpeg' });
  });

  it('should call the blog db dependencies and return an array', async () => {
    const blogMock = { find: jest.fn(), cache: jest.fn() };
    blogMock.find.mockReturnThis();
    blogMock.cache.mockResolvedValueOnce([]);

    const spy = jest.spyOn(blogMock, 'find');
    //const spyCache = jest.spyOn(blogMock, 'cache');

    const deps = { Blog: blogMock }

    result = await getBlogsByUserId(deps)('someId');
    expect(spy).toHaveBeenCalledWith({ _user: 'someId' });
    expect(result).toStrictEqual([]);
  });

  it('should return a new blog with the given attributes', async () => {
    class blogMock {
      constructor({ title, content, imguuid, _user }) {
        this.title = title;
        this.content = content;
        this.imguuid = imguuid;
        this._user = _user;
      }
    }
    const deps = { Blog: blogMock }
    result = await postNewBlog(deps)('someTitle', 'someContent', 'someImguuid', 'someId');
    expect(result).toBeInstanceOf(blogMock);
  })
});
