const path = require("path");
const {Op} = require("sequelize");
const request = require('request');
const archiver = require('archiver');
const fs = require('fs');
const tmp = require('tmp');
const pify = require('pify');
const transform = require('lodash/transform');
const merge = require('lodash/merge');
const lodash = require('lodash');

const applyTemplate = require('@kne/apply-template');

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
        const targetArgs = merge({}, transform(element.subElements, (result, value) => {
            result[value.name] = value.args;
        }, {}), args);


        //1. 创建临时目录
        const [tmpdir, cleanup] = await pify(tmp.dir)({unsafeCleanup: true});

        const generateCore = async (element, targetPath = '') => {
            if (element.subElements && element.subElements.length > 0) {
                for (let subElement of element.subElements) {
                    await generateCore(dependenciesMap.get(subElement.type), path.join(targetPath, subElement.name));
                }
            }

            //2. 下载模板文件
            //element.address
            const tempDir = path.join(tmpdir, 'temp', element.name), distDir = path.join(tmpdir, 'dist', targetPath);
            const output = fs.createWriteStream(tempDir);
            await request.get(element.address).pipe(archiver('tar')).pipe(output);

            //3. 执行模板编译
            // targetArgs
            await applyTemplate(tempDir, distDir, {
                args: targetArgs[element.name], subElements: element.subElements, libs: {
                    lodash
                }
            });
        };

        await generateCore(element);

        //4. 取回编译文件，放置到输出目录
        await req.app.config.outputFiles(path.join(tmpdir, 'dist'));

        try {
            cleanup();
        } catch (e) {
        }
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
