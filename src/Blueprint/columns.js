const columns = [{
    name: "serialNumber", title: "编号", type: "serialNumber", primary: true,
}, {
    name: "title", title: "标题", type: "mainInfo",
}, {
    name: "description", title: '描述', type: "description"
}, {
    name: "createdAt", title: "添加时间", type: "datetime"
}, {
    name: "updatedAt", title: "修改时间", type: "datetime"
}];

export default columns;
