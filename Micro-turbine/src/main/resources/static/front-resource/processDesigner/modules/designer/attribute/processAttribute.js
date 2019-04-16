/**
 * 编辑流程模版属性
 * @param processId
 * @returns
 */
function openProcessProperty(processId) {
    // 流程扩展参数绑定事件
    const strHtml = initProcessPanel();

    const objModal = {
        'title': '过程属性',
        'modalIndex': -20000,
        'needQ': true,
        'width': 748,
        'height': 475
    };

    fnAlertShow(strHtml, objModal, function() {
        renderSelect2('[lay-filter="fnAlertShowFilter"]');

        // 打开过程属性模版
        loadProcessData(processId, false);

        const data = workflow.process;

        // 设置模版名称
        if ($('#processName').val() === '') {
            $('#processName').val(data.name);
        }

        // 设置模版分类
        if ($('#processCategory').val() === '') {
            $('#processCategory').val(data.category)
        }

        // 设置模版描述
        if ($('#processDescription').val() === '') {
            $('#processDescription').val(data.documentation);
        }

        // 设置模版创建人
        if ($('#processCreateBy').val() === '') {
            m_processProp.processCreateBy = window.localStorage.getItem('userId')
            $('#processCreateBy').val(window.localStorage.getItem('userName'));
        }

        // 设置模版创建时间
        if ($('#processCreateTime').val() === '') {
            const currDate = new Date();
            // 获取当前年
            const year = currDate.getFullYear();
            // 获取当前月
            const month = currDate.getMonth() + 1;
            // 获取当前日
            const date = currDate.getDate();
            const h = currDate.getHours();       // 获取当前小时数(0-23)
            const m = currDate.getMinutes();     // 获取当前分钟数(0-59)
            const s = currDate.getSeconds();
            const now = year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + s;
            $('#processCreateTime').val(now);
        }
    }, function(modelIndex, layerObj, closeNow) {
        m_needSave = true;

        // 新建模版时，点击确认按钮，不保存相关信息进数据库
        const tmpProcessProp = getProcAttr();

        const objProcessAttr = getProcessAttrObj();
        for (let i = 0; i < objProcessAttr.length; i++) {
            objProcessAttr[i].data = tmpProcessProp[objProcessAttr[i].id];
        }
        // objProcessAttr.push({
        //     name: '执行期限天数',
        //     type: 'text',
        //     dataType: 'number',
        //     data: Math.abs(tmpProcessProp.processLimit),
        //     id: 'tmpCheckProcLimit'
        // });

        if (checkInputRight(objProcessAttr)) {
            tmpProcessProp.processCreateBy = m_processProp.processCreateBy;
            m_processProp = tmpProcessProp;
            m_processProp.categoryId = m_categoryId;
            const data = workflow.process;
            data.name = m_processProp.processName;
            data.category = m_processProp.processCategory;
            data.documentation = m_processProp.processDescription;

            // 同步修改流程分类树上流程模版名称
            if (m_treeNode != null) {
                if (m_treeNode.type === '模版') {
                    m_treeNode.name = XMLDecode(m_processProp.processName);
                    m_treeNode.sortnum = m_processProp.processSortnum;
                    const treeObj = $.fn.zTree.getZTreeObj('treeProcessCategory');
                    treeObj.updateNode(m_treeNode);
                    // 树节点重新排序
                    treeNodeSortnum(treeObj, m_treeNode);
                    m_newModal = {
                        name: m_processProp.processName,
                        type: m_processProp.processCategory
                    };
                }
            }
            // saveRiskPoint('过程', '', processId, function() {
                closeNow();
            // });
        }
    }, null, null, function() {
        const $panelContent = $('#panelContent');
        const panelHeight = $panelContent.height() - 53;
        const panelWidth = $panelContent.width();
        const table = layui.table;
        table.reload('userAuthTable', {
            height: panelHeight,
            width: panelWidth
        });
        table.reload('paramTable', {
            height: panelHeight,
            width: panelWidth
        });
        table.reload('listenPlugInTable', {
            height: panelHeight,
            width: panelWidth
        });
        table.reload('procAppTable', {
            height: panelHeight,
            width: panelWidth
        });
    });
}

