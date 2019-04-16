/**
 * 流程活动数组
 * 默认为空，每次打开活动属性框时压入当前活动
 * 流程模版保存时，统一入库（入库规则，仅限当前活动数组内数据，其他数据不做改变）
 */

const table = layui.table;
let m_bInDatabase = true; // 流程活动是否在数据库中有记录

let m_activityId = ''; // 当前流程活动编号

// let m_activityProp = {}; //当前流程活动属性
// let m_activityCandidates = []; //当前流程活动候选参与者
// let m_activityApplications = []; //当前流程活动应用程序
// let m_activityParameters = []; //当前流程活动参数
// let m_activityListeners = []; //当前流程活动事件监听

function openActivityProperty(activityId) {
    // 设置活动编号
    m_activityId = activityId;
    const strHtml = initActivityPanel();

    const objModal = {
        'title': '活动属性',
        'modalIndex': -20000,
        'needQ': true,
        'width': 748,
        'height': 475
    };

    fnAlertShow(strHtml, objModal, function() {
        // 下拉框重新渲染
        renderSelect2('[lay-filter="fnAlertShowFilter"]');

        const task = workflow.getFigure(activityId);

        // 加载活动相关信息
        loadActivityData(activityId, task);
    }, function(modelIndex, layerObj, closeNow) {
        m_needSave = true;
        saveActAttr(function() {
            // saveRiskPoint('活动', activityId, m_processId, function () {
                fnTip('活动属性保存成功', 2000);
                closeNow();
            // });
        });
    }, null, null, function() {
        const table = layui.table;
        table.reload('userAuthTable', {
            height: $('#panelContent').height() - 53,
            width: $('#panelContent').width()
        });
        table.reload('actAppTable', {
            height: $('#panelContent').height() - 53,
            width: $('#panelContent').width()
        });
        table.reload('paramTable', {
            height: $('#panelContent').height() - 53,
            width: $('#panelContent').width()
        });
        table.reload('listenPlugInTable', {
            height: $('#panelContent').height() - 53,
            width: $('#panelContent').width()
        });
    });
}

/**
 * 加载指定活动数据
 * @param activityId 指定活动ID
 * @param task
 * @returns
 */
function loadActivityData(activityId, task) {
    let m_currActivity = {
        activityId: activityId,
        processId: m_processId,
        activityProperty: null,
        candidates: [],
        applications: [],
        parameters: [],
        listeners: []
    };

    let iIndex = -1;
    for (let i = 0; i < m_activities.length; i++) {
        if (m_activities[i].activityId === activityId) {
            iIndex = i;
            break;
        }
    }

    if (iIndex < 0) {
        // 从数据库获取数据，填充当前活动对象
        m_activities.push(m_currActivity);
    } else {
        m_currActivity = m_activities[iIndex];
    }

    // 加载活动属性数据
    loadActivityAttr(activityId, m_currActivity.activityProperty);

    // 加载活动授权参与者
    loadActUserAuth(task, activityId, m_currActivity.candidates);

    // // 加载活动配置的应用程序
    // loadActApps(activityId, m_currActivity.applications);

    // // 加载活动配置的参数
    // loadActParams(activityId, m_currActivity.parameters);

    // // 加载活动的监听事件配置
    // loadActListenPlugIn(activityId, m_currActivity.listeners);

    // 切换到应用程序tab时，重新加载table，防止表格变形
    let isRenderRiskPoint = false;
    layui.element.on('tab(actPanel)', function(data) {
        if (data.index === 2) {
            const applicationList = table.cache['actAppTable'];
            table.reload('actAppTable', {
                data: applicationList,
                limit: applicationList.length
            });
        } else if (data.index === 4) {
            const listenerPlugInList = table.cache['listenPlugInTable'];
            table.reload('listenPlugInTable', {
                data: listenerPlugInList,
                limit: listenerPlugInList.length
            });
        } else if (data.index === 5) {
            // 加载活动风险配置
            if (!isRenderRiskPoint) {
                renderRiskPoint('活动', activityId);
                isRenderRiskPoint = true;
                return;
            }
            if ($('.risk-table div[lay-id="riskPointTimeControl"]').length > 0) {
                const riskPointTimeTableData = table.cache['riskPointTimeControl'];
                table.reload('riskPointTimeControl', {
                    data: riskPointTimeTableData
                });
            }
            if ($('.risk-table div[lay-id="riskPointUserControl"]').length > 0) {
                const riskPointUserTableData = table.cache['riskPointUserControl'];
                table.reload('riskPointUserControl', {
                    data: riskPointUserTableData
                });
            }
            if ($('.risk-table div[lay-id="exceptionOperationControl"]').length > 0) {
                const exceptionOperationTableData = table.cache['exceptionOperationControl'];
                table.reload('exceptionOperationControl', {
                    data: exceptionOperationTableData
                });
            }
            if ($('.risk-table div[lay-id="flowVarsRiskPointControl"]').length > 0) {
                const flowVarsRiskPointTableData = table.cache['flowVarsRiskPointControl'];
                table.reload('flowVarsRiskPointControl', {
                    data: flowVarsRiskPointTableData
                });
            }
        }
    });

    // 选择参与者
    $('#btnUserSelect').click(function () {
        addActUserAuth(task);
    });
    // 删除参与者
    $('#btnUserDelete').click(function () {
        deleteActUserAuth(task);
    });
    // 参与者拷入
    $('#btnUserCopyInto').click(function () {
        showCopyIntoOutPopup(activityId, '参与者', true);
    });
    // 参与者拷出
    $('#btnUserCopyOut').click(function () {
        showCopyIntoOutPopup(activityId, '参与者', true, true);
    });
    // 添加应用程序配置
    $('#btnAddApp').click(function () {
        addOrEditActApp(true);
    });
    // 删除应用程序配置
    $('#btnDeleteApp').click(function () {
        deleteActApp();
    });
    // 应用程序拷入
    $('#btnAppCopyInto').click(function () {
        showCopyIntoOutPopup(activityId, '应用程序', true);
    });
    // 应用程序拷出
    $('#btnAppCopyOut').click(function () {
        showCopyIntoOutPopup(activityId, '应用程序', true, true);
    });
    // 添加参数
    $('#btnAddParam').click(function () {
        addOrEditActParam(true);
    });
    // 删除参数
    $('#btnDeleteParam').click(function () {
        deleteActParam();
    });
    // 参数拷入
    $('#btnParamCopyInto').click(function () {
        showCopyIntoOutPopup(activityId, '参数', true);
    });
    // 参数拷出
    $('#btnParamCopyOut').click(function () {
        showCopyIntoOutPopup(activityId, '参数', true, true);
    });
    // 添加事件监听配置
    $('#btnAddListenPlugIn').click(function () {
        addOrEditActListenPlugIn(true);
    });
    // 删除事件监听配置
    $('#btnDeleteListenPlugIn').click(function () {
        deleteActListenPlugIn();
    });
    // 事件监听拷入
    $('#btnPlugInCopyInto').click(function () {
        showCopyIntoOutPopup('事件监听', true);
    });
    // 事件监听拷出
    $('#btnPlugInCopyOut').click(function () {
        showCopyIntoOutPopup('事件监听', true, true);
    });
}

