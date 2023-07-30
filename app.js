const express = require('express');
const app = express();

const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(express.static('./public'));
app.set("view engine", "ejs");

const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(cookieParser());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true
    })
);

const { connectionToDatabase } = require('./config/dbConnection');
connectionToDatabase();
const { User, Product, Category, Order } = require('./config/schema');

const bcrypt = require('bcryptjs');





app.get("/signup", (req, res) => {
    res.render("SignupForm", { message: "" });
})



app.post("/signup", async (req, res) => {

    const { name, email, phone, address, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const findEmail = await User.findOne({ email: email });
        const findPhone = await User.findOne({ phone: phone })

        if (findEmail == null && findPhone == null) {

            const newUser = new User({ name, email, phone, address, password: hashedPassword });
            await newUser.save()
            res.render("SignupForm", { message: "Signup Successful" });
        }
        else if (findEmail == null && findPhone != null) {
            res.status(400).render("SignupForm", { message: "Phone# already exist" })
        }
        else if (findEmail != null && findPhone == null) {
            res.status(400).render("SignupForm", { message: "Email already exist" })
        }
        else {
            res.status(400).render("SignupForm", { message: "Email & Phone# already exist" })
        }
    }

    catch (err) {
        console.log(err);
    }


})





app.get("/login", (req, res) => {
    res.render("LoginForm", { message: "" });
})





app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const findEmail = await User.findOne({ email: email })

        if (findEmail == null) {
            res.status(404).render("LoginForm", { message: "Not Exist" });
        }
        else {
            const hashedPassword = findEmail.password
            const ismatched = await bcrypt.compare(password, hashedPassword)


            if (ismatched == true) {
                res.render("LoginForm", { message: "Login Successful" });
            }
            else {
                res.status(401).render("LoginForm", { message: "Incorrect Password" });
            }
        }

    } catch (err) {
        console.log(err)

    };
})




app.get("/admin", (req, res) => {
    res.render("AdminDashboard");
})


app.get("/addNewProduct", async (req, res) => {

    try {

        const allCategories = await Category.find();

        if (req.query.message) {

            res.render("AddNewProduct", { message: req.query.message, allCategories });
        }
        else {

            res.render("AddNewProduct", { message: "", allCategories });
        }

    }
    catch (err) {
        console.log(err);
    }


})



app.post("/addNewProduct", async (req, res) => {

    const { name, category, price, quantity, description } = req.body;

    const newProduct = new Product({ name, category, price, quantity, description });
    try {
        const result = await newProduct.save();


        req.files.file1.mv(__dirname + "/public/images/" + category + " Category/" + result._id + "_1.jpg", () => {

        })
        req.files.file2.mv(__dirname + "/public/images/" + category + " Category/" + result._id + "_2.jpg", () => {

        })

        req.files.file3.mv(__dirname + "/public/images/" + category + " Category/" + result._id + "_3.jpg", () => {

        })

        res.redirect("/addNewProduct?message=Product Added Successfully")
    }
    catch (err) {
        console.log(err);
    }

})






app.get("/addNewCategory", (req, res) => {

    if (req.query.message) {

        res.render("AddNewCategory", { message: req.query.message });
    }
    else {

        res.render("AddNewCategory", { message: "" });
    }

})





app.post("/addNewCategory", async (req, res) => {

    const name = req.body.name;
    try {
        const isAlreadyExist = await Category.findOne({ name: name })

        if (isAlreadyExist == null) {

            const newCategory = new Category({
                name: name
            })

            const result = await newCategory.save();

            await fs.promises.mkdir(__dirname + "/public/images/" + name + " Category");

            req.files.file1.mv(__dirname + "/public/images/" + name + " Category/" + result._id + ".jpg", () => {

            })

            res.redirect(`/addNewCategory?message=Category Added Successfully`)
        }
        else {

            res.redirect(`/addNewCategory?message=Category Already Exist`)

        }
    } catch (err) {
        console.log(err);
    }


})





app.get("/deleteCategory", async (req, res) => {

    try {

        const allCategories = await Category.find();
        if (req.query.message) {

            res.render("DeleteCategory", { message: req.query.message, allCategories });
        }
        else {
            res.render("DeleteCategory", { message: "", allCategories });
        }



    } catch (err) {
        console.log(err);
    }

})





