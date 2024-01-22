const {v4: uuidv4} = require('uuid');
const {Op} = require('sequelize');
const groupBy = require('lodash/groupBy');

const add = async (req, res) => {
    const {name, label, address, description, subElements, args, apis} = Object.assign({}, req.body);

    const id = uuidv4();

    const newModel = await req.models.Element.create({
        id, name, label, address, description, args, subElements, apis
    });

    await req.services.element.uploadDependencies({id, subElements});

    return res.json({code: 0, data: newModel, msg: 'success'});
};

const get = async (req, res) => {
    const {id} = Object.assign({}, req.query);

    return res.json({
        code: 0, data: await req.services.element.getDetail(id)
    });
};

const list = async (req, res) => {
    const {perPage, currentPage, disabled, dependencies, keyword} = Object.assign({}, {
        perPage: 20, currentPage: 1
    }, req.query);

    const filter = {};

    if (disabled === 'open') {
        filter['disabledAt'] = {
            [Op.is]: null
        };
    }

    if (disabled === 'close') {
        filter['disabledAt'] = {
            [Op.not]: null
        };
    }

    if (dependencies && dependencies.length > 0) {
        const list = await req.models.ElementDependencies.findAll({
            where: {
                dependenceId: {
                    [Op.or]: dependencies
                }
            }
        });

        const groupValue = groupBy(list, 'elementId');

        const elementIds = Object.keys(groupValue).filter((elementId) => dependencies.every((item) => !!groupValue[elementId].find(({dependenceId}) => dependenceId === item)));

        filter['id'] = {
            [Op.in]: elementIds
        };
    }

    if (keyword) {
        filter[Op.or] = [{
            name: {
                [Op.like]: `%${keyword}%`
            }
        }, {
            label: {
                [Op.like]: `%${keyword}%`
            }
        }, {
            id: {
                [Op.like]: `%${keyword}%`
            }
        }, {
            address: {
                [Op.like]: `%${keyword}%`
            }
        }, {
            description: {
                [Op.like]: `%${keyword}%`
            }
        }];
    }

    const offset = (currentPage - 1) * perPage;

    const {count, rows: list} = await req.models.Element.findAndCountAll({
        where: filter, offset: offset, limit: parseInt(perPage)
    });

    const elementDependencies = await req.models.ElementDependencies.findAll({
        where: {
            elementId: {
                [Op.in]: list.map((item) => item.id)
            }
        }
    });

    return res.json({
        code: 0, data: {
            pageData: list.map((item) => Object.assign({}, item.get({plain: true}), {
                dependencies: elementDependencies.filter((dependencies) => dependencies.elementId === item.id).map(({dependenceId}) => dependenceId)
            })), totalCount: count
        }, msg: 'success'
    });
};

const edit = async (req, res) => {
    const {id, ...others} = Object.assign({}, req.body);

    const currentModel = await req.models.Element.findByPk(id);

    if (!currentModel) {
        return res.json({
            code: 500, msg: '数据不存在'
        });
    }

    //如果已经有元素依赖它不允许修改

    const dependenciesCount = await req.models.ElementDependencies.count({
        where: {dependenceId: id}
    });

    if (dependenciesCount > 0) {
        return res.json({
            code: 500, msg: '该元素已经被别的元素依赖，不允许修改，请复制后进行修改'
        });
    }


    await req.models.Element.update(Object.assign({}, others), {
        where: {id}
    });

    //修改所有依赖它的element的依赖项

    await req.services.element.uploadDependencies({id, subElements: others.subElements});

    return res.json({code: 0, msg: 'success'});
};

const del = async (req, res) => {
    const {id} = Object.assign({}, req.body);

    const currentModel = await req.models.Element.findByPk(id);

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

    const currentModel = await req.models.Element.findByPk(id);

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

const generate = async (req, res) => {
    const {id, args} = Object.assign({}, req.body);
    await req.services.element.generate({id, args});
    return res.json({code: 0, msg: 'success'});
};


module.exports = {
    add, get, list, edit, del, restore, generate
};
