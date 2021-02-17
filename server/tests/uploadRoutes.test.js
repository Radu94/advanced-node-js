const { getSignedUrl } = require("../controllers/uploadController");

describe('test for upload', () => {
  it('should call the get signed url method', async () => {
    const s3Mock = { getSignedUrl: jest.fn() };
    s3Mock.getSignedUrl.mockResolvedValueOnce("");

    const spy = jest.spyOn(s3Mock, 'getSignedUrl');

    const deps = { s3: s3Mock };

    await getSignedUrl(deps)('someId', 'someKey');

    expect(spy).toHaveBeenCalledWith("putObject", { "Bucket": "advancednodebucket", "ContentType": "image/jpeg", "Key": "someId/someKey.jpeg" });
  })
})