//import mongoose
const mongoose = require('mongoose');

//import the config module
const config = require('./config');

//import the app module
const app = require('./app');

console.log('connecting to mongodb');

//connect to mongodb
mongoose.connect(config.MONGO_URI)
.then(() => {
    console.log('connected to mongodb');

    //start the server
app.listen(config.PORT, () => {
    console.log(`listening on port ${config.PORT}`);
})

})
.catch((err) => {
    console.log(err.message);
})