function loadProcessData(processId, bDatabase) {
    m_processId = processId;

    // 渲染模版属性
    if (bDatabase) {
        initProcProp();
    } else {
        setProcAttr(m_processProp);
    }

    // 渲染授权列表
    loadProcUserAuth(bDatabase);

    // 渲染模版参数
    loadProcParams(bDatabase);

    // 渲染事件监听配置
    loadProcListenPlugIn(bDatabase);

    loadProcessApps(bDatabase);

    loadProcessLines(processId);

    let isRenderRiskPoint = false;
    // 切换到应用程序tab时，重新加载table，防止表格变形
    layui.element.on('tab(actPanel)', function(data) {
        const table = layui.table;
        if (data.index === 3) {
            table.reload('listenPlugInTable', {
                data: m_listeners
            });
        } else if (data.index === 5) {
            // 加载活动风险配置
            if (!isRenderRiskPoint) {
                renderRiskPoint('过程', processId);
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
        addProcUserAuth();
    });
    // 删除参与者
    $('#btnUserDelete').click(function () {
        deleteProcUserAuth();
    });
    // 参数拷入
    $('#btnUserCopyInto').click(function () {
        showCopyIntoOutPopup(processId, '参与者', false);
    });
    // 参数拷出
    $('#btnUserCopyOut').click(function () {
        showCopyIntoOutPopup(processId, '参与者', false, true);
    });
    // 添加参数
    $('#btnAddParam').click(function () {
        addOrEditProcParam(true);
    });
    // 删除参数
    $('#btnDeleteParam').click(function () {
        deleteProcParam();
    });
    // 参数拷入
    $('#btnParamCopyInto').click(function () {
        showCopyIntoOutPopup(processId, '参数', false);
    });
    // 参数拷出
    $('#btnParamCopyOut').click(function () {
        showCopyIntoOutPopup(processId, '参数', false, true);
    });
    // 添加事件监听配置
    $('#btnAddListenPlugIn').click(function () {
        addOrEditProcListenPlugIn(true);
    });
    // 删除事件监听配置
    $('#btnDeleteListenPlugIn').click(function () {
        deleteProcListenPlugIn();
    });
    // 事件监听拷入
    $('#btnPlugInCopyInto').click(function () {
        showCopyIntoOutPopup(processId, '事件监听', false);
    });
    // 事件监听拷出
    $('#btnPlugInCopyOut').click(function () {
        showCopyIntoOutPopup(processId, '事件监听', false, true);
    });
}

/**
 * 渲染模版属性
 * @param m_procId
 */
function initProcProp() {
    const requestData = getApiPojo();
    requestData.processId = m_processId;
    const url = getBaseUrl() + '/bpm/process/property/query';
    postRequest(url, requestData, function (res) {
        if (res.code === 0) {
            const resData = res.resData.procprop;
            m_processProp = resData;
            setProcAttr(resData);
        } else {
            fnAlert(res.msg);
        }
    });
}

function setProcAttr(resData) {
    if (resData === undefined || resData === null) {
        return;
    }
    let limitTime = resData.processLimit;
    if (limitTime !== undefined && limitTime != null) {
        let workdateType;
        if (limitTime < 0) {
            limitTime = Math.abs(limitTime);
            workdateType = '所有日';
        } else {
            workdateType = '工作日';
        }
        const hours = parseInt(limitTime / 60, 10);
        let minute = limitTime % 60;
        if (minute < 10) {
            minute = '0' + minute;
        }
        const days = parseInt(hours / 24, 10);
        let hour = hours % 24;
        if (hour < 10) {
            hour = '0' + hour;
        }
        resData.limitDay = days;
        resData.limitHour = hour;
        resData.limitMinute = minute;
        resData.workdateType = workdateType;
    } else {
        resData.limitDay = 0;
        resData.limitHour = '00';
        resData.limitMinute = '00';
    }

    resData.processName = XMLDecode(resData.processName);
    resData.processCategory = XMLDecode(resData.processCategory);
    resData.processDescription = XMLDecode(resData.processDescription);
    layui.form.val('attrForm', resData);
    resData.processName = XMLEncode(resData.processName);
    resData.processCategory = XMLEncode(resData.processCategory);
    resData.processDescription = XMLEncode(resData.processDescription);

    // select2赋值渲染
    $('#workdateType').val(resData.workdateType).trigger('change');
    $('#processState').val(resData.processState).trigger('change');
    $('#processFlowctrl').val(resData.processFlowctrl).trigger('change');
    $('#processFormctrl').val(resData.processFormctrl).trigger('change');
    $('#processExectrl').val(resData.processExectrl).trigger('change');
    $('#processWorkareatype').val(resData.processWorkareatype).trigger('change');

    $('#processId').val(m_processId).attr('disabled', true);
    $('#processCreateBy').val(getUserNameById(resData.processCreateBy));
    $('#processCreateBy').attr('disabled', true);
    $('#processCreateTime').attr('disabled', true);
}

function getUserNameById(userId) {
    let userName = '';
    if (userId) {
        const url = getBaseUrl() + '/auth/user/queryByIds';
        const reqObj = getApiPojo();
        reqObj.data = [userId];
        synchPostRequest(url, reqObj, function (res) {
            if (res.code === 0) {
                userName = res.resData.userInfo[0].userName;
            }
        });
    }
    return userName;
}

function getProcAttr() {
    const paramsObj = getFormAttrData('attrForm');
    let procLimit;
    let tmpCheckProcLimit = '';
    const day = $('#limitDay').val();
    const hour = $('#limitHour').val();
    const minute = $('#limitMinute').val();
    if (day === '') {
        procLimit = parseInt(hour, 10) * 60 + parseInt(minute, 10);
    } else {
        if (!onlyNum(day)) {
            tmpCheckProcLimit = '非整数';
        } else {
            procLimit = parseInt(day, 10) * (24 * 60) + parseInt(hour, 10) * 60 + parseInt(minute, 10);
        }
    }
    if (paramsObj.workdateType === '所有日') {
        procLimit = -procLimit;
    }
    if (tmpCheckProcLimit) {
        paramsObj.processLimit = tmpCheckProcLimit;
    } else {
        paramsObj.processLimit = procLimit;
    }
    return paramsObj;
}

/**
 * 加载配置的参数信息
 * @param parentId  父节点id
 * @param bDatabase 表示是否存进数据库，没有设置或值为true时，存数据库，值为false时，不存数据库
 */
function loadProcParams(bDatabase) {
    const height = $('#panelContent').height() - 53;
    // 加载table
    layui.table.render({
        elem: '#paramTable',
        id: 'paramTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40 },
            { field: 'xh', width: 60, title: '序号', align: 'center' },
            { field: 'paramName', title: '名称', align: 'center' },
            { field: 'paramType', title: '类型', align: 'center' },
            { field: 'paramValue', title: '值', align: 'center' },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barParamDemos', fixed: 'right', width: 80 }
        ]]
    });
    // 监听table数据的修改事件
    layui.table.on('tool(paramTable)', function (obj) {
        if (obj.event === 'updateParam') {
            addOrEditProcParam(false, obj.data)
        }
    });
    if (bDatabase === undefined || bDatabase) {
        // 信息存数据库时，从数据库中加载信息
        getProcParamData();
    } else {
        // 信息不存数据库时，根据m_tableParams加载信息
        for (let i = 0; i < m_parameters.length; i++) {
            m_parameters[i].xh = i + 1;
        }
        m_parameters.sort(compare('paramSortnum'));
        layui.table.reload('paramTable', {
            data: m_parameters
        });
    }
}

