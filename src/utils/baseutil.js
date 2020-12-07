
import fileDownload from 'js-file-download'
/**
 * 树节点转换为扁平结构
 * @param obj
 * @returns {*}
 */
export function formatTree(obj) {
    let copyedObj = JSON.parse(JSON.stringify(obj)); //深拷贝源数据
    return copyedObj.filter((parent) => {
        let findChildren = copyedObj.filter((child) => {
            return parent.id === child.pid;
        });
        findChildren.length > 0
            ? (parent.children = findChildren)
            : (parent.children = []);
        return parent.pid === "0"; //返回顶层，依据实际情况判断这里的返回值
    });
}


export function getExcel(data,fileName) {
    // res.data 是接口返回的文件流
   // const blob = new Blob([data]);
  fileDownload(data,fileName);
}


