let m_lineType = ''; // 流程连线类型
let m_lineNote = ''; // 流程连线描述（条件简易/复杂模式）

/**
 * 获取当前流程模版所有连线属性信息
 * @returns
 */
function loadProcessLines(processId) {
    // 从后端接口重新获取，先清除已有数组对象信息
    m_lines = [];
    // const strUrl = getBaseUrl() + '/bpm/process/queryAllLines';
    // const resquestData = getApiPojo();
    // resquestData.processId = processId;
    // postRequest(strUrl, resquestData, function (res) {
    //     if (res.code === 0) {
            const resArray = []; // res.resData.processLines;
            if (resArray != null && resArray.length > 0) {
                m_lines = resArray;
            }
    //     } else {
    //         fnAlert(res.msg, null, false);
    //     }
    // }, null, true);
}

/**
 * 编辑连线属性
 * @param lineId 连线ID
 * @returns
 */
function openLineProperty(lineId) {
    const strHtml = initLinePanel();

    const objModal = {
        'title': '连线属性',
        'modalIndex': -20000,
        'needQ': true,
        'width': 748,
        'height': 454
    };

    fnAlertShow(strHtml, objModal, function() {
        loadLineProperty(lineId);
    }, function(modelIndex, layerObj, closeNow) {
        m_needSave = true;
        saveLineProperty(lineId, closeNow);
    }, null, null, function() {
    	const currentObj = $('#attrForm').parents('.layui-layer-content');
    	if (currentObj) {
    		$('#attrForm').height(currentObj.height() - 20);
    		$('#attrForm').width(currentObj.width() - 20);
			if ($('#divLineCondition').css('display') === 'block') {
	    		layui.table.reload('lineParamTable', {
		            height: currentObj.height() - 275 > 112 ? currentObj.height() - 275 : 112,
		            width: currentObj.width() - 135
		        });
			}
    	}
    });
}

/**
 * 获取源活动ID
 * @param currLine 当前连线
 * @returns 源活动ID
 */
function getSourceTaskId(currLine) {
    const currSourceType = currLine.getSource().getParent().type;

    if (currSourceType === 'draw2d.ExclusiveGateway' ||
      currSourceType === 'draw2d.InclusiveGateway' ||
      currSourceType === 'draw2d.ParallelGateway') {
        const currSourceId = currLine.getSource().getParent().gatewayId;

        // 找到网关对应的父节点
        const lines = workflow.getLines();
        for (let i = 0; i < lines.getSize(); i++) {
            const temLine = lines.get(i);

            const tmpTargetType = temLine.getTarget().getParent().type;
            if (tmpTargetType === currSourceType) {
                const tmpTargetId = temLine.getTarget().getParent().gatewayId;
                if (tmpTargetId === currSourceId) {
                    const tmpSourceType = temLine.getSource().getParent().type;
                    if (tmpSourceType === 'draw2d.UserTask') {
                        return temLine.getSource().getParent().taskId;
                    }
                }
            }
        }
    } else if (currSourceType === 'draw2d.UserTask') {
        return currLine.getSource().getParent().taskId;
    }
}

/**
 * 获取目标活动ID
 * @param currLine 当前连线
 * @returns 目标活动ID
 */
function getTargetTaskId(currLine) {
    const currTargetType = currLine.getTarget().getParent().type;

    if (currTargetType === 'draw2d.ExclusiveGateway' ||
      currTargetType === 'draw2d.InclusiveGateway' ||
      currTargetType === 'draw2d.ParallelGateway') {
        const currTargetId = currLine.getTarget().getParent().gatewayId;

        // 找到网关对应的子节点
        const lines = workflow.getLines();
        for (let i = 0; i < lines.getSize(); i++) {
            const temLine = lines.get(i);

            const tmpSourceType = temLine.getSource().getParent().type;
            if (tmpSourceType === currTargetType) {
                const tmpSourceId = temLine.getSource().getParent().gatewayId;
                if (tmpSourceId === currTargetId) {
                    const tmpTargetType = temLine.getTarget().getParent().type;
                    if (tmpTargetType === 'draw2d.UserTask') {
                        return temLine.getTarget().getParent().taskId;
                    }
                }
            }
        }
    } else if (currTargetType === 'draw2d.UserTask') {
        return currLine.getTarget().getParent().taskId;
    }
}

/**
 * 加载活动业务变量
 * @returns
 */
function loadSourceTaskVars(line) {
    // 加载表格
    const height = 112;
    table.render({
        elem: '#lineParamTable',
        id: 'lineParamTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'numbers', title: '序号', align: 'center', width: 45 },
            { field: 'paramName', align: 'center', title: '业务变量名称', width: 265 },
            { field: 'paramValue', align: 'center', title: '业务变量标识', width: 150 },
            { field: 'paramClassify', align: 'center', title: '数据类型', width: 150 }
        ]]
    });

    const sourceId = getSourceTaskId(line);
    if (sourceId) {
        // 加载活动配置的业务变量参数
        const strUrl = getBaseUrl() + '/bpm/activity/parameter/queryByType';
        const resquestData = getApiPojo();
        resquestData.activityId = sourceId;
        resquestData.paramType = '业务变量';
        postRequest(strUrl, resquestData, function (res) {
            if (res.code === 0) {
                const activityParameterList  = res.resData.activityParameterList;
                table.reload('lineParamTable', {
                    data: activityParameterList
                });
            } else {
                fnAlert(res.msg, null, false);
            }
        }, null, true);
    }
}

/**
 * 加载连线信息
 * @param lineId 连线ID
 * @returns
 */