/**
 * 查询数据库数据
 * @param actId
 */
function getProcParamData() {
    // 从后端接口重新获取，先清除已有数组对象信息
    m_parameters = [];
    const strUrl = getBaseUrl() + '/bpm/process/parameter/query';
    const resquestData = getApiPojo();
    resquestData.processId = m_processId;
    postRequest(strUrl, resquestData, function (res) {
        if (res.code === 0) {
            const resArray = res.resData.processParameters;
            if (resArray != null && resArray.length > 0) {
                m_parameters = resArray;
                // 信息不存数据库时，根据m_tableParams加载信息
                for (let i = 0; i < m_parameters.length; i++) {
                    m_parameters[i].xh = i + 1;
                }
                m_parameters.sort(compare('paramSortnum'));
                layui.table.reload('paramTable', {
                    data: m_parameters
                });
            }
        } else {
            fnAlert(res.msg, null, false);
        }
    }, null, true);
}

/**
 * 添加或修改参数
 * @param bAdd  为true时，添加参数。为false时修改参数
 * @param setParam  修改参数时，原参数信息
 * @param bDatabase 表示是否存进数据库，没有设置或值为true时，存数据库，值为false时，不存数据库
 */
function addOrEditProcParam(bAdd, setParam) {
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
        'option': ['全局参数', '流程参数', '业务变量', '打印菜单', '工具菜单'],
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
        // 信息不存数据库时，将新增、修改的参数信息维护进m_tableParams
        if (bAdd) {
            let bHad = false;
            for (let i = 0; i < m_parameters.length; i++) {
                if (m_parameters[i].paramName === $('#paramName').val()) {
                    fnTip('已经存在同名参数！', 1500);
                    bHad = true;
                    break;
                }
            }
            if (!bHad) {
                m_parameters.push({
                    paramName: $('#paramName').val(),
                    paramType: $('#paramType').val(),
                    paramValue: $('#paramValue').val(),
                    paramClassify: $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '',
                    paramSortnum: $('#paramSortnum').val(),
                    paramNote: $('#paramNote').val()
                });
            }
        } else {
            for (let i = 0; i < m_parameters.length; i++) {
                if (m_parameters[i].xh === setParam.xh) {
                    m_parameters[i].paramName = $('#paramName').val();
                    m_parameters[i].paramType = $('#paramType').val();
                    m_parameters[i].paramValue = $('#paramValue').val();
                    m_parameters[i].paramClassify = $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '';
                    m_parameters[i].paramSortnum = $('#paramSortnum').val();
                    m_parameters[i].paramNote = $('#paramNote').val();
                }
            }
        }
        m_parameters.sort(compare('paramSortnum'));
        for (let i = 0; i < m_parameters.length; i++) {
            m_parameters[i].xh = i + 1;
        }
        layui.table.reload('paramTable', {
            data: m_parameters
        });
        closeNow();
    });
}

