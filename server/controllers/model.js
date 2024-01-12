const {v4: uuidv4} = require('uuid');
const add = async (req, res) => {
    const {name, label, description, libId, fields} = Object.assign({}, req.body);
    const newModel = await req.models.Model.create({id: uuidv4(), name, label, description, libId, fields});
    return res.json({code: 0, data: newModel, msg: 'success'});
};

const list = async (req, res) => {
    const {libId, perPage, currentPage} = Object.assign({}, {perPage: 20, currentPage: 1}, req.query);
    const list = await req.models.Model.findAll({
        include: [req.models.Lib], where: Object.assign({}, libId ? {
            libId
        } : {})
    });
    return res.json({
        code: 0, data: {
            pageData: list, totalCount: list.length
        }, msg: 'success'
    });
};

const edit = async (req, res) => {
    const {id, ...others} = Object.assign({}, req.body);

    const currentModel = await req.models.Model.findByPk(id);

    if (!currentModel) {
        return res.json({
            code: 500, msg: '数据不存在'
        });
    }

    await req.models.Model.update(others, {
        where: {id}
    });

    return res.json({code: 0, msg: 'success'});
};

const del = async (req, res) => {
    const {id} = Object.assign({}, req.body);

    const currentModel = await req.models.Model.findByPk(id);

    if (!currentModel) {
        return res.json({
            code: 500, msg: '数据不存在'
        });
    }

    currentModel.disabledAt = new Date();

    await currentModel.save();

    return res.json({code: 0, msg: 'success'});
};

const restore = async (req, res) => {
    const {id} = Object.assign({}, req.body);

    const currentModel = await req.models.Model.findByPk(id);

    if (!currentModel) {
        return res.json({
            code: 500, msg: '数据不存在'
        });
    }

    if (!currentModel.disabledAt) {
        return res.json({
            code: 500, msg: '数据以过期，清刷新后重试'
        });
    }

    currentModel.disabledAt = null;

    await currentModel.save();

    return res.json({code: 0, msg: 'success'});
};


module.exports = {
    add, list, edit, del, restore
};
