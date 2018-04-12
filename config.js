exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://rmmoll23:hello123@ds125068.mlab.com:25068/meme-generator-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://mollski1:Ronaldo723@ds247648.mlab.com:47648/meme-generator-capstone-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