/**
 * 删除参数
 * @param parentId
 */
function deleteProcParam(parentId) {
    // 获得待删除参数信息
    const deleteParams = layui.table.checkStatus('paramTable').data;
    if (deleteParams == null || deleteParams.length < 1) {
        fnTip('请选择要删除的参数', 1500);
    } else {
        fnConfirm('确认删除选中参数', function (modelIndex, layerObj, closeNow) {
            closeNow();
            // 信息不存数据库时，将删除的参数信息维护进m_tableParams
            for (let i = m_parameters.length - 1; i >= 0; i--) {
                for (let j = 0; j < deleteParams.length; j++) {
                    if (m_parameters[i].xh === deleteParams[j].xh) {
                        m_parameters.splice(i, 1);
                        break;
                    }
                }
            }
            for (let i = 0; i < m_parameters.length; i++) {
                m_parameters[i].xh = i + 1;
            }
            layui.table.reload('paramTable', {
                data: m_parameters
            });
        })
    }
}

/**
 * 加载活动授权参与者
 * @param parentId 父节点id
 * @param bDatabase 表示是否存进数据库，没有设置或值为true时，存数据库，值为false时，不存数据库
 */
function loadProcUserAuth(bDatabase) {
    // 加载表格
    const height = $('#panelContent').height() - 53;
    layui.table.render({
        elem: '#userAuthTable',
        id: 'userAuthTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40 },
            { field: 'xh', width: 60, title: '序号', align: 'center' },
            { field: 'candidateName', align: 'center', title: '名称' },
            { field: 'candidateType', align: 'center', title: '类别' },
            { field: 'candidatePolicy', align: 'center', title: '参与方式' }
        ]]
    });
    // 查询数据
    if (bDatabase === undefined || bDatabase) {
        // 信息存数据库时，从数据库中加载信息
        getProcAuthData();
    } else {
        // 信息不存数据库时，从m_tableAuths中加载信息
        for (let i = 0; i < m_candidates.length; i++) {
            m_candidates[i].xh = i + 1;
        }
        layui.table.reload('userAuthTable', {
            data: m_candidates
        });
    }
}

