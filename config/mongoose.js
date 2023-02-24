const mongoose = require('mongoose');
const env = require('./enviroment');
mongoose.connect(`mongodb://localhost/${env.db}`, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
//if any error came it excute
db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

//if once excuted
db.once('open', function() {
    console.log('connected to database ::MongoDB');
});

//make ít usable in other file
module.exports = db;