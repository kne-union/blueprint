const path = require("path");
const {Op} = require("sequelize");
module.exports = {
    getDetail: (req, res) => async (id) => {
        const currentModel = await req.models.Element.findByPk(id);
        if (!currentModel) {
            throw new Error('数据不存在');
        }

        const dependencies = await req.models.ElementDependencies.findAll({
            include: [req.models.Element], where: {
                elementId: id
            }
        });

        return Object.assign({}, currentModel.get({plain: true}), {dependencies: dependencies.map(({Element}) => Element)});
    }, generate: (req, res) => async ({id, args}) => {
        const element = await req.services.element.getDetail(id);

        const dependenciesMap = new Map(element.dependencies.map((item) => [item.id, item]));
        const generateCore = async (element, targetPath = '') => {
            if (element.subElements && element.subElements.length > 0) {
                for (let subElement of element.subElements) {
                    await generateCore(dependenciesMap.get(subElement.type), path.join(targetPath, subElement.type));
                }
            }
            //1. 下载模板文件
            //element.address
            //2. 创建临时目录
            //3. 获取element参数
            //4. 执行模板编译
            //5. 取回编译文件，放置到输出目录
            //await req.app.config.generateFiles();
        };

        await generateCore(element);
    }, uploadDependencies: (req, res) => async ({id, subElements}) => {
        const elements = await req.models.Element.findAll({
            include: req.models.ElementDependencies, where: {
                id: {
                    [Op.in]: (subElements || []).map(({type}) => type)
                }
            }
        });

        const dependencies = new Set();

        elements.forEach((item) => {
            dependencies.add(item.id);
            item.ElementDependencies.forEach(({dependenceId}) => {
                dependencies.add(dependenceId);
            });
        });

        await req.models.ElementDependencies.destroy({
            where: {
                elementId: id
            }
        });

        await req.models.ElementDependencies.bulkCreate(Array.from(dependencies).map((dependenceId) => ({
            elementId: id, dependenceId
        })));
    }
};