/**
 * 查询数据库数据
 * @param actId
 */
function getProcAuthData() {
    // 从后端接口重新获取，先清除已有数组对象信息
    m_candidates = [];
    const strUrl = getBaseUrl() + '/bpm/process/candidate/query';
    const resquestData = getApiPojo();
    resquestData.processId = m_processId;
    postRequest(strUrl, resquestData, function (res) {
        if (res.code === 0) {
            const resArray = res.resData.processCandidates || [];
            if (resArray != null && resArray.length > 0) {
                m_candidates = resArray;
            }
            layui.table.reload('userAuthTable', {
                data: m_candidates
            });
        } else {
            fnAlert(res.msg, null, false);
        }
    }, null, true);
}

/**
 * 添加参与者
 * @param obj
 */
function addProcUserAuth(obj) {
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
            for (let i = 0; i < userAuthList.length; i++) {
                if (userAuthList[i].candidateId === tempObj.candidateId && userAuthList[i].candidateType === tempObj.candidateType) {
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

        for (let i = 0; i < addCandidates.length; i++) {
            userAuthList.push(addCandidates[i]);
        }

        for (let i = 0; i < userAuthList.length; i++) {
            userAuthList[i].xh = i + 1;
        }

        m_candidates = userAuthList;
        layui.table.reload('userAuthTable', {
            data: m_candidates
        });
        closeModal();
    };
    showRolesEmplyeeModal('', 'checkbox', callBack);
}

/**
 * 删除参与者
 */
function deleteProcUserAuth() {
    const deleteUserAuths = layui.table.checkStatus('userAuthTable').data;
    if (deleteUserAuths == null || deleteUserAuths.length < 1) {
        fnTip('请选择要删除的参与者', 1500);
    } else {
        fnConfirm('确认删除选中参与者', function (modelIndex, layerObj, closeNow) {
            closeNow();
            for (let i = m_candidates.length - 1; i >= 0; i--) {
                for (let j = 0; j < deleteUserAuths.length; j++) {
                    if (m_candidates[i].xh === deleteUserAuths[j].xh) {
                        m_candidates.splice(i, 1);
                        break;
                    }
                }
            }
            for (let i = 0; i < m_candidates.length; i++) {
                m_candidates[i].xh = i + 1;
            }
            layui.table.reload('userAuthTable', {
                data: m_candidates
            });
        })
    }
}

/**
 * 加载事件监听配置信息
 * @type {Array}
 */
function loadProcListenPlugIn(bDatabase) {
    const height = $('#panelContent').height() - 53;
    // 加载table
    layui.table.render({
        elem: '#listenPlugInTable',
        id: 'listenPlugInTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40 },
            { field: 'xh', width: 60, title: '序号', align: 'center' },
            { field: 'pluginClassify', title: '事件类型', align: 'center', width: 100 },
            { field: 'eventName', title: '事件名称', align: 'center', width: 150 },
            { field: 'pluginType', title: '操作插件类型', align: 'center', width: 130 },
            { field: 'listenerPolicy', title: '监听方式', align: 'center', width: 100 },
            { field: 'className', title: '类名', align: 'center' },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barlistenPlugInDemos', fixed: 'right', width: 80 }
        ]]
    });
    // 监听table数据的修改事件
    layui.table.on('tool(listenPlugInTable)', function (obj) {
        if (obj.event === 'updateListenPlugIn') {
            addOrEditProcListenPlugIn(false, obj.data)
        }
    });
    if (bDatabase === undefined || bDatabase) {
        // 信息存数据库时，从数据库中加载信息
        getProcListenPlugInData();
    } else {
        // 信息不存数据库时，根据m_tableListenPlugIns加载信息
        for (let i = 0; i < m_listeners.length; i++) {
            m_listeners[i].xh = i + 1;
        }
        layui.table.reload('listenPlugInTable', {
            data: m_listeners
        });
    }
}

