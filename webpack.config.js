const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        upload: './src/upload.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development', // Set mode to development
};