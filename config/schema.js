const { mongoose } = require('./dbConnection');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {

        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    category: {

        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})


const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    }
})

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true
    },

    userAddress: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true,
        enum: ["Pending", "Verified", "Completed","Cancelled"]
    },
    date: {

        type: Date,
        required: true
    },
    products: [
        {
            productId: {
                type: String,
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            productCategory: {
                type: String,
                required: true
            },
            productPrice: {
                type: Number,
                required: true
            },
            productQuantity: {
                type: Number,
                required: true
            },
            productDescription: {
                type: String,
                required: true
            },
            productUserQuantity: {
                type: Number,
                required: true
            },
        }
    ]
})




const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Order = mongoose.model("Order", orderSchema);
module.exports = { User, Product, Category, Order };