/**
 * 加载流程模版树
 * @returns
 */
function loadParamConfig() {
    let strHtml = '<div id="panelContent" style="height: calc(100% - 41px);">';
    strHtml += '<div id="paramsTools" class="p-2" style="height: 34px">';
    strHtml += '    <button class="layui-btn layui-btn-danger ml-2 float-right" id="btnDeleteParamConfig">删除</button>';
    strHtml += '    <button class="layui-btn geo-btn-default float-right" id="btnAddParamConfig">添加</button>';
    strHtml += '</div>';
    strHtml += '<div style="margin-top:-10px;"><table id="paramConfigTable" lay-filter="paramConfigTable"></table></div>';
    strHtml += '<script type="text/html" id="barParamConfig">';
    strHtml += '    <a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateParamConfig">修改</a>';
    strHtml += '</script>';
    strHtml += '</div>';

    const objModal = {
        'title': '初始化参数管理',
        'modalIndex': -20000,
        'needQ': false,
        'needB': true,
        'width': 748,
        'height': 475
    };

    fnAlertShow(strHtml, objModal, function() {
        const height = $('#panelContent').height() - 20;
        // 加载table
        table.render({
            elem: '#paramConfigTable',
            id: 'paramConfigTable',
            data: [],
            height: height,
            limit: 100,
            even: true,
            cols: [[
                { type: 'checkbox', width: 40 },
                { type: 'numbers', title: '序号', align: 'center', width: 45 },
                { field: 'paramName', title: '名称', align: 'center' },
                { field: 'paramNote', title: '默认值', align: 'center' },
                { field: 'CZ', title: '操作', align: 'center', toolbar: '#barParamConfig', fixed: 'right', width: 80 }
            ]]
        });
        // 监听table数据的修改事件
        table.on('tool(paramConfigTable)', function (obj) {
            if (obj.event === 'updateParamConfig') {
                addOrEditParamConfig(false, obj.data)
            }
        });

        // 查询数据
        getParamConfigData();
        // 导出
        $('#btnAddParamConfig').off().on('click', function () {
            addOrEditParamConfig(true, null);
        });
        // 导出
        $('#btnDeleteParamConfig').off().on('click', function () {
            deleteParamConfig();
        });
    }, function(modelIndex, layerObj, closeNow) {
        closeNow();
    }, null, null, function() {
        layui.table.reload('paramConfigTable', {
            height: $('#panelContent').height() - 20,
            width: $('#panelContent').width()
        });
    });
}

/**
 * 查询数据库数据
 */
function getParamConfigData() {
    const strUrl = getBaseUrl() + '/bpm/parameter/get';
    const resquestData = getApiPojo();
    resquestData.paramParentId = 'BPM_INIT_PARAM';
    resquestData.paramParentType = '默认';
    postRequest(strUrl, resquestData, function (res) {
        if (res.code === 0) {
            const parameterList  = res.resData.parameterList;
            m_ParamConfigList = parameterList;
            parameterList.sort(compare('paramSortnum'));
            table.reload('paramConfigTable', {
                data: parameterList
            });
        } else {
            fnAlert(res.msg, null, false);
        }
    }, null, true);
}

