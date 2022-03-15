const Category = require("../databases/Category");

const findAll = async (req, res) => {
    try {
        const allCategories = await Category.find({});
        res.status(200).send(JSON.stringify({
            message: "Get all categories success",
            data: allCategories
        }));
    } catch (err) {
        console.log(err.message);
    }
}

const findById = async (req, res) => {
    try {
        const category = await Category.find({ _id: req.params.id });
        res.status(200).send(JSON.stringify({
            message: "Get category by id success",
            data: category,
        }))
    }
    catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    findAll: findAll,
    findById: findById,
}