app.get("/deleteSelectedCategory", async (req, res) => {

    try {
        await fs.promises.rmdir(__dirname + "/public/images/" + req.query.categoryName + " Category", { recursive: true });
        await Product.deleteMany({ category: req.query.categoryName })
        await Category.deleteOne({ _id: req.query.categoryId });
        res.redirect(`/deleteCategory?message=Category Deleted Successfully`);
    }
    catch (err) {
        console.log(err);
    }

})





app.get("/deleteProduct", async (req, res) => {

    try {

        const allCategories = await Category.find();
        const allProducts = await Product.find();

        if (req.query.message) {
            res.render("DeleteProduct", { allCategories, allProducts, message: req.query.message })
        }
        else {
            res.render("DeleteProduct", { allCategories, allProducts, message: "" })
        }

    } catch (err) {
        console.log(err);
    }


});




app.get("/deleteSelectedProduct", async (req, res) => {

    try {

        await fs.promises.unlink(__dirname + "/public/images/" + req.query.categoryName + " Category/" + req.query.productId + "_1.jpg");
        await fs.promises.unlink(__dirname + "/public/images/" + req.query.categoryName + " Category/" + req.query.productId + "_2.jpg");
        await fs.promises.unlink(__dirname + "/public/images/" + req.query.categoryName + " Category/" + req.query.productId + "_3.jpg");
        await Product.deleteOne({ _id: req.query.productId });
        res.redirect(`/deleteProduct?message=Product Deleted Successfully`);
    } catch (err) {
        console.log(err);
    }

})






app.get("/viewCategories", async (req, res) => {

    try {
        const allCategories = await Category.find();
        res.render("ViewCategories", { allCategories });
    }
    catch (err) {
        console.log(err);
    }


})






app.get("/viewProducts", async (req, res) => {

    try {
        const allCategories = await Category.find();
        const allProducts = await Product.find();
        res.render("ViewProducts", { allCategories, allProducts });
    }
    catch (err) {
        console.log(err);
    }


})






app.get("/viewSelectedCategory", async (req, res) => {

    try {

        const categoryName = req.query.categoryName;
        const allProducts = await Product.find({ category: categoryName });
        res.render("ViewSelectedCategory", { allProducts, categoryName });
    }
    catch (err) {
        console.log(err);
    }
})






app.get("/viewSelectedProduct", async (req, res) => {

    try {

        const productId = req.query.productId;
        const product = await Product.findOne({ _id: productId });
        res.render("ViewSelectedProduct", product);
    }
    catch (err) {
        console.log(err);
    }


})







app.get("/editCategory", async (req, res) => {

    try {
        const allCategories = await Category.find();
        res.render("editCategory", { allCategories });
    }
    catch (err) {
        console.log(err);
    }

})






app.get("/editCategoryForm", async (req, res) => {

    try {


        const categoryId = req.query.categoryId;
        const category = await Category.findOne({ _id: categoryId })

        if (req.query.message) {

            res.render("EditCategoryForm", { category, message: req.query.message });

        }
        else {

            res.render("EditCategoryForm", { category, message: "" });
        }

    } catch (err) {
        console.log(err);
    }


})









app.post("/editCategoryForm", async (req, res) => {

    const { name, previousName, id } = req.body;
    try {

        if (name == previousName && !req.files) {
            res.redirect(`/editCategoryForm?categoryId=${id}&message=Please Insert New Data`)
        }

        else if (name == previousName && req.files) {

            req.files.file1.mv(__dirname + "/public/images/" + name + " Category/" + id + ".jpg", () => {

            })

            res.redirect(`/editCategoryForm?categoryId=${id}&message=Category Updated Successfully`)
        }

        else if (name != previousName && !req.files) {

            const isAlreadyExist = await Category.findOne({ name: name })

            if (isAlreadyExist == null) {
                await Category.updateOne({ _id: id }, { name: name });
                await Product.updateMany({ category: previousName }, { category: name });
                await fs.promises.rename(__dirname + "/public/images/" + previousName + " Category", __dirname + "/public/images/" + name + " Category");
                res.redirect(`/editCategoryForm?categoryId=${id}&message=Category Updated Successfully`)
            }
            else {
                res.redirect(`/editCategoryForm?categoryId=${id}&message=Category Already Exist`)
            }

        }

        else {

            const isAlreadyExist = await Category.findOne({ name: name })

            if (isAlreadyExist == null) {
                await Category.updateOne({ _id: id }, { name: name });
                await Product.updateMany({ category: previousName }, { category: name });
                await fs.promises.rename(__dirname + "/public/images/" + previousName + " Category", __dirname + "/public/images/" + name + " Category");
                req.files.file1.mv(__dirname + "/public/images/" + name + " Category/" + id + ".jpg", () => {

                })
                res.redirect(`/editCategoryForm?categoryId=${id}&message=Category Updated Successfully`)
            }
            else {
                res.redirect(`/editCategoryForm?categoryId=${id}&message=Category Already Exist`)
            }

        }
    } catch (err) {
        console.log(err);
    }


})








