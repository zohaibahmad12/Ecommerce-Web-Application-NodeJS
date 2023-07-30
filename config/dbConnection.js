const mongoose = require('mongoose');

const connectionToDatabase = () => {

    mongoose.connect("mongodb://localhost:27017/FashionEcommerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("Database Connection Successful"))
        .catch((err) => console.log(err))

}


module.exports={mongoose,connectionToDatabase};