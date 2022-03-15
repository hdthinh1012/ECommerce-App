const Funiture = require("../databases/Funiture");
const Category = require("../databases/Category");
const { all } = require("../routes/session");

const init = async (req, res) => {
    const category1 = new Category({
        name: "Sofa",
    });
    const category2 = new Category({
        name: "Table",
    });
    const category3 = new Category({
        name: "Lamb",
    });
    const category4 = new Category({
        name: "Chair",
    })
    category1.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    category2.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    category3.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    category4.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });

    const item1 = new Funiture({
        name: "Grey Texture Sofa",
        categoryId: category1._id,
        price: "30.00",
        imageUrl: "https://cdn.shopify.com/s/files/1/0258/1394/2371/products/buy-nomad-sofa-online-freedomtree-in-28013910851758_480x.jpg?v=1636223355",
    });
    const item2 = new Funiture({
        name: "Oval Dinner Table",
        categoryId: category2._id,
        price: "20.00",
        imageUrl: "https://cdn.shopify.com/s/files/1/0103/2042/products/them-chair-black-black-piper-pill-pedestal-large-black-white-cl-lr_480x.jpg?v=1619052608",
    });
    const item3 = new Funiture({
        name: "White Living Room Lamb",
        categoryId: category3._id,
        price: "15.00",
        imageUrl: "https://cdn.pixabay.com/photo/2017/08/06/01/49/table-2587598_960_720.jpg",
    });
    const item4 = new Funiture({
        name: "Soft Chair",
        categoryId: category4._id,
        price: "25.00",
        imageUrl: "https://i.pinimg.com/originals/1a/7b/96/1a7b964b2fef36ea8ec4adf9be1b25e6.jpg",
    })
    item1.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    item2.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    item3.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    item4.save((err) => {
        if (err) {
            console.log("Save new funiture err", err);
        }
    });
    res.status(200).send(JSON.stringify({ message: "Init funiture data success" }));
};

const findAll = async (req, res) => {
    console.log("FunitureController.js req.sessionID", req.sessionID);
    try {
        const allFunitures = await Funiture.find({});
        res.status(200).send(JSON.stringify({
            message: "Get all funiture success",
            data: allFunitures
        }));
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    init: init,
    findAll: findAll
}