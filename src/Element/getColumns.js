const getColumns = ({showDetail}) => [{
    name: "id", title: "编号", type: "description", primary: true, onClick: showDetail
}, {
    name: "name", title: "名称", type: "mainInfo", onClick: showDetail
}, {
    name: "label", title: "显示名称", type: "mainInfo", onClick: showDetail
}, {
    name: "address", title: "地址", type: "other", ellipsis: true
}, {
    name: 'status', title: "状态", type: 'singleRow', valueOf: (item) => !item.disabledAt ? '启用' : '禁用'
}, {
    name: "description", title: "描述", type: "description",
}];

export default getColumns;