function deleteParamConfig() {
    // 获得待删除参数信息
    const deleteParams = table.checkStatus('paramConfigTable').data;
    if (deleteParams == null || deleteParams.length < 1) {
        fnTip('请选择要删除的参数！', 1500);
    } else {
        fnConfirm('确认删除选中参数？', function (modelIndex, layerObj, closeNow) {
            closeNow();
            // 保存数据
            const arr = [];
            for (let i = 0; i < deleteParams.length; i++) {
                arr.push(deleteParams[i].paramName);
            }
            const strUrl = getBaseUrl() + '/bpm/parameter/delete';
            const reqObj = getApiPojo();
            reqObj.paramParentId = 'BPM_INIT_PARAM';
            reqObj.paramParentType = '默认';
            reqObj.data = arr;
            postRequest(strUrl, reqObj, function (res) {
                if (res.code === 0) {
                    const paramterList = table.cache['paramConfigTable'];
                    for (let i = paramterList.length - 1; i >= 0; i--) {
                        if (arr.indexOf(paramterList[i].paramName) > -1) {
                            paramterList.splice(i, 1);
                        }
                    }
                    m_ParamConfigList = paramterList;
                    table.reload('paramConfigTable', {
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
 * 添加或修改流程模版分类信息
 * @param bAdd 是否新增
 * @param setParam 分类父节点
 */
function addOrEditParamConfig(bAdd, setParam) {
    const paramterList = table.cache['paramConfigTable'];
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
        'id': 'paramSortnum',
        'name': '序号',
        'type': 'text',
        'dataType': 'int',
        'data': paramSortnumData,
        'required': true
    }, {
        'id': 'paramName',
        'name': '名称',
        'type': 'text',
        'maxLength': 64,
        'data': paramNameData,
        'required': true
    }, {
        'id': 'paramNote',
        'name': '默认值',
        'type': 'textarea',
        'maxLength': 512,
        'data': paramNoteData,
        'required': true
    }];
    fnFormDialog('参数信息', obj, function() {
        $('#fnFormDialog').addClass('scrollbar');
        $('#paramNote').attr('rows', 8);
        $('#fnFormDialog').append('<div style="color:red;">&nbsp;&nbsp;&nbsp;&nbsp;多个默认值选项请使用英文分号（;）拼接！</div>');
    }, function (modelIndex, layerObj, closeNow) {
        // 保存数据
        const paramObj = translateFormToObject(modelIndex);
        paramObj.paramType = '默认参数';
        paramObj.paramClassify = '默认参数';
        let strUrl = '';
        const resquestData = getApiPojo();
        resquestData.paramParentId = 'BPM_INIT_PARAM';
        resquestData.paramParentType = '默认';
        if (bAdd) {
            strUrl = getBaseUrl() + '/bpm/parameter/add';
        } else {
            strUrl = getBaseUrl() + '/bpm/parameter/update';
            resquestData.paramOriginalName = setParam.paramName;
        }
        resquestData.data = paramObj;
        postRequest(strUrl, resquestData, function (res) {
            if (res.code === 0) {
                // 数据保存后，刷新表格
                if (bAdd) {
                    paramterList.push({
                        paramName: $('#paramName').val(),
                        paramValue: $('#paramValue').val(),
                        paramType: '默认参数',
                        paramClassify: '默认参数',
                        paramSortnum: $('#paramSortnum').val(),
                        paramNote: $('#paramNote').val()
                    });
                } else {
                    for (let i = 0; i < paramterList.length; i++) {
                        if (paramterList[i].paramName === setParam.paramName) {
                            paramterList[i].paramName = $('#paramName').val();
                            paramterList[i].paramType = '默认参数';
                            paramterList[i].paramValue = $('#paramValue').val();
                            paramterList[i].paramClassify = '默认参数';
                            paramterList[i].paramSortnum = $('#paramSortnum').val();
                            paramterList[i].paramNote = $('#paramNote').val();
                            break;
                        }
                    }
                }
                paramterList.sort(compare('paramSortnum'));
                m_ParamConfigList = paramterList;
                table.reload('paramConfigTable', {
                    data: paramterList
                });
                closeNow();
                fnTip(res.msg, 1500);
            } else {
                fnAlert(res.msg, modelIndex + 1, false);
            }
        }, null, true);
    }, 1000, {
        'width': 500,
        'height': 390
    }, null, null, function() {
        $('#paramNote').height($('#fnFormDialog').height() - 120);
    });
}

/**
 * 默认参数集合
 */
let m_ParamConfigList = null;

/**
 * 重新渲染参数名下拉框
 */
function renderParamNameSelect(initParamName, initParamValue) {
    const optionArr = [];

    if (m_ParamConfigList == null) {
        const strUrl = getBaseUrl() + '/bpm/parameter/get';
        const resquestData = getApiPojo();
        resquestData.paramParentId = 'BPM_INIT_PARAM';
        resquestData.paramParentType = '默认';
        postRequest(strUrl, resquestData, function (res) {
            if (res.code === 0) {
                m_ParamConfigList = res.resData.parameterList;
                if (m_ParamConfigList) {
                    renderParamNameSelect(initParamName, initParamValue);
                }
            }
        }, null, true);
    } else {
        for (let i = 0; i < m_ParamConfigList.length; i++) {
            const item = m_ParamConfigList[i];
            if (optionArr.indexOf(item.paramName) === -1) {
                optionArr.push(item.paramName);
            }
        }

        if (!!initParamName && optionArr.indexOf(initParamName) === -1) {
            optionArr.unshift(initParamName);
        } else {
            if (!initParamName && optionArr.length > 0) initParamName = optionArr[0];
        }

        setEditableSelectValue('paramName', initParamName, optionArr);

        renderParamValueSelect(initParamName, initParamValue);
    }
}

/**
 * 重新渲染参数值下拉框
 */
function renderParamValueSelect(currParamName, initParamValue) {
    let optionParamValueArr = [];

    if (!!m_ParamConfigList && !!currParamName) {
        for (let i = 0; i < m_ParamConfigList.length; i++) {
            const item = m_ParamConfigList[i];
            if (item.paramName === currParamName) {
                const paramValue = item.paramNote;
                if (paramValue) {
                    optionParamValueArr = paramValue.split(';');
                }
                break;
            }
        }
    }

    if (!!initParamValue && optionParamValueArr.indexOf(initParamValue) === -1) {
        optionParamValueArr.unshift(initParamValue);
    }

    setEditableSelectValue('paramValue', initParamValue, optionParamValueArr);
}

/**
 * 设置可编辑下拉框值
 * @param {string} type 类型
 * @param {string} id 标识
 * @param {string} value 值
 * @param {Boolean} isInit 是否为初始化
 */
function setEditableSelectValue(id, value, optionArr) {
    const html = getParamSelectHtml(optionArr);
    $('#' + id).empty().append(html);
    $('#' + id).val(value);
}

/**
 * 获取下拉框选项html
 * @param {Array} optionArr 选项数组
 */
function getParamSelectHtml(optionArr) {
    let optionHtml = '';
    optionArr.forEach(function (option, index) {
        optionHtml += '<option index="' + index + '" value="' + option + '">' + option + '</option>';
    });
    return optionHtml;
}
