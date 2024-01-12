const {Op} = require('sequelize');

const add = (req, res) => {
    return res.json({msg: 'success'});
};

const edit = (req, res) => {
    return res.json({msg: 'success'});
};

const del = (req, res) => {
    return res.json({msg: 'success'});
};

const get = (req, res) => {
    return res.json({msg: 'success'});
};

const list = async (req, res) => {
    const {keyword, pageSize, page} = req.query;
    const list = await req.models.Blueprint.findAll({
        where: {
            name: {
                [Op.like]: keyword
            }
        }
    });
    console.log('>>>>>>', list);
    return res.json({code: 0, data: list, msg: 'success'});
};


module.exports = {
    add, edit, del, get, list
};