function loadLineProperty(lineId) {
    // 加载连线属性数据
    $('#lineId').val(lineId).attr('disabled', true);
    let currLine = {
        lineId: lineId,
        lineName: '',
        lineType: '默认连线',
        lineCondition: '',
        lineNote: '',
        processId: m_processId
    };
    let iIndex = -1;
    for (let i = 0; i < m_lines.length; i++) {
        if (m_lines[i].lineId === lineId) {
            iIndex = i;
            break;
        }
    }
    if (iIndex < 0) {
        m_lines.push(currLine);
    } else {
        currLine = m_lines[iIndex];
    }
    m_lineType = currLine.lineType;
    m_lineNote = currLine.lineNote;

    currLine.lineName = XMLDecode(currLine.lineName);
    layui.form.val('attrForm', currLine);
    currLine.lineName = XMLEncode(currLine.lineName);

    // 加载连线相关信息
    const line = workflow.getLine(lineId);
    const sourceObj = line.getSource().getParent();
    const targetObj = line.getTarget().getParent();

    // 如果是条件验证连线
    if (currLine.lineType === '条件验证连线') {
        loadSourceTaskVars(line);
        $('#divLineCondition').show();
    }

    // 多分支（父节点为网关，子节点为活动任务情况），支持设置连线类型和条件
    if (targetObj.type === 'draw2d.UserTask' && (sourceObj.type === 'draw2d.ExclusiveGateway' ||
      sourceObj.type === 'draw2d.InclusiveGateway' ||
      sourceObj.type === 'draw2d.ParallelGateway')) {
        $('#divLineType').show();
    }

    layui.use('form', function () {
        const form = layui.form;

        // 默认连线
        form.on('radio(defaultLine)', function (data) {
            if (this.checked && m_lineType !== '默认连线') {
                m_lineType = '默认连线';
                m_lineNote = '';
                $('#lineCondition').val('');
                $('#divLineCondition').hide();
            }
        });

        // 必选连线
        form.on('radio(requiredLine)', function (data) {
            if (this.checked && m_lineType !== '必选连线') {
                m_lineType = '必选连线';
                m_lineNote = '';
                $('#lineCondition').val('');
                $('#divLineCondition').hide();
                $('#lineCondition').val('1==1');
            }
        });

        // 条件连线
        form.on('radio(conditionLine)', function (data) {
            if (this.checked && m_lineType !== '条件验证连线') {
                m_lineType = '条件验证连线';
                m_lineNote = '简易表达式';
                $('#lineCondition').val('');
                loadSourceTaskVars(line);
                $('#divLineCondition').show();
            }
        });

        // 简易表达式
        form.on('radio(simpleMode)', function (data) {
            if (this.checked && m_lineNote !== '简易表达式') {
                m_lineNote = '简易表达式';
            }
        });

        // 复杂表达式
        form.on('radio(complicatedMode)', function (data) {
            if (this.checked && m_lineNote !== '复杂表达式') {
                m_lineNote = '复杂表达式';
            }
        });

        form.render();
    });
}

/**
 * 保存连线信息
 * @param lineId 连线ID
 * @returns
 */
function saveLineProperty(lineId, closeNow) {
    // let paramsObj = getFormAttrData('attrForm');
    const lineName = XMLEncode($('#lineName').val());
    let lineCondition = $('#lineCondition').val();
    const lineType = m_lineType;
    const lineNote = m_lineNote;

    let overLengthMsg = '';
    let res = testLowLength(lineName, 128);
    if (!res) {
        res = testEqualLength(lineName, 128);
    }
    if (!res) {
        overLengthMsg += '连线名称不能超过64位，';
    }
    res = testLowLength(lineCondition, 512);
    if (!res) {
        res = testEqualLength(lineCondition, 512);
    }
    if (!res) {
        overLengthMsg += '连线条件不能超过512位，';
    }

    if (overLengthMsg) {
        overLengthMsg += '请重新填写！';
        fnTip(overLengthMsg, 2000);
    } else {
        const line = workflow.getLine(lineId);
        line.lineName = lineName;
        line.setLabel(XMLDecode(lineName));
        if (lineType === '默认连线') {
            lineCondition = '';
            const targetId = getTargetTaskId(line);
            if (targetId) {
                line.condition = "${(submitType == '静默提交') || (" + targetId.replace(/-/g, '_') + "=='" + targetId + "' && submitType == '人工干预')}";
            } else {
                line.condition = null;
            }
        } else {
            if (lineCondition) {
                const targetId = getTargetTaskId(line);
                if (targetId) {
                    line.condition = '${((' + lineCondition + ") && submitType == '静默提交') || (" + targetId.replace(/-/g, '_') + "=='" + targetId + "' && submitType == '人工干预')}";
                } else {
                    lineCondition = '';
                    line.condition = '${' + targetId.replace(/-/g, '_') + "=='" + targetId + "' && submitType == '人工干预'}";
                }
            } else {
                lineCondition = '';
                const targetId = getTargetTaskId(line);
                if (targetId) {
                    line.condition = '${' + targetId.replace(/-/g, '_') + "=='" + targetId + "' && submitType == '人工干预'}";
                } else {
                    line.condition = null;
                }
            }
        }

        const currLine = {
            lineId: lineId,
            lineName: lineName,
            lineType: lineType,
            lineCondition: lineCondition,
            lineNote: lineNote,
            processId: m_processId
        };

        let iIndex = -1;
        for (let i = 0; i < m_lines.length; i++) {
            if (m_lines[i].lineId === currLine.lineId) {
                iIndex = i;
                break;
            }
        }

        if (iIndex < 0) {
            m_lines.push(currLine);
        } else {
            m_lines[iIndex] = currLine;
        }
        closeNow();
    }
}
