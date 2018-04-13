exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://ryan5:solomon@ds017193.mlab.com:17193/travel-planner-full-stack-capstone';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
