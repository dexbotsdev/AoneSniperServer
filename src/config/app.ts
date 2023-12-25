import parser = require('../helpers/convertor');
export const config = {
    db:"mongodb://127.0.0.1:27017/MultiDexArbitrage?authSource=admin",
    port: parser.parseInt('PORT', 3001),
};

export default config;
