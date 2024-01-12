const {Op} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const add = async (req, res) => {
    const {name, label, description} = Object.assign({}, req.body);
    const newLib = await req.models.Lib.create({id: uuidv4(), name, label, description});
    return res.json({code: 0, data: newLib, msg: 'success'});
};

const list = async (req, res) => {
    const list = await req.models.Lib.findAll({});
    return res.json({
        code: 0, data: {
            pageData: list, totalCount: list.length
        }, msg: 'success'
    });
};


module.exports = {
    add, list
};