app.get("/editProduct", async (req, res) => {

    try {
        const allCategories = await Category.find();
        const allProducts = await Product.find();
        res.render("EditProduct", { allCategories, allProducts });
    }
    catch (err) {
        console.log(err);
    }


})






app.get("/editSelectedProduct", async (req, res) => {

    try {

        const productId = req.query.productId;
        const product = await Product.findOne({ _id: productId });
        res.render("editSelectedProduct", product);
    }
    catch (err) {
        console.log(err);
    }


})







app.get("/editProductForm", async (req, res) => {

    try {


        const productId = req.query.productId;
        const product = await Product.findOne({ _id: productId });
        const allCategories = await Category.find();

        if (req.query.message) {

            res.render("EditProductForm", { allCategories, product, message: req.query.message });

        }
        else {

            res.render("EditProductForm", { allCategories, product, message: "" });
        }

    } catch (err) {
        console.log(err);
    }


})







app.post("/editProductForm", async (req, res) => {

    const { name, category, price, quantity, description, productId } = req.body;

    try {
        const existingProduct = await Product.findOne({ _id: productId });

        if (name == existingProduct.name && category == existingProduct.category && price == existingProduct.price
            && quantity == existingProduct.quantity && description == existingProduct.description && !req.files) {

            res.redirect(`/editProductForm?productId=${productId}&message=Please Insert New Data`)
        }
        else if (!req.files) {

            await Product.updateOne({ _id: existingProduct._id }, {
                name, category, price, quantity, description
            })
            if (category != existingProduct.category) {

                await fs.promises.rename(__dirname + "/public/images/" + existingProduct.category + " Category/" + productId + "_1.jpg", __dirname + "/public/images/" + category + " Category/" + productId + "_1.jpg");
                await fs.promises.rename(__dirname + "/public/images/" + existingProduct.category + " Category/" + productId + "_2.jpg", __dirname + "/public/images/" + category + " Category/" + productId + "_2.jpg");
                await fs.promises.rename(__dirname + "/public/images/" + existingProduct.category + " Category/" + productId + "_3.jpg", __dirname + "/public/images/" + category + " Category/" + productId + "_3.jpg");

            }

            res.redirect(`/editProductForm?productId=${productId}&message=Product Updated Successfully`)
        }

        else if (req.files) {

            await Product.updateOne({ _id: existingProduct._id }, {
                name, category, price, quantity, description
            })

            if (category != existingProduct.category) {
                await fs.promises.unlink(__dirname + "/public/images/" + existingProduct.category + " Category/" + existingProduct._id + "_1.jpg");
                await fs.promises.unlink(__dirname + "/public/images/" + existingProduct.category + " Category/" + existingProduct._id + "_2.jpg");
                await fs.promises.unlink(__dirname + "/public/images/" + existingProduct.category + " Category/" + existingProduct._id + "_3.jpg");
            }
            req.files.file1.mv(__dirname + "/public/images/" + category + " Category/" + productId + "_1.jpg", () => {

            })
            req.files.file2.mv(__dirname + "/public/images/" + category + " Category/" + productId + "_2.jpg", () => {

            })

            req.files.file3.mv(__dirname + "/public/images/" + category + " Category/" + productId + "_3.jpg", () => {

            })

            res.redirect(`/editProductForm?productId=${productId}&message=Product Updated Successfully`);


        }

    } catch (err) {
        console.log(err);
    }

})









app.get("/pendingOrders", async (req, res) => {

    try {
        if (req.query.searchQuery) {

            const searchQuery = JSON.parse(req.query.searchQuery);
            const allOrders = await Order.find(searchQuery).sort({ date: -1 }); //date in descending order
            res.render("PendingOrders", { allOrders, searchQuery });
        }
        else {
            const allOrders = await Order.find({ status: "Pending" }).sort({ date: -1 });
            res.render("PendingOrders", { allOrders });
        }



    } catch (error) {
        console.log(error);
    }


})