/**
 * 查询数据库信息
 * @param parentId
 */
function getProcListenPlugInData() {
    // 从后端接口重新获取，先清除已有数组对象信息
    m_listeners = [];
    const strUrl = getBaseUrl() + '/bpm/process/listener/query';
    const resquestData = getApiPojo();
    resquestData.processId = m_processId;
    postRequest(strUrl, resquestData, function (res) {
        if (res.code === 0) {
            const resArray = res.resData.processListeners;
            if (resArray != null && resArray.length > 0) {
                m_listeners = resArray;
                // 信息不存数据库时，根据m_tableListenPlugIns加载信息
                for (let i = 0; i < m_listeners.length; i++) {
                    m_listeners[i].xh = i + 1;
                }
                layui.table.reload('listenPlugInTable', {
                    data: m_listeners,
                    limit: m_listeners.length
                });
            }
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
function addOrEditProcListenPlugIn(bAdd, setData) {
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
                arr = ['流程启动前', '流程启动后', '流程挂起前', '流程挂起后', '流程恢复挂起前', '流程恢复挂起后', '流程终止前', '流程终止后', '流程废弃前', '流程废弃后', '流程删除前', '流程删除后', '流程结束前', '流程结束后'];
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
                $('#className').html(getProcPluginClass(setData.pluginPath));
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
                        arr = ['流程启动前', '流程启动后', '流程挂起前', '流程挂起后', '流程恢复挂起前', '流程恢复挂起后', '流程终止前', '流程终止后', '流程废弃前', '流程废弃后', '流程删除前', '流程删除后', '流程结束前', '流程结束后'];
                    }
                    let optHtml = '';
                    for (let i = 0; i < arr.length; i++) {
                        optHtml += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
                    }
                    $('#eventName').html(optHtml);
                    if (pluginObj.pluginType === 'Javaclass') {
                        $('#className').parents('.layui-form-item').show();
                        const pluginClass = getProcPluginClass(pluginObj.pluginPath);
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
        // 信息不存数据库时，将新增、修改的参数信息维护进m_tableParams
        if (bAdd) {
            const newListenPlugIn = {
                pluginName: $('#pluginName').val(),
                pluginType: $('#pluginType').val(),
                pluginClassify: $('#pluginClassify').val(),
                pluginId: $('#pluginId').val(),
                eventName: $('#eventName').val(),
                listenerPolicy: $('#listenerPolicy').val(),
                className: $('#className').val(),
                listenerSortnum: $('#listenerSortnum').val(),
                pluginPath: $('#pluginPath').val()
            }
            m_listeners.push(newListenPlugIn);
        } else {
            for (let i = 0; i < m_listeners.length; i++) {
                if (m_listeners[i].xh === setData.xh) {
                    m_listeners[i].eventName = $('#eventName').val();
                    m_listeners[i].listenerPolicy = $('#listenerPolicy').val();
                    m_listeners[i].className = $('#className').val();
                    m_listeners[i].listenerSortnum = $('#listenerSortnum').val();
                    break;
                }
            }
        }
        m_listeners.sort(compare('listenerSortnum'));
        for (let i = 0; i < m_listeners.length; i++) {
            m_listeners[i].xh = i + 1;
        }
        layui.table.reload('listenPlugInTable', {
            data: m_listeners
        });
        closeNow();
    }, 1, modalObj);
}

function getProcPluginClass(pluginName) {
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
            fnTip('jar包解析失败', 1500);
        }
    }, null, true);
    return sHtml;
}

/**
 * 删除监听事件
 */
