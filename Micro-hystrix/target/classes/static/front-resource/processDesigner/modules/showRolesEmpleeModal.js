'use strict';
let orgZtree;
let roleTreeManage;
/**
 *
 * @param type 角色或者职员
 * @param checkType 复选/单选框（checkbox/radio）
 * @param callback 回调方法
 */
function showRolesEmplyeeModal(type, checkType, callback, loadedRoleCallback, loadedOrgCallback) {
    let tempHtml = '';
    if (type === '角色') {
        tempHtml = '<div id="roleTree" class="ztree"></div>'
    } else if (type === '职员') {
        tempHtml = '<div id="orgTree" class="ztree"></div>';
    } else {
        tempHtml = '<div><div id="roleTree" class="ztree"></div><div id="orgTree" class="ztree"></div></div>'
    }
    const modalObj = {
        title: '用户组织机构',
        width: 300,
        height: 400
    };
    fnAlertShow(tempHtml, modalObj, function () {
        if (type === '角色') {
            loadRoleTree(checkType, loadedRoleCallback);
        } else if (type === '职员') {
            initOrgTree(checkType, loadedOrgCallback);
        } else {
            loadRoleTree(checkType, loadedRoleCallback);
            initOrgTree(checkType, loadedOrgCallback);
        }
    }, function (index, layero, closeNow) {
        const checkedPersons = [];
        if (type === '角色') {
            const nodes = roleTreeManage.getCheckedNodes(true);
            pushCheckedPersons(checkedPersons, nodes);
        } else if (type === '职员') {
            const nodes = orgZtree.getCheckedNodes(true);
            pushCheckedPersons(checkedPersons, nodes);
        } else {
            const roleNodes = roleTreeManage.getCheckedNodes(true);
            const orgNodes = orgZtree.getCheckedNodes(true);
            pushCheckedPersons(checkedPersons, roleNodes.concat(orgNodes));
        }
        callback && typeof callback === 'function' && callback(checkedPersons, closeNow);
    });
}
function pushCheckedPersons(checkedPersons, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].isParent) {
            checkedPersons.push(arr[i]);
        }
    }
}
/**
 * 初始化组织机构树
 */
function initOrgTree(checkType, callback) {
    let enable = true;
    if (!checkType) {
        enable = false;
    }
    const settings = {
        view: {
            selectedMulti: false,
            autoCancelSelected: false,
            dblClickExpand: false
        },
        check: {
            enable: enable,
            chkStyle: checkType
        },
        data: {
            simpleData: {
                enable: true,
                idKey: 'id',
                pIdKey: 'pId',
                rootPId: ''
            }
        }
    };
    // const url = getBaseUrl() + '/auth/org/query';
    // postRequest(url, getApiPojo(), function (res) {
    //     if (res.code === 0) {
            // const orgTreeData = res.resData.orgTree;
            const orgTreeData = [
              {id: "root", pId: "", name: "组织机构", type: "组织", mobile: null, state: null, hasPhoto: null},
              {id: "admin", pId: "root", name: "系统管理员", type: "职员"},
              {id: "25bf35ee-6d74-4636-a784-d4cff742c889", pId: "root", name: "张三", type: "职员"},
              {id: "25bf3gge-6d74-4636-a784-d4cff742c889", pId: "root", name: "李四", type: "职员"},
            ];
            for (let i = 0; i < orgTreeData.length; i++) {
                if (orgTreeData[i].type === '组织') {
                    orgTreeData[i].iconSkin = 'icon-organization';
                } else if (orgTreeData[i].type === '职员') {
                    orgTreeData[i].iconSkin = 'icon-personnel';
                }
            }
            orgZtree = $.fn.zTree.init($('#orgTree'), settings, orgTreeData);
            const nodes = orgZtree.getNodes();
            orgZtree.expandNode(nodes[0], true, false, true);
            callback && typeof callback === 'function' && callback(orgZtree, nodes)
    //     } else {
    //         fnAlert(res.msg);
    //     }
    // })
}

/**
 * 初始化角色树
 *
 */
function loadRoleTree(checkType, callback) {
    let enable = true;
    if (!checkType) {
        enable = false;
    }
    // 默认没有树的管理权限
    const setting = {
        view: {
            dblClickExpand: false,
            showLine: true,
            selectedMulti: false
        },
        check: {
            enable: enable,
            chkStyle: checkType
        },
        data: {
            simpleData: {
                enable: true,
                idKey: 'id',
                pIdKey: 'pId',
                rootPId: '0'
            }
        }
    };
    // const url = getBaseUrl() + '/auth/role/queryAll';
    // const successCallback = function (res) {
    //     if (res.code === 0) {
            // const sNode = res.resData.roleTree;
            const sNode = [
              {id: "root", pId: "0", name: "角色管理(全局设置)", tId: null, type: "root", state: null, sortnum: null},
              {id: "b7baa8f1-e9fe-43a7-91fe-6cd3a1265d4c", pId: "root", name: "实施人员", tId: null, type: "角色"},
              {id: "b7bcc8f1-e9fe-43a7-91fe-6cd3a1265d4c", pId: "root", name: "测试人员", tId: null, type: "角色"},
              {id: "b7btt8f1-e9fe-43a7-91fe-6cd3a1265d4c", pId: "root", name: "研发人员", tId: null, type: "角色"},
            ];
            if (sNode != null) {
                for (let i = 0; i < sNode.length; i++) {
                    if (sNode[i].type === '角色') {
                        sNode[i].iconSkin = 'icon-role';
                    }
                }
                roleTreeManage = $.fn.zTree.init($('#roleTree'), setting, sNode);
                const nodes = roleTreeManage.getNodes();
                roleTreeManage.expandNode(nodes[0], true, false, true);
                callback && typeof callback === 'function' && callback(roleTreeManage, nodes)
            }
        // } else {
        //     fnTip(res.msg, 2000);
        // }
    // };
    // const errorCallback = function (err) {
    //     fnTip(err.message, 2000);
    // };
    // getRequest(url, getApiPojo(), successCallback, errorCallback);
}