app.post("/pendingOrdersSearchFilter", async (req, res) => {

    const { orderNumber, userEmail } = req.body;


    const query = {};

    if (orderNumber) query._id = orderNumber;
    if (userEmail) query.userEmail = userEmail;


    stringQuery = JSON.stringify(query);
    res.redirect(`/pendingOrders?searchQuery=${stringQuery}`);
})








app.get("/viewSelectedPendingOrder", async (req, res) => {

    const orderId = req.query.orderId;

    const order = await Order.findOne({ _id: orderId });

    res.render("viewSelectedPendingOrder", { order });


})









app.get("/approvePendingOrder",async(req,res)=>{

    const orderId=req.query.orderId;

    try {
        await Order.updateOne({_id:orderId},{status:"Verified"})
        res.redirect("/adminMessage?message=Order Verified")
    } catch (err) {
        console.log(err);
    }
})



app.get("/cancelPendingOrder",async(req,res)=>{

    const orderId=req.query.orderId;

    try {
        await Order.updateOne({_id:orderId},{status:"Cancelled"})
        res.redirect("/adminMessage?message=Order Cancelled")
    } catch (err) {
        console.log(err);
    }
})





app.get("/adminMessage",(req,res)=>{

    console.log(req.query.message);
    res.render("adminMessage",{message:req.query.message});
})




// Customer Routes


app.get("/", async (req, res) => {

    const allCategories = await Category.find();
    const allProducts = await Product.find();
    res.render("customer/HomePage", { allCategories, allProducts })

})





app.get("/showAllProducts", async (req, res) => {

    const categoryName = req.query.categoryName;
    const allProducts = await Product.find({ category: categoryName });
    res.render("customer/AllProducts", { allProducts, categoryName });
})






app.get("/showProductDetails", async (req, res) => {

    const productId = req.query.productId;
    const product = await Product.findOne({ _id: productId });
    res.render("customer/ProductDetails", { product });
})





app.get("/addToCart", async (req, res) => {

    const productId = req.query.productId;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    let isAlreadyExist = false;

    if ((req.session.cart).length > 0) {

        for (const product of req.session.cart) {

            if (product.productId == productId) {
                isAlreadyExist = true;
                res.redirect("/message?message=productAlreadyExistInCart");

            }
        }
    }


    if (isAlreadyExist == false) {

        const product = await Product.findOne({ _id: productId });

        const newProduct = {
            productId: product._id,
            productName: product.name,
            productCategory: product.category,
            productPrice: product.price,
            productQuantity: product.quantity,
            productDescription: product.description,
            productUserQuantity: 1
        }
        req.session.cart.push(newProduct);
        res.redirect("/message?message=cart");
    }

})






app.get("/myCart", async (req, res) => {


    res.render("customer/Cart", { allProducts: req.session.cart });

})




app.post("/updateProductQuantity", (req, res) => {

    let { productId, quantity } = req.query;


    for (const product of req.session.cart) {

        if (product.productId == productId) {
            product.productUserQuantity = Number(quantity);
        }
    }

    res.json({ message: "Quantity Updated Successfully" })

})




app.get("/removeCartItem", (req, res) => {

    const productId = req.query.productId;


    for (let i = 0; i < (req.session.cart).length; i++) {

        if (req.session.cart[i].productId == productId) {

            (req.session.cart).splice(i, 1);
        }

    }

    res.redirect("/myCart");

})





app.get("/placeOrder", async (req, res) => {


    let updatedQuantity;

    for (const product of req.session.cart) {

        updatedQuantity = product.productQuantity - product.productUserQuantity;
        await Product.updateOne({ _id: product.productId }, { quantity: updatedQuantity });
    }



    const order = new Order({

        userId: "64aafaba465fb28476a0cb6e",
        userName: "Zohaib Ahmad",
        userEmail: "zohaibsattar472@gmail.com",
        userPhone: "+923014284128",
        userAddress:"Ali Town, Orange Line Station, Lahore",
        status: "Pending",
        date: new Date(),
        products: req.session.cart
    })
    await order.save();
    req.session.cart = [];

    res.redirect("/message?message=order");
})






app.get("/myOrders", async (req, res) => {

    const allOrders = await Order.find({ userId: "64aafaba465fb28476a0cb6e" });
    res.render("customer/MyOrders", { allOrders })
})





app.get("/message", (req, res) => {

    res.render("customer/Message", { message: req.query.message })
})





app.get("/*", (req, res) => {
    res.status(404).send("<h1>OOOPS!! Page Not Found</h1>")
})





app.listen(7000, () => {
    console.log("Server started at port 7000");
})