function deleteProcListenPlugIn() {
    const deleteListenPlugIns = layui.table.checkStatus('listenPlugInTable').data;
    if (deleteListenPlugIns == null || deleteListenPlugIns.length < 1) {
        fnTip('请选择要删除的监听事件', 1500);
    } else {
        fnConfirm('确认删除选中监听事件', function (modelIndex, layerObj, closeNow) {
            closeNow();
            for (let i = m_listeners.length - 1; i >= 0; i--) {
                for (let j = 0; j < deleteListenPlugIns.length; j++) {
                    if (m_listeners[i].xh === deleteListenPlugIns[j].xh) {
                        m_listeners.splice(i, 1);
                        break;
                    }
                }
            }
            for (let i = 0; i < m_listeners.length; i++) {
                m_listeners[i].xh = i + 1;
            }
            layui.table.reload('listenPlugInTable', {
                data: m_listeners
            });
        })
    }
}

/**
 * 加载模版所有活动配置的应用程序
 */
function loadProcessApps(bDatabase) {
    const height = $('#panelContent').height();
    layui.table.render({
        elem: '#procAppTable',
        id: 'procAppTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'numbers', title: '序号', align: 'center', fixed: 'left', width: 45 },
            { field: 'appName', title: '名称', align: 'center', width: 200 },
            { field: 'appType', title: '类型', align: 'center', width: 100 },
            { field: 'appClassify', title: '分类', align: 'center' },
            { field: 'appForuse', title: '用途', align: 'center', width: 100 },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barProcAppMgr', fixed: 'right', width: 140 }
        ]]
    });
    layui.table.on('tool(procAppTable)', function (obj) {
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
            updateApp(optApp);
        }
    });
    if (!bDatabase) {
        // 仅打开属性窗口时查询应用程序信息
        getProcessAppsData();
    }
}

/**
 * 查询数据库数据
 */
function getProcessAppsData() {
    // const strUrl = getBaseUrl() + '/bpm/process/queryAllApplications';
    // const resquestData = getApiPojo();
    // resquestData.processId = m_processId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            // 得到应用程序数据后，加载表格
            const applicationList = [] // res.resData.processApplications || [];
            applicationList.sort(compare('appBindSortnum'));
            layui.table.reload('procAppTable', {
                data: applicationList,
                limit: applicationList.length
            });
    //     } else {
    //         fnAlert(res.msg, null, false);
    //     }
    // }, null, true);
}

/**
 * 修改应用程序
 * @param setData
 */
function updateApp(setData) {
    const appNameData = setData.appName;
    const appTypeData = setData.appType;
    const appForuseData = setData.appForuse;
    const appPathData = setData.appPath;
    const relNoteData = setData.appPolicy;
    const appClassifyData = setData.appClassify;
    const obj = [{
        'id': 'appName',
        'name': '名称',
        'type': 'text',
        'data': appNameData,
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
        'id': 'appForuse',
        'name': '用途',
        'type': 'text',
        'data': appForuseData,
        'disabled': true
    }];

    const modalObj = {
        'width': 500
    }
    fnFormDialog('应用程序', obj, null, function (modelIndex, layerObj, closeNow) {
        const strUrl = getBaseUrl() + '/bpm/process/appliction/update';
        const appObj = {
            appName: $('#appName').val(),
            appClassify: $('#appClassify').val()
        };
        appObj.appId = setData.appId;

        const resquestData = getApiPojo();
        resquestData.processId = m_processId;
        resquestData.data = appObj;
        postRequest(strUrl, resquestData, function (res) {
            // 数据保存成功后，属性表格
            if (res.code === 0) {
                const applicationList = table.cache['procAppTable'];
                for (let i = 0; i < applicationList.length; i++) {
                    if (applicationList[i].appId === setData.appId) {
                        applicationList[i].appName = $('#appName').val();
                        applicationList[i].appClassify = $('#appClassify').val();
                        break;
                    }
                }
                applicationList.sort(compare('appBindSortnum'));
                layui.table.reload('procAppTable', {
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
