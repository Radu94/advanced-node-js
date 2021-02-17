const getSignedUrl = deps => async (userId, key) => {
    const { s3 } = deps;

    const Key = `${userId}/${key}.jpeg`;
    url = s3.getSignedUrl('putObject', {
        Bucket: 'advancednodebucket',
        ContentType: 'image/jpeg',
        Key
    });
    return {Key, url};
}

module.exports = { getSignedUrl }