/**
 * 加载活动属性数据
 */
function loadActivityAttr(activityId, activityProperty) {
    $('#activityId').val(activityId).attr('disabled', true);
    
    // const strUrl = getBaseUrl() + '/bpm/activity/property/get';
    // const resquestData = getApiPojo();
    // resquestData.activityId = activityId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            m_bInDatabase = true;

            const actprop = {}; // res.resData.activityProperty;
            // ------------------------演示专用开始------------------------------//
            const $activity = $(stringToXml($('#descriptorarea').val())).find('#' + activityId);
            actprop.activityName = $activity.attr('name')
            // ------------------------演示专用结束------------------------------//
            let actLimit = 0 // actprop.activityLimit;
            if (actLimit < 0) {
                actLimit = Math.abs(actLimit);
                actprop.workdateType = '所有日';
            } else {
                actprop.workdateType = '工作日';
            }

            // 将办理期限转化为xx天xx时xx分的形式
            const limitDay = parseInt(actLimit / (60 * 24), 10);
            const limitHour = parseInt(actLimit % (60 * 24) / 60, 10);
            const limitMinute = parseInt(actLimit, 10) % (60 * 24) % 60;
            if (limitDay !== 0) {
                actprop.limitDay = limitDay;
            }
            actprop.limitHour = limitHour < 10 ? ('0' + limitHour) : limitHour;
            actprop.limitMinute = limitMinute < 10 ? ('0' + limitMinute) : limitMinute;

            actprop.activityName = XMLDecode(actprop.activityName);
            actprop.activityCategory = XMLDecode(actprop.activityCategory);
            actprop.activityGatestate = XMLDecode(actprop.activityGatestate);
            actprop.activityNote = XMLDecode(actprop.activityNote);
            layui.form.val('attrForm', actprop);
            actprop.activityName = XMLEncode(actprop.activityName);
            actprop.activityCategory = XMLEncode(actprop.activityCategory);
            actprop.activityGatestate = XMLEncode(actprop.activityGatestate);
            actprop.activityNote = XMLEncode(actprop.activityNote);

            // select2赋值渲染
            $('#workdateType').val(actprop.workdateType).trigger('change');
            $('#activityExepolicy').val(actprop.activityExepolicy).trigger('change');
            $('#activityIncondition').val(actprop.activityIncondition).trigger('change');
            $('#activityOutcondition').val(actprop.activityOutcondition).trigger('change');
            $('#activityFlowctrl').val(actprop.activityFlowctrl).trigger('change');
            $('#activityFormctrl').val(actprop.activityFormctrl).trigger('change');
            $('#activityExectrl').val(actprop.activityExectrl).trigger('change');
            $('#activityFormpolicy').val(actprop.activityFormpolicy).trigger('change');
    //     } else {
    //         m_bInDatabase = false;
    //     }
    // }, null, true);
}

/**
 * 保存活动属性数据
 */
function saveActAttr(_callBack) {
    const paramsObj = getFormAttrData('attrForm');
    let limitData;
    let tmpCheckLimit = '';
    // 办理期限xx天xx时xx分转化为分钟数
    // const day = $('#limitDay').val();
    // const hour = $('#limitHour').val();
    // const minute = $('#limitMinute').val();
    // if (day === '') {
    //     limitData = parseInt(hour, 10) * 60 + parseInt(minute, 10);
    // } else {
    //     if (!onlyNum(day)) {
    //         tmpCheckLimit = '非整数';
    //     }
    //     limitData = parseInt(day, 10) * (24 * 60) + parseInt(hour, 10) * 60 + parseInt(minute, 10);
    // }
    // paramsObj.activityLimit = limitData;
    // if (paramsObj.workdateType === '所有日') {
    //     paramsObj.activityLimit = -limitData;
    // }
    paramsObj.processId = m_processId;

    const objActivityAttr = getActivityAttrObj();
    for (let i = 0; i < objActivityAttr.length; i++) {
        objActivityAttr[i].data = paramsObj[objActivityAttr[i].id];
    }
    // objActivityAttr.push({
    //     name: '执行期限天数',
    //     type: 'text',
    //     dataType: 'number',
    //     data: tmpCheckLimit,
    //     id: 'tmpCheckLimit'
    // });
    if (checkInputRight(objActivityAttr)) {
        // // 保存数据
        // let strUrl = getBaseUrl() + '/bpm/activity/property/update';
        // if (!m_bInDatabase) {
        //     strUrl = getBaseUrl() + '/bpm/activity/property/add';
        // }
        // const resquestData = getApiPojo();
        // resquestData.data = paramsObj;
        // postRequest(strUrl, resquestData, function (res) {
        //     if (res.code === 0) {
                const task = workflow.getFigure(paramsObj.activityId);
                task.taskName = paramsObj.activityName;
                task.documentation = paramsObj.activityNote;
                task.setContent(XMLDecode(paramsObj.activityName));

                // if (paramsObj.activityExepolicy === '平行会签模式') {
                //     task.isUseExpression = true;
                //     task.performerType = 'assignee';
                //     task.expression = '${' + paramsObj.activityId.replace(/-/g, '_') + '_assignee}';
                //     task.task_extend = 'false'; // 并联模式
                // } else if (paramsObj.activityExepolicy === '自动分派模式' || paramsObj.activityExepolicy === '流程创建者' || paramsObj.activityExepolicy === '上步活动执行者') {
                //     task.isUseExpression = true;
                //     task.performerType = 'assignee';
                //     task.expression = '${' + paramsObj.activityId.replace(/-/g, '_') + '_assignee}';
                //     task.task_extend = '';
                // } else { // 共享工作模式
                //     task.isUseExpression = false;
                //     task.performerType = '';
                //     task.expression = '';
                //     task.task_extend = '';
                // }
                // ------------------------演示专用开始------------------------------//
                if (workflow) {
                    $('#descriptorarea').val(workflow.toXML());
                }
                // ------------------------演示专用結束------------------------------//
                _callBack()
        //     } else {
        //         fnTip(res.msg, 2000);
        //     }
        // }, null, true);
    }
}

/**
 * 加载活动授权参与者
 * @param task 活动对象
 */
function loadActUserAuth(task) {
    // 加载表格
    const height = $('#panelContent').height() - 53;
    table.render({
        elem: '#userAuthTable',
        id: 'userAuthTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '序号', align: 'center', width: 45 },
            { field: 'candidateName', align: 'center', title: '名称' },
            { field: 'candidateType', align: 'center', title: '类别' },
            { field: 'candidatePolicy', align: 'center', title: '参与方式' }
        ]]
    });
    // 查询数据
    getActAuthData(task);
}

/**
 * 查询数据库数据
 * @param task 活动对象
 */
function getActAuthData(task) {
    // const strUrl = getBaseUrl() + '/bpm/activity/candidate/get';
    // const resquestData = getApiPojo();
    // resquestData.activityId = m_activityId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            const candidateList = []; // res.resData.candidateList;
            // ------------------------演示专用开始------------------------------//
            const all = [
              {candidateId: "b7baa8f1-e9fe-43a7-91fe-6cd3a1265d4c", candidatePolicy: "主办", candidateName: "实施人员", candidateType: "角色"},
              {candidateId: "b7bcc8f1-e9fe-43a7-91fe-6cd3a1265d4c", candidatePolicy: "主办", candidateName: "测试人员", candidateType: "角色"},
              {candidateId: "b7btt8f1-e9fe-43a7-91fe-6cd3a1265d4c", candidatePolicy: "主办", candidateName: "研发人员", candidateType: "角色"},
              {candidateId: "admin", candidatePolicy: "主办", candidateName: "系统管理员", candidateType: "职员"},
              {candidateId: "25bf35ee-6d74-4636-a784-d4cff742c889", candidatePolicy: "主办", candidateName: "张三", candidateType: "职员"},
              {candidateId: "25bf3gge-6d74-4636-a784-d4cff742c889", candidatePolicy: "主办", candidateName: "李四", candidateType: "职员"}
            ]
            const $activity = $(stringToXml($('#descriptorarea').val())).find('#' + task.id);
            const candidateUsers = $activity.attr('activiti:candidateUsers');
            const candidateGroups = $activity.attr('activiti:candidateGroups');
            const userIds = candidateUsers && candidateUsers.split(',') || [];
            const rolesIds = candidateGroups && candidateGroups.split(',') || [];
            const candidateIds = userIds.concat(rolesIds);
            candidateIds.forEach(function (item) {
                for(let i = all.length -1; i >= 0; i--) {
                    if (item === all[i].candidateId) {
                        candidateList.push(all[i]);
                        all.splice(i, 1);
                    }
                }
            })
            // ------------------------演示专用结束------------------------------//
            loadActCandidate(candidateList, task);
    //     } else {
    //         fnAlert(res.msg, null, false);
    //     }
    // }, null, true);
}

/**
 * 加载参与者表格数据，并且存进模版设计器的task对象中
 * @param candidateList
 * @param task
 */
function loadActCandidate(candidateList, task) {
    task.candidateUsers = new draw2d.ArrayList();
    task.candidateGroups = new draw2d.ArrayList();
    if (candidateList.length != null && candidateList.length > 0) {
        candidateList.forEach(function (item, index) {
            if (item.candidateType === '角色') {
                task.addCandidateGroup(item.candidateId);
            } else {
                task.addCandidateUser({
                    sso: item.candidateId
                });
            }
        })
    }
    table.reload('userAuthTable', {
        data: candidateList
    });
}

/**
 * 添加参与者
 * @param task 活动对象
 */
function addActUserAuth(task) {
    const userAuthList = table.cache['userAuthTable'];
    const callBack = function(arr, closeModal) {
        if (arr.length === 0) {
            return false;
        }

        const addCandidates = [];
        for (let i = 0; i < arr.length; i++) {
            const type = arr[i].type;
            if (type === '组织') {
                continue;
            }
            const tempObj = {
                candidateId: arr[i].id,
                candidateName: arr[i].name,
                candidateType: type,
                candidatePolicy: '主办'
            };
            let isInArray = false;
            // 判断选择用户是否已经被授权
            for (let j = 0; j < userAuthList.length; j++) {
                if (userAuthList[j].candidateId === tempObj.candidateId && userAuthList[j].candidateType === tempObj.candidateType) {
                    isInArray = true;
                    break;
                }
            }
            if (!isInArray) {
                addCandidates.push(tempObj);
            }
        }
        // 如果选择参与者全部被授权，提示
        if (addCandidates.length === 0) {
            fnTip('选中参与者已全被授权，无需重新授权', 1500);
            closeModal();
            return false;
        }
        // const url = getBaseUrl() + '/bpm/activity/candidate/add';
        // const params = getApiPojo();
        // params.activityId = m_activityId;
        // params.data = addCandidates;
        // const successCallback = function (res) {
        //     if (res.code === 0) {
                closeModal();
                // 将新增的参与者添加到表格中，刷新表格
                addCandidates.forEach(function (item) {
                    userAuthList.push(item);
                });
                loadActCandidate(userAuthList, task);
                fnTip('授权成功!', 1500);
        //     } else {
        //         fnAlert(res.msg, null, false);
        //     }
        // };
        // postRequest(url, params, successCallback);
    };
    showRolesEmplyeeModal('', 'checkbox', callBack);
}

/**
 * 删除参与者
 * @param task 活动对象
 */
function deleteActUserAuth(task) {
    const deleteUserAuths = table.checkStatus('userAuthTable').data;
    if (deleteUserAuths == null || deleteUserAuths.length < 1) {
        fnTip('请选择要删除的参与者', 1500);
    } else {
        fnConfirm('确认删除选中参与者', function (modelIndex, layerObj, closeNow) {
            closeNow();
            const arr = [];
            for (let i = 0; i < deleteUserAuths.length; i++) {
                arr.push(deleteUserAuths[i].candidateId);
            }
            // const strUrl = getBaseUrl() + '/bpm/activity/candidate/delete';
            // const reqObj = getApiPojo();
            // reqObj.activityId = m_activityId;
            // reqObj.data = arr;
            // postRequest(strUrl, reqObj, function (res) {
            //     if (res.code === 0) {
                    // 移除表格中已经删除的参与者
                    const userAuthList = table.cache['userAuthTable'];
                    for (let i = userAuthList.length - 1; i >= 0; i--) {
                        if (arr.indexOf(userAuthList[i].candidateId) > -1) {
                            userAuthList.splice(i, 1);
                        }
                    }
                    loadActCandidate(userAuthList, task);
                    fnTip('删除活动参与者成功!', 1500);
            //     } else {
            //         fnAlert(res.msg, null, false);
            //     }
            // }, null, true);
        })
    }
}

/**
 * 加载活动配置的应用程序
 */
function loadActApps() {
    const height = $('#panelContent').height() - 53;
    table.render({
        elem: '#actAppTable',
        id: 'actAppTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { fixed: 'left', type: 'checkbox', width: 40 },
            { type: 'numbers', title: '序号', align: 'center', fixed: 'left', width: 45 },
            { field: 'appName', title: '名称', align: 'center', width: 200 },
            { field: 'appType', title: '类型', align: 'center', width: 100 },
            { field: 'appClassify', title: '分类', align: 'center' },
            { field: 'appPolicy', title: '主从关系', align: 'center', width: 100 },
            { field: 'appForuse', title: '用途', align: 'center', width: 100 },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barAppDemos', fixed: 'right', width: 140 }
        ]]
    });
    table.on('tool(actAppTable)', function (obj) {
        const optApp = obj.data;
        if (obj.event === 'previewApp') {
            let strHtml = '';
            const optApp = obj.data;
            if (optApp.appType === 'iForm表单') {
                strHtml = '<iframe id="' + optApp.appId + '" src="../../iform/iFormViewer/index.html?pageId=' + optApp.appPath + '&isLoadData=false" frameborder="0" class="home-iframe"></iframe>';
            } else if (optApp.appType === 'URL地址') {
                strHtml = '<iframe id="' + optApp.appId + '" src="' + optApp.appPath + '" frameborder="0" class="home-iframe"></iframe>';
            } else {
                fnTip(optApp.appType + '应用程序暂不支持预览！', 1500);
                return;
            }
            const objModal = {
                'title': optApp.appName + '-预览',
                'width': 700,
                'height': 450
            };
            fnAlertShow(strHtml, objModal, null, function(modelIndex, layerObj, closeNow) {
                closeNow();
            });
        } else if (obj.event === 'updateApp') {
            addOrEditActApp(false, optApp);
        }
    });
    // 查询应用程序信息
    getAppData();
}

/**
 * 查询数据库数据
 */
function getAppData() {
    // const strUrl = getBaseUrl() + '/bpm/activity/appliction/get';
    // const resquestData = getApiPojo();
    // resquestData.activityId = m_activityId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            // 得到应用程序数据后，加载表格
            const applicationList = [] // res.resData.applicationList || [];
            applicationList.sort(compare('appBindSortnum'));
            table.reload('actAppTable', {
                data: applicationList
            });
    //     } else {
    //         fnAlert(res.msg, null, false);
    //     }
    // }, null, true);
}

/**
 * 对象数组排序规则
 * @param property
 * @returns {Function}
 */
function compare(property) {
    return function(a, b) {
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
    }
}

/**
 * 新增或修改活动的应用程序
 * @param bAdd
 * @param setData
 */
function addOrEditActApp(bAdd, setData) {
    let appNameData = ''; let appTypeData = ''; let appPathData = ''; let appForuseData = ''; let relNoteData = ''; let relInitParamData = ''; let relSortnumData = ''; let
        appClassifyData = '';
    if (!bAdd) {
        appNameData = setData.appName;
        appTypeData = setData.appType;
        appForuseData = setData.appForuse;
        appPathData = setData.appPath;
        relNoteData = setData.appPolicy;
        relInitParamData = setData.appInitParam;
        relSortnumData = setData.appBindSortnum;
        appClassifyData = setData.appClassify;
    }
    const obj = [{
        'id': 'appName',
        'name': '名称',
        'type': 'text',
        'data': appNameData,
        'required': true
    }, {
        'id': 'relNote',
        'name': '主从关系',
        'type': 'select',
        'option': ['主', '从', '查'],
        'data': relNoteData,
        'required': true
    }, {
        'id': 'appClassify',
        'name': '分类',
        'type': 'text',
        'data': appClassifyData,
        'required': true
    }, {
        'id': 'appType',
        'name': '类型',
        'type': 'text',
        'data': appTypeData,
        'required': true,
        'disabled': true
    }, {
        'id': 'appPath',
        'name': '路径',
        'type': 'text',
        'data': appPathData,
        'disabled': true
    }, {
        'id': 'appForuse',
        'name': '用途',
        'type': 'text',
        'data': appForuseData,
        'disabled': true
    }, {
        'id': 'relInitParam',
        'name': '初始化参数',
        'type': 'text',
        'dataType': 'text',
        'data': relInitParamData
    }, {
        'id': 'relSortnum',
        'name': '排序序号',
        'type': 'text',
        'dataType': 'int',
        'data': relSortnumData,
        'required': true
    }];
    const showCallback = function () {
        $('#fnFormDialog').addClass('scrollbar');
        $('#fnFormDialog').append('<div style="color:red;">&nbsp;&nbsp;&nbsp;&nbsp;初始化参数格式：键1:值1,键2:值2（其中多个参数使用英文逗号拼接）。<br/>&nbsp;&nbsp;&nbsp;&nbsp;参数值支持流程实例参数（需要使用{}括起来，如：受理编号:{PRJID}）。</div>');

        // 新增应用程序时，需要选中应用程序按钮
        // if (bAdd){
        let selectHtml = '<button type="button" class="layui-btn layui-btn-primary" id="chooseApp">选择</button>';
        selectHtml += '<input type="hidden" id="appId" />';
        $('#appName').parent('.layui-input-block').addClass('d-flex');
        $('#appName').after(selectHtml);
        // }
        // 选择应用程序
        $('#chooseApp').click(function () {
            const strHtml = '<iframe id="selectAppDiv" src="../applicationMgr/index.html?action=select"></iframe>';
            const objModal = {
                'title': '应用程序',
                'needQ': true,
                'width': 748,
                'height': 454
            };
            fnAlertShow(strHtml, objModal, null, function (modelIndex, layerObj, closeNow) {
                const selectApp = $('#selectAppDiv')[0].contentWindow.getSelectApplication();
                if (selectApp === null || selectApp.appId === null || selectApp.appId === undefined) {
                    fnTip('请选择应用程序！', 1500);
                } else {
                    const appList = table.cache['actAppTable'];
                    // 判断选中应用程序是否已经添加
                    for (let i = 0; i < appList.length; i++) {
                        if (selectApp.appId === appList[i].appId) {
                            fnTip('选中应用程序已经与活动绑定！', 1500);
                            return;
                        }
                    }
                    // 将加载选中应用程序的相关信息
                    $('#appId').val(selectApp.appId);
                    $('#appName').val(selectApp.appName);
                    $('#appType').val(selectApp.appType);
                    $('#appPath').val(selectApp.appPath);
                    $('#appForuse').val(selectApp.appForuse);
                    $('#appClassify').val(selectApp.appClassify);
                    closeNow();
                }
            });
        });
    }
    const modalObj = {
        'width': 500,
        'height': 470
    }
    fnFormDialog('应用程序', obj, showCallback, function (modelIndex, layerObj, closeNow) {
        // 保存数据
        let strUrl = '';
        const appObj = {
            appName: $('#appName').val(),
            appClassify: $('#appClassify').val(),
            appPolicy: $('#relNote').val(),
            appInitParam: $('#relInitParam').val(),
            appBindSortnum: $('#relSortnum').val()
        };
        if (bAdd) {
            strUrl = getBaseUrl() + '/bpm/activity/appliction/add';
            appObj.appId = $('#appId').val();
        } else {
            strUrl = getBaseUrl() + '/bpm/activity/appliction/update';
            appObj.appId = setData.appId;
        }
        const resquestData = getApiPojo();
        resquestData.activityId = m_activityId;
        resquestData.data = appObj;
        postRequest(strUrl, resquestData, function (res) {
            // 数据保存成功后，属性表格
            if (res.code === 0) {
                const applicationList = table.cache['actAppTable'];
                if (bAdd) {
                    applicationList.push({
                        appId: $('#appId').val(),
                        appName: $('#appName').val(),
                        appClassify: $('#appClassify').val(),
                        appType: $('#appType').val(),
                        appPath: $('#appPath').val(),
                        appForuse: $('#appForuse').val(),
                        appPolicy: $('#relNote').val(),
                        appInitParam: $('#relInitParam').val(),
                        appBindSortnum: $('#relSortnum').val()
                    });
                } else {
                    for (let i = 0; i < applicationList.length; i++) {
                        if (applicationList[i].appId === setData.appId) {
                            applicationList[i].appName = $('#appName').val();
                            applicationList[i].appClassify = $('#appClassify').val();
                            applicationList[i].appPolicy = $('#relNote').val();
                            applicationList[i].appInitParam = $('#relInitParam').val();
                            applicationList[i].appBindSortnum = $('#relSortnum').val();
                            break;
                        }
                    }
                }
                applicationList.sort(compare('appBindSortnum'));
                table.reload('actAppTable', {
                    data: applicationList,
                    limit: applicationList.length
                });
                closeNow();
                fnTip(res.msg, 1500);
            } else {
                fnAlert(res.msg, null, false);
            }
        }, null, true);
    }, null, modalObj);
}

/**
 * 删除活动应用程序
 */
function deleteActApp() {
    // 获得待删除应用程序信息
    const deleteApps = table.checkStatus('actAppTable').data;
    if (deleteApps == null || deleteApps.length < 1) {
        fnTip('请选择要删除的应用程序', 1500);
    } else {
        fnConfirm('确认删除选中应用程序', function (modelIndex, layerObj, closeNow) {
            closeNow();
            const arr = [];
            for (let i = 0; i < deleteApps.length; i++) {
                arr.push(deleteApps[i].appId);
            }
            const strUrl = getBaseUrl() + '/bpm/activity/appliction/delete';
            const resquestData = getApiPojo();
            resquestData.activityId = m_activityId;
            resquestData.data = arr;
            postRequest(strUrl, resquestData, function (res) {
                if (res.code === 0) {
                    // 移除表格中已经删除的应用程序
                    const applicationList = table.cache['actAppTable'];
                    for (let i = applicationList.length - 1; i >= 0; i--) {
                        if (arr.indexOf(applicationList[i].appId) > -1) {
                            applicationList.splice(i, 1);
                        }
                    }
                    table.reload('actAppTable', {
                        data: applicationList
                    });
                    fnTip(res.msg, 1500);
                } else {
                    fnAlert(res.msg, null, false);
                }
            }, null, true);
        })
    }
}

/**
 * 加载配置的参数信息
 */
function loadActParams() {
    const height = $('#panelContent').height() - 53;
    // 加载table
    table.render({
        elem: '#paramTable',
        id: 'paramTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '序号', align: 'center', width: 45 },
            { field: 'paramName', title: '名称', align: 'center' },
            { field: 'paramType', title: '类型', align: 'center' },
            { field: 'paramValue', title: '值', align: 'center' },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barParamDemos', fixed: 'right', width: 80 }
        ]]
    });
    // 监听table数据的修改事件
    table.on('tool(paramTable)', function (obj) {
        if (obj.event === 'updateParam') {
            addOrEditActParam(false, obj.data)
        }
    });
    // 查询数据
    getActParamData();
}

/**
 * 查询数据库数据
 */
function getActParamData() {
    // const strUrl = getBaseUrl() + '/bpm/activity/parameter/get';
    // const resquestData = getApiPojo();
    // resquestData.activityId = m_activityId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            const activityParameterList  = []; // res.resData.activityParameterList;
            activityParameterList.sort(compare('paramSortnum'));
            table.reload('paramTable', {
                data: activityParameterList
            });
    //     } else {
    //         fnAlert(res.msg, null, false);
    //     }
    // }, null, true);
}

/**
 * 添加或修改参数
 * @param bAdd  为true时，添加参数。为false时修改参数
 * @param setParam  修改参数时，原参数信息
 */
function addOrEditActParam(bAdd, setParam) {
    const paramterList = table.cache['paramTable'];
    let paramNameData = ''; let paramTypeData = ''; let paramValueData = ''; let paramClassifyData = ''; let paramSortnumData = ''; let
        paramNoteData = '';
    if (!bAdd) {
        paramNameData = setParam.paramName;
        paramTypeData = setParam.paramType;
        paramValueData = setParam.paramValue;
        paramClassifyData = setParam.paramClassify;
        paramSortnumData = setParam.paramSortnum;
        paramNoteData = setParam.paramNote;
    }
    const obj = [{
        'id': 'paramName',
        'name': '名称',
        'type': 'select',
        'editable': true,
        'search': true,
        'option': [paramNameData],
        'maxLength': 64,
        'data': paramNameData,
        'required': true
    }, {
        'id': 'paramType',
        'name': '类型',
        'type': 'select',
        'option': ['流程参数', '业务变量', '打印菜单', '工具菜单'],
        'data': paramTypeData,
        'required': true
    }, {
        'id': 'paramValue',
        'name': '值',
        'type': 'select',
        'editable': true,
        'search': true,
        'option': [paramValueData],
        'maxLength': 64,
        'data': paramValueData,
        'required': true
    }, {
        'id': 'paramClassify',
        'name': '变量数据类型',
        'type': 'select',
        'option': ['数值', '字符串', '布尔值'],
        'data': paramClassifyData
    }, {
        'id': 'paramSortnum',
        'name': '排序',
        'type': 'text',
        'dataType': 'int',
        'data': paramSortnumData,
        'required': true
    }, {
        'id': 'paramNote',
        'name': '描述',
        'type': 'textarea',
        'maxLength': 512,
        'data': paramNoteData
    }];
    fnFormDialog('参数信息', obj, function() {
        if ($('#paramType').val() !== '业务变量') {
            $('#paramClassify').parent().hide();
        } else {
            $('#paramClassify').parent().show();
        }

        $('#paramType').on('select2:select', function (e) {
            if (e.params.data.id === '业务变量') {
                $('#paramClassify').parent().show();
            } else {
                $('#paramClassify').parent().hide();
            }
            $('#paramClassify').val('');
        });

        renderParamNameSelect(paramNameData, paramValueData);

        $('#paramName').on('select2:select', function (e) {
            renderParamValueSelect(e.params.data.id, '');
        });
    }, function (modelIndex, layerObj, closeNow) {
        // 保存数据
        const paramObj = translateFormToObject(modelIndex);
        paramObj.paramClassify = $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '';
        let strUrl = '';
        const resquestData = getApiPojo();
        if (bAdd) {
            strUrl = getBaseUrl() + '/bpm/activity/parameter/add';
        } else {
            strUrl = getBaseUrl() + '/bpm/activity/parameter/update';
            resquestData.paramOriginalName = setParam.paramName;
        }
        resquestData.activityId = m_activityId;
        resquestData.data = paramObj;
        postRequest(strUrl, resquestData, function (res) {
            if (res.code === 0) {
                // 数据保存后，刷新表格
                if (bAdd) {
                    paramterList.push({
                        paramName: $('#paramName').val(),
                        paramValue: $('#paramValue').val(),
                        paramType: $('#paramType').val(),
                        paramClassify: $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '',
                        paramSortnum: $('#paramSortnum').val(),
                        paramNote: $('#paramNote').val()
                    });
                } else {
                    for (let i = 0; i < paramterList.length; i++) {
                        if (paramterList[i].paramName === setParam.paramName) {
                            paramterList[i].paramName = $('#paramName').val();
                            paramterList[i].paramType = $('#paramType').val();
                            paramterList[i].paramValue = $('#paramValue').val();
                            paramterList[i].paramClassify = $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '';
                            paramterList[i].paramSortnum = $('#paramSortnum').val();
                            paramterList[i].paramNote = $('#paramNote').val();
                            break;
                        }
                    }
                }
                paramterList.sort(compare('paramSortnum'));
                table.reload('paramTable', {
                    data: paramterList
                });
                closeNow();
                fnTip(res.msg, 1500);
            } else {
                fnAlert(res.msg, modelIndex + 1, false);
            }
        }, null, true);
    });
}

/**
 * 删除参数
 * @param parentId
 */
function deleteActParam() {
    // 获得待删除参数信息
    const deleteParams = table.checkStatus('paramTable').data;
    if (deleteParams == null || deleteParams.length < 1) {
        fnTip('请选择要删除的参数', 1500);
    } else {
        fnConfirm('确认删除选中参数', function (modelIndex, layerObj, closeNow) {
            closeNow();
            // 保存数据
            const arr = [];
            for (let i = 0; i < deleteParams.length; i++) {
                arr.push(deleteParams[i].paramName);
            }
            const strUrl = getBaseUrl() + '/bpm/activity/parameter/delete';
            const reqObj = getApiPojo();
            reqObj.activityId = m_activityId;
            reqObj.data = arr;
            postRequest(strUrl, reqObj, function (res) {
                if (res.code === 0) {
                    const paramterList = table.cache['paramTable'];
                    for (let i = paramterList.length - 1; i >= 0; i--) {
                        if (arr.indexOf(paramterList[i].paramName) > -1) {
                            paramterList.splice(i, 1);
                        }
                    }
                    table.reload('paramTable', {
                        data: paramterList
                    });
                    fnTip(res.msg, 1500);
                } else {
                    fnAlert(res.msg, null, false);
                }
            }, null, true);
        })
    }
}

/**
 * 加载事件监听配置信息
 * @type {Array}
 */
function loadActListenPlugIn() {
    const height = $('#panelContent').height() - 53;
    // 加载table
    table.render({
        elem: '#listenPlugInTable',
        id: 'listenPlugInTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40, fixed: 'left' },
            { type: 'numbers', title: '序号', align: 'center', fixed: 'left', width: 45 },
            { field: 'pluginClassify', title: '事件类型', align: 'center', width: 100 },
            { field: 'eventName', title: '事件名称', align: 'center', width: 150 },
            { field: 'pluginType', title: '操作插件类型', align: 'center', width: 130 },
            { field: 'listenerPolicy', title: '监听方式', align: 'center', width: 100 },
            { field: 'className', title: '类名', align: 'center' },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barlistenPlugInDemos', fixed: 'right', width: 80 }
        ]]
    });
    // 监听table数据的修改事件
    table.on('tool(listenPlugInTable)', function (obj) {
        if (obj.event === 'updateListenPlugIn') {
            addOrEditActListenPlugIn(false, obj.data)
        }
    });
    // 查询数据库数据
    getActListenPlugInData();
}

/**
 * 查询数据库信息
 * @param parentId
 */
function getActListenPlugInData() {
    const strUrl = getBaseUrl() + '/bpm/activity/listener/get';
    const resquestData = getApiPojo();
    resquestData.activityId = m_activityId;
    postRequest(strUrl, resquestData, function (res) {
        if (res.code === 0) {
            const listenerList = res.resData.listenerList;
            table.reload('listenPlugInTable', {
                data: listenerList
            });
        } else {
            fnAlert(res.msg, null, false);
        }
    }, null, true);
}

/**
 * 新增或编辑监听事件
 * @param bAdd
 * @param setData
 */
function addOrEditActListenPlugIn(bAdd, setData) {
    let pluginNameData = ''; let pluginClassifyData = ''; let eventNameData = ''; let pluginPathData = ''; let classNameData = ''; let listenerPolicyData = ''; let listenerSortnumData = ''; let
        pluginTypeData = '';
    if (!bAdd) {
        pluginNameData = setData.pluginName;
        pluginClassifyData = setData.pluginClassify;
        eventNameData = setData.eventName;
        pluginPathData = setData.pluginPath;
        classNameData = setData.className;
        listenerPolicyData = setData.listenerPolicy;
        listenerSortnumData = setData.listenerSortnum;
        pluginTypeData = setData.pluginType;
    }
    const obj = [{
        'id': 'pluginName',
        'name': '插件名称',
        'type': 'text',
        'data': pluginNameData,
        'required': true,
        'disabled': true
    }, {
        'id': 'pluginType',
        'name': '插件类型',
        'type': 'text',
        'data': pluginTypeData,
        'disabled': true
    }, {
        'id': 'pluginClassify',
        'name': '事件类型',
        'type': 'text',
        'data': pluginClassifyData,
        'disabled': true
    }, {
        'id': 'eventName',
        'name': '事件名称',
        'type': 'select',
        'option': [],
        'data': eventNameData
    }, {
        'id': 'listenerPolicy',
        'name': '监听方式',
        'type': 'select',
        'option': ['同步', '异步'],
        'data': listenerPolicyData
    }, {
        'id': 'pluginPath',
        'name': '路径',
        'type': 'text',
        'maxLength': 512,
        'data': pluginPathData,
        'disabled': true
    }, {
        'id': 'className',
        'name': '类名',
        'type': 'select',
        'option': [],
        'data': classNameData,
        'required': true
    }, {
        'id': 'listenerSortnum',
        'name': '排序',
        'type': 'text',
        'dataType': 'int',
        'data': listenerSortnumData,
        'required': true
    }];
    const showCallback = function () {
        if (bAdd) {
            let selectHtml = '<button type="button" class="layui-btn layui-btn-primary" id="choosePlugIn">选择</button>';
            selectHtml += '<input type="hidden" id="pluginId" />';
            // selectHtml += '<input type="hidden" id="pluginPath" />';
            $('#pluginName').parent('.layui-input-block').addClass('d-flex');
            $('#pluginName').after(selectHtml);
        } else {
            let arr = [];
            if ($('#pluginClassify').val() === 'flowable') {
                arr = ['start', 'end'];
            } else if ($('#pluginClassify').val() === '自定义') {
                arr = ['任务启动前', '任务启动后', '任务签收前', '任务签收后', '任务保存前', '任务保存后', '任务提交前', '任务提交后', '任务收回前', '任务收回后', '任务退回前', '任务退回后', '任务关注前', '任务关注后', '任务取消关注前', '任务取消关注后', '任务结束前', '任务结束后'];
            }
            let optHtml = '';
            for (let i = 0; i < arr.length; i++) {
                if (eventNameData !== arr[i]) {
                    optHtml += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
                } else {
                    optHtml += '<option value="' + arr[i] + '" selected>' + arr[i] + '</option>';
                }
            }
            $('#eventName').html(optHtml);
            if (setData.pluginType === 'Javaclass') {
                $('#className').parents('.layui-form-item').show();
                $('#className').html(getActPluginClass(setData.pluginPath));
            } else {
                $('#className').parents('.layui-form-item').hide();
                $('#className').html('<option value="' + setData.pluginPath + '">' + setData.pluginPath + '</option>');
            }

            layui.form.render();
        }

        // 选择插件
        $('#choosePlugIn').click(function () {
            const strHtml = '<iframe id="selectPluginDiv" src="../listenerPlugInMgr/index.html?action=select"></iframe>';
            const objModal = {
                'title': '事件监听插件',
                'needQ': true,
                'width': 748,
                'height': 454
            };
            fnAlertShow(strHtml, objModal, null, function (modelIndex, layerObj, closeNow) {
                const pluginObj = $('#selectPluginDiv')[0].contentWindow.getSelectPlugin();
                if (pluginObj === null || pluginObj.pluginId === null || pluginObj.pluginId === undefined) {
                    fnTip('请选择监听插件！', 1500);
                } else {
                    let arr = [];
                    if (pluginObj.pluginClassify === 'flowable') {
                        arr = ['create', 'assignment', 'complete', 'all'];
                    } else if (pluginObj.pluginClassify === '自定义') {
                        arr = ['任务启动前', '任务启动后', '任务签收前', '任务签收后', '任务保存前', '任务保存后', '任务提交前', '任务提交后', '任务收回前', '任务收回后', '任务退回前', '任务退回后', '任务关注前', '任务关注后', '任务取消关注前', '任务取消关注后', '任务结束前', '任务结束后'];
                    }
                    let optHtml = '';
                    for (let i = 0; i < arr.length; i++) {
                        optHtml += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
                    }
                    $('#eventName').html(optHtml);
                    if (pluginObj.pluginType === 'Javaclass') {
                        $('#className').parents('.layui-form-item').show();
                        const pluginClass = getActPluginClass(pluginObj.pluginPath);
                        if (pluginClass === '') {
                            return;
                        }
                        $('#className').html(pluginClass);
                        layui.form.render();
                        closeNow();
                    } else {
                        $('#className').parents('.layui-form-item').hide();
                        $('#className').html('<option value="' + pluginObj.pluginPath + '">' + pluginObj.pluginPath + '</option>');
                        layui.form.render();
                        closeNow();
                    }
                    $('#pluginName').val(pluginObj.pluginName);
                    $('#pluginId').val(pluginObj.pluginId);
                    $('#pluginType').val(pluginObj.pluginType);
                    $('#pluginClassify').val(pluginObj.pluginClassify);
                    $('#pluginPath').val(pluginObj.pluginPath);
                }
            });
        });
    }
    const modalObj = {
        'width': 500
    }
    fnFormDialog('事件监听信息', obj, showCallback, function (modelIndex, layerObj, closeNow) {
        const listenerObj = {
            listenerPolicy: $('#listenerPolicy').val(),
            className: $('#className').val(),
            listenerSortnum: $('#listenerSortnum').val(),
            eventName: $('#eventName').val()
        };
        const reData = getApiPojo();
        reData.activityId = m_activityId;
        let url = getBaseUrl() + '/bpm/activity/listener/add';
        if (!bAdd) {
            url = getBaseUrl() + '/bpm/activity/listener/update';
            listenerObj.pluginId = setData.pluginId;
            reData.originalEventName = setData.eventName;
            reData.originalClassName = setData.className;
        } else {
            listenerObj.pluginId = $('#pluginId').val();
        }
        reData.data = listenerObj;
        postRequest(url, reData, function (res) {
            if (res.code === 0) {
                const activityListenerList = table.cache['listenPlugInTable'];
                if (bAdd) {
                    listenerObj.pluginName = $('#pluginName').val();
                    listenerObj.pluginType = $('#pluginType').val();
                    listenerObj.pluginClassify = $('#pluginClassify').val();
                    listenerObj.pluginPath = $('#pluginPath').val();
                    activityListenerList.push(listenerObj);
                } else {
                    for (let i = 0; i < activityListenerList.length; i++) {
                        if (activityListenerList[i].pluginId === setData.pluginId && activityListenerList[i].eventName === setData.eventName && activityListenerList[i].className === setData.className) {
                            activityListenerList[i].listenerPolicy = $('#listenerPolicy').val();
                            activityListenerList[i].listenerSortnum = $('#listenerSortnum').val();
                            activityListenerList[i].className = $('#className').val();
                            activityListenerList[i].eventName = $('#eventName').val();
                            break;
                        }
                    }
                }
                activityListenerList.sort(compare('listenerSortnum'));
                table.reload('listenPlugInTable', {
                    data: activityListenerList
                });
                closeNow();
                fnTip(res.msg, 1500);
            } else {
                fnTip('添加失败，已经存在相同的事件监听插件配置！', 1500);
                // fnAlert(res.msg,null, false);
            }
        });
    }, 1, modalObj);
}

function getActPluginClass(pluginName) {
    let sHtml = '';
    const url = getBaseUrl() + '/bpm/listenerplugin/queryJavaClassOfJar';
    const reData = getApiPojo();
    reData.jarName = pluginName;
    synchPostRequest(url, reData, function (res) {
        if (res.code === 0) {
            const arrJavaClass = res.resData.JavaClassNames || [];
            if (arrJavaClass.length < 1) {
                fnTip('该jar包下不存在类名', 1500);
                return sHtml;
            }
            for (let i = 0; i < arrJavaClass.length; i++) {
                sHtml += '<option value="' + arrJavaClass[i] + '">' + arrJavaClass[i] + '</option>';
            }
        } else {
            fnTip('jar包解析失败！', 1500);
        }
    }, null, true);
    return sHtml;
}

/**
 * 删除监听事件
 */
function deleteActListenPlugIn() {
    const deleteListenPlugIns = table.checkStatus('listenPlugInTable').data;
    if (deleteListenPlugIns == null || deleteListenPlugIns.length < 1) {
        fnTip('请选择要删除的监听事件', 1500);
    } else {
        fnConfirm('确认删除选中监听事件', function (modelIndex, layerObj, closeNow) {
            closeNow();
            const arr = [];
            for (let i = 0; i < deleteListenPlugIns.length; i++) {
                arr.push({
                    pluginId: deleteListenPlugIns[i].pluginId,
                    eventName: deleteListenPlugIns[i].eventName,
                    className: deleteListenPlugIns[i].className
                });
            }
            const url = getBaseUrl() + '/bpm/activity/listener/delete';
            const reData = getApiPojo();
            reData.activityId = m_activityId;
            reData.data = arr;
            postRequest(url, reData, function (res) {
                if (res.code === 0) {
                    const activityListenerList = table.cache['listenPlugInTable'];
                    for (let i = activityListenerList.length - 1; i >= 0; i--) {
                        arr.forEach(function (item) {
                            if (activityListenerList[i].pluginId === item.pluginId && activityListenerList[i].eventName === item.eventName && activityListenerList[i].className === item.className) {
                                activityListenerList.splice(i, 1);
                            }
                        })
                    }
                    table.reload('listenPlugInTable', {
                        data: activityListenerList
                    });
                    fnTip(res.msg, 1500);
                } else {
                    fnAlert(res.msg, null, false);
                }
            });
        })
    }
}
