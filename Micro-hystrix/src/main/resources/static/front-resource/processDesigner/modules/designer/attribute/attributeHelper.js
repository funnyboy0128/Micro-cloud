
/**
 * 获得流程模版的面板对象
 * @returns {*[]}
 */
function getProcessPanelObj() {
    const res = [{
        id: 'procAttr',
        name: '过程属性',
        content: translateObjectToDiyForm(getProcessAttrObj())
    }, {
        id: 'actUserAuth',
        name: '参与者授权',
        content: getCandidateHtml()
    }
    // , {
    //     id: 'actParams',
    //     name: '参数',
    //     content: getParameterHtml()
    // }, {
    //     id: 'listenerPlugIn',
    //     name: '事件监听',
    //     content: getListenerPluginHtml()
    // }, {
    //     id: 'procApps',
    //     name: '应用程序管理',
    //     content: getAllApplicationHtml()
    // }
    ];
    // if ($('#deployModel').css('display') === 'none') {
    //     res.push({
    //         id: 'riskPoint',
    //         name: '流程监察',
    //         content: getRiskPointHtml()
    //     });
    // }
    return res;
}

/**
 * 获得流程活动的面板对象
 * @returns {*[]}
 */
function getActivityPanelObj() {
    const res = [{
        id: 'actAttr',
        name: '活动属性',
        content: translateObjectToDiyForm(getActivityAttrObj())
    }, {
        id: 'actUserAuth',
        name: '参与者授权',
        content: getCandidateHtml(true)
    }
    // , {
    //     id: 'actApps',
    //     name: '应用程序',
    //     content: getApplicationHtml()
    // }, {
    //     id: 'actParams',
    //     name: '参数',
    //     content: getParameterHtml()
    // }, {
    //     id: 'listenerPlugIn',
    //     name: '事件监听',
    //     content: getListenerPluginHtml()
    // }
    ];
    // if ($('#deployModel').css('display') === 'none') {
    //     res.push({
    //         id: 'riskPoint',
    //         name: '流程监察',
    //         content: getRiskPointHtml()
    //     });
    // }
    return res;
}

/**
 * 初始化流程模版面板
 * @returns {string}
 */
function initProcessPanel() {
    const panelObj = getProcessPanelObj();
    const res = getPanelHtml(panelObj);
    return res;
}

/**
 * 初始化流程活动面板
 * @returns {string}
 */
function initActivityPanel() {
    const panelObj = getActivityPanelObj();
    const res = getPanelHtml(panelObj);
    return res;
}

/**
 * 初始化流程模版连线面板
 * @returns {string}
 */
function initLinePanel() {
    const res = getLineHtml();
    return res;
}

/**
 * 将面板对象转化为对应的html字符串
 * @param panelObj
 * @returns {string}
 */
function getPanelHtml(panelObj) {
    let strHtml = '<div class="layui-tab layui-tab-brief m-0 h-100" lay-filter="actPanel" id="actAttrPanel">';
    strHtml += '    <ul class="layui-tab-title">';
    for (let i = 0; i < panelObj.length; i++) {
        if (i === 0) {
            strHtml += '    <li class="layui-this">' + panelObj[i].name + '</li>';
        } else {
            strHtml += '    <li>' + panelObj[i].name + '</li>';
        }
    }
    strHtml += '    </ul>';
    strHtml += '    <div id="panelContent" class="layui-tab-content p-0" style="height: calc(100% - 41px);">';
    for (let i = 0; i < panelObj.length; i++) {
        if (i === 0) {
            strHtml += '    <div id="' + panelObj[i].id + '" class="layui-tab-item layui-show h-100" style="overflow: hidden;">';
        } else {
            strHtml += '    <div id="' + panelObj[i].id + '" class="layui-tab-item  h-100" style="overflow: hidden;">';
        }
        strHtml += panelObj[i].content;
        strHtml += '    </div>';
    }
    strHtml += '    </div>';
    strHtml += '</div>';
    return strHtml;
}

/**
 * 获得执行期限字符串
 * @returns {string}
 */
function getLimitHtml() {
    let res = '';
    res += '<div class="layui-row">';
    res += '    <div class="layui-col-xs4 d-inline-flex">';
    res += '        <input type="text" class="layui-input" name="limitDay" id="limitDay">';
    res += '        <div class="layui-form-mid layui-word-aux ml-1 mr-1">天</div>';
    res += '    </div>';
    res += '    <div class="layui-col-xs4 d-inline-flex">';
    res += '        <select name="limitHour" id="limitHour">';
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            res += '   <option value="0' + i + '">0' + i + '</option>';
        } else {
            res += '   <option value="' + i + '">' + i + '</option>';
        }
    }
    res += '        </select>';
    res += '        <div class="layui-form-mid layui-word-aux ml-1 mr-1">时</div>';
    res += '    </div>';
    res += '    <div class="layui-col-xs4 d-inline-flex">';
    res += '        <select name="limitMinute" id="limitMinute">';
    for (let j = 0; j < 60; j++) {
        if (j < 10) {
            res += '   <option value="0' + j + '">0' + j + '</option>';
        } else {
            res += '   <option value="' + j + '">' + j + '</option>';
        }
    }
    res += '        </select>';
    res += '        <div class="layui-form-mid layui-word-aux ml-1 mr-1">分</div>';
    res += '    </div>';
    res += '</div>';
    return res;
}

/**
 * 获得流程模版相关属性对象
 * @returns {*[]}
 */
function getProcessAttrObj() {
    const res = [{
        name: '模板编码',
        type: 'text',
        colSpan: 12,
        id: 'processId',
        pfor: 'processId'
    }, {
        name: '模版名称',
        type: 'text',
        maxLength: 256,
        required: true,
        colSpan: 6,
        id: 'processName',
        pfor: 'processName'
    }, {
        name: '模版类型',
        type: 'text',
        maxLength: 256,
        colSpan: 6,
        id: 'processCategory',
        pfor: 'processCategory'
    }
    // , {
    //     name: '工作日类型',
    //     type: 'select',
    //     option: ['工作日', '所有日'],
    //     colSpan: 6,
    //     id: 'workdateType',
    //     pfor: 'workdateType'
    // }, {
    //     name: '执行期限',
    //     type: 'html',
    //     content: getLimitHtml(),
    //     colSpan: 6,
    //     id: 'processLimit',
    //     pfor: 'processLimit'
    // }, {
    //     name: '创建人',
    //     type: 'text',
    //     colSpan: 6,
    //     id: 'processCreateBy',
    //     pfor: 'processCreateBy'
    // }, {
    //     name: '创建时间',
    //     type: 'text',
    //     colSpan: 6,
    //     id: 'processCreateTime',
    //     pfor: 'processCreateTime'
    // }, {
    //     name: '模板状态',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     colSpan: 6,
    //     id: 'processState',
    //     pfor: 'processState'
    // }, {
    //     name: '流转控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     colSpan: 6,
    //     data: '禁用',
    //     id: 'processFlowctrl',
    //     pfor: 'processFlowctrl'
    // }, {
    //     name: '表单控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     colSpan: 6,
    //     data: '禁用',
    //     id: 'processFormctrl',
    //     pfor: 'processFormctrl'
    // }, {
    //     name: '执行者控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     colSpan: 6,
    //     data: '禁用',
    //     id: 'processExectrl',
    //     pfor: 'processExectrl'
    // }, {
    //     name: '工作区模式',
    //     type: 'select',
    //     option: ['流转线索模式', '业务表单模式'],
    //     colSpan: 6,
    //     id: 'processWorkareatype',
    //     pfor: 'processWorkareatype'
    // }, {
    //     name: '排序序号',
    //     type: 'text',
    //     dataType: 'int',
    //     required: true,
    //     colSpan: 6,
    //     id: 'processSortnum',
    //     pfor: 'processSortnum'
    // }, {
    //     name: '描述',
    //     type: 'textarea',
    //     maxLength: 256,
    //     colSpan: 12,
    //     id: 'processDescription',
    //     pfor: 'processDescription'
    // }
    ];
    return res;
}

/**
 * 获得活动相关属性对象
 * @returns {*[]}
 */
function getActivityAttrObj() {
    const res = [{
        name: '活动编码',
        type: 'text',
        colSpan: 12,
        id: 'activityId',
        pfor: 'activityId'
    }, {
        name: '活动名称',
        type: 'text',
        maxLength: 256,
        required: true,
        colSpan: 12, //6,
        id: 'activityName',
        pfor: 'activityName'
    }, 
    // {
    //     name: '活动类型',
    //     type: 'text',
    //     maxLength: 256,
    //     colSpan: 6,
    //     id: 'activityCategory',
    //     pfor: 'activityCategory'
    // }, {
    //     name: '工作日类型',
    //     type: 'select',
    //     option: ['工作日', '所有日'],
    //     colSpan: 6,
    //     id: 'workdateType',
    //     pfor: 'workdateType'
    // }, {
    //     name: '办理期限',
    //     type: 'html',
    //     content: getLimitHtml(),
    //     colSpan: 6,
    //     id: 'activityLimit',
    //     pfor: 'activityLimit'
    // }, {
    //     name: '表单加载策略',
    //     type: 'select',
    //     option: ['上Tab', '下Tab', '左Tab', '右Tab', '折叠面板'],
    //     colSpan: 6,
    //     id: 'activityFormpolicy',
    //     pfor: 'activityFormpolicy'
    // }, {
    //     name: '执行策略',
    //     type: 'select',
    //     option: ['共享工作模式', '平行会签模式', '自动分派模式', '流程创建者', '上步活动执行者'],
    //     colSpan: 6,
    //     id: 'activityExepolicy',
    //     pfor: 'activityExepolicy'
    // }, {
    //     name: '启动策略',
    //     type: 'select',
    //     option: ['前序步骤全部完成', '前序步骤完成一步', '前序必选步骤完成', '强制合并进入步骤'],
    //     colSpan: 6,
    //     disabled: true,
    //     id: 'activityIncondition',
    //     pfor: 'activityIncondition'
    // }, {
    //     name: '提交策略',
    //     type: 'select',
    //     option: ['只能选择一条路径', '可以选择所有路径'],
    //     colSpan: 6,
    //     id: 'activityOutcondition',
    //     pfor: 'activityOutcondition'
    // }, {
    //     name: '流转控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     data: '禁用',
    //     colSpan: 6,
    //     id: 'activityFlowctrl',
    //     pfor: 'activityFlowctrl'
    // }, {
    //     name: '表单控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     data: '禁用',
    //     colSpan: 6,
    //     id: 'activityFormctrl',
    //     pfor: 'activityFormctrl'
    // }, {
    //     name: '执行者控制',
    //     type: 'select',
    //     option: ['启用', '禁用'],
    //     data: '禁用',
    //     colSpan: 6,
    //     id: 'activityExectrl',
    //     pfor: 'activityExectrl'
    // }, {
    //     name: '控制状态',
    //     type: 'text',
    //     maxLength: 16,
    //     colSpan: 6,
    //     id: 'activityGatestate',
    //     pfor: 'activityGatestate'
    // }, {
    //     name: '描述',
    //     type: 'textarea',
    //     maxLength: 256,
    //     colSpan: 12,
    //     id: 'activityNote',
    //     pfor: 'activityNote'
    // }
    ];
    return res;
}

/**
 * 转换对象为html
 * @param obj
 * @returns
 */
function translateObjectToDiyForm(obj) {
    if (!obj || obj.length <= 0) {
        return '对象传递错误';
    }
    let res = '<div class="layui-form layui-form-pane p-2" lay-filter="attrForm" id="attrForm" >';
    obj.forEach(function (item, index) {
        if (item.colSpan === undefined) {
            item.colSpan = 12;
        }
        res += '<div class="layui-col-xs' + item.colSpan + '">';
        switch (item.type) {
            case 'text': {
                res += getTextInput(item);
                break;
            }
            case 'select': {
                res += getSelectInput(item, 1);
                break;
            }
            case 'textarea': {
                res += getTextareaInput(item);
                break;
            }
            case 'html': {
                res += getHtmlInput(item);
                break;
            }
        }
        res += '</div>';
    })
    res += '</div>';
    return res;
}

function getHtmlInput(attrObj) {
    let res = '';
    res += '<div class="layui-form-item mb-0" aria-label="iTextarea" pane>';
    res += '    <label class="layui-form-label">' + attrObj.name + '</label>';
    res += '    <div class="layui-input-block">';
    res += attrObj.content;
    res += '    </div>';
    res += '</div>';
    return res;
}

/**
 * 获取属性页面的值
 * @param {String} contentId 需要遍历取值的属性面板id
 */
function getFormAttrData(contentId) {
    const res = {};
    if (contentId) {
        const currFormItemsDom = $('#' + contentId + ' .layui-form-item').find('[pfor]');
        if (currFormItemsDom.length > 0) {
            for (let i = 0; i < currFormItemsDom.length; i++) {
                const currObj = $(currFormItemsDom[i]);
                const currPFor = currObj.attr('pfor');
                let currVal = currObj.val();
                if (currObj[0].nodeName === 'SELECT' && currVal === null) {
                    currVal = XMLEncode(currObj.siblings('.layui-form-select').find('.layui-this').text());
                }
                if (currVal !== null && currVal !== undefined) {
                    res[currPFor] = XMLEncode(currVal);
                }
            }
        }
    }
    return res;
}

/**
 * 获得参与者授权面板html
 */
function getCandidateHtml(isHideCopyIntoOut) {
    let cloneStr = '';
    // cloneStr = '<button class="layui-btn layui-btn-warm ml-2 float-right" id="btnUserCopyInto">拷入</button>' +
    // '                 <button class="layui-btn layui-btn-warm ml-2 float-right" id="btnUserCopyOut">拷出</button>';
    // isHideCopyIntoOut && (cloneStr = '');
    let res = '<div  id="userAuthTools" class="p-2" style="height: 34px">';
    res += cloneStr;
    res += '    <button class="layui-btn layui-btn-danger ml-2 float-right" id="btnUserDelete">删除</button>';
    res += '    <button class="layui-btn geo-btn-default float-right" id="btnUserSelect">添加</button>';
    res += '</div>';
    res += '<div class="border-top"><table id="userAuthTable" lay-filter="userAuthTable"></table></div>';
    return res;
}

/**
 * 获得应用程序面板的html
 * @returns {string}
 */
function getApplicationHtml(isHideCopyIntoOut) {
    let cloneStr = '<button class="layui-btn layui-btn-warm ml-2 float-right" id="btnAppCopyInto">拷入</button>' +
    '                 <button class="layui-btn layui-btn-warm ml-2 float-right" id="btnAppCopyOut">拷出</button>';
    isHideCopyIntoOut && (cloneStr = '');
    let res = '<div id="appTools" class="p-2" style="height: 34px">';
    res += cloneStr;
    res += '    <button class="layui-btn layui-btn-danger ml-2 float-right" id="btnDeleteApp">删除</button>';
    res += '    <button class="layui-btn geo-btn-default float-right" id="btnAddApp">添加</button>';
    res += '</div>';
    res += '<div class="border-top"><table id="actAppTable" lay-filter="actAppTable"></table></div>';
    res += '<script type="text/html" id="barAppDemos">';
    res += '    <a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="previewApp">预览</a>';
    res += '    <a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateApp">修改</a>';
    res += '</script>';
    return res;
}

/**
 * 获得应用程序面板的html
 * @returns {string}
 */
function getAllApplicationHtml() {
    let res = '<div class="border-top"><table id="procAppTable" lay-filter="procAppTable"></table></div>';
    res += '<script type="text/html" id="barProcAppMgr">';
    res += '    <a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="previewApp">预览</a>';
    res += '    <a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateApp">修改</a>';
    res += '</script>';
    return res;
}

/**
 * 获得参数面板html
 * @returns {string}
 */
function getParameterHtml(isHideCopyIntoOut) {
    let cloneStr = '<button class="layui-btn layui-btn-warm ml-2 float-right" id="btnParamCopyInto">拷入</button>' +
    '                 <button class="layui-btn layui-btn-warm ml-2 float-right" id="btnParamCopyOut">拷出</button>';
    isHideCopyIntoOut && (cloneStr = '');
    let res = '<div id="paramsTools" class="p-2" style="height: 34px">';
    // res += '    <div class="layui-col-xs4 d-inline-flex">';
    // res += '     参数类型: <select name="paramType" id="paramType">';
    // res += '       <option value="流程参数">流程参数</option>';
    // res += '       <option value="业务变量">业务变量</option>';
    // res += '       <option value="打印菜单">打印菜单</option>';
    // res += '       <option value="工具菜单">工具菜单</option>';
    // res += '     </select>';
    // res += '    </div>';
    res += cloneStr;
    res += '    <button class="layui-btn layui-btn-danger ml-2 float-right" id="btnDeleteParam">删除</button>';
    res += '    <button class="layui-btn geo-btn-default float-right" id="btnAddParam">添加</button>';
    res += '</div>';
    res += '<div class="border-top"><table id="paramTable" lay-filter="paramTable"></table></div>';
    res += '<script type="text/html" id="barParamDemos">';
    res += '    <a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateParam">修改</a>';
    res += '</script>';
    return res;
}

/**
 * 获得事件监听配置面板html
 */
function getListenerPluginHtml(isHideCopyIntoOut) {
    let cloneStr = '<button class="layui-btn layui-btn-warm ml-2 float-right" id="btnPlugInCopyInto">拷入</button>' +
    '                 <button class="layui-btn layui-btn-warm ml-2 float-right" id="btnPlugInCopyOut">拷出</button>';
    isHideCopyIntoOut && (cloneStr = '');
    let res = '<div id="plugInConfigTools" class="p-2" style="height: 34px">';
    res += cloneStr;
    res += '    <button class="layui-btn layui-btn-danger ml-2 float-right" id="btnDeleteListenPlugIn">删除</button>';
    res += '    <button class="layui-btn geo-btn-default float-right" id="btnAddListenPlugIn">添加</button>';
    res += '</div>';
    res += '<div class="border-top"><table id="listenPlugInTable" lay-filter="listenPlugInTable"></table></div>';
    res += '<script type="text/html" id="barlistenPlugInDemos">';
    res += '    <a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="updateListenPlugIn">修改</a>';
    res += '</script>';
    return res;
}
// 获得风险点配置面板html
function getRiskPointHtml() {
    const html = '<div id="riskPointParamContainer">' +
    '              <div class="param-container layui-form" lay-filter="riskPointParamForm">' +
    '                 <div class="param-content">' +
    '                   <div class="control-box" id="timeRiskPointContainer">' +
    '                     <div class="control-title">' +
    '                       <div class="title-checkbox">' +
    '                         <input type="checkbox" lay-filter="checkTimeRiskPoint" lay-skin="primary"><span>时间风险点监控</span>' +
    '                       </div>' +
    '                       <div class="type-box">' +
    '                         <input type="radio" lay-filter="timeRiskPointType" name="timeRiskPointType" value="global" title="使用全局预警监察配置">' +
    '                         <input type="radio" lay-filter="timeRiskPointType" name="timeRiskPointType" value="custom" title="定制预警监察配置">' +
    '                       </div>' +
    '                     </div>' +
    '                     <div class="control-content">' +
    '                       <div class="risk-table">' +
    '                         <table id="riskPointTimeControl" lay-filter="riskPointTimeControl"></table>' +
    '                       </div>' +
    '                     </div>' +
    '                   </div>' +
    '                   <div class="control-box" id="userRiskPointContainer">' +
    '                     <div class="control-title">' +
    '                       <div class="title-checkbox">' +
    '                         <input type="checkbox" lay-filter="checkUserRiskPoint" lay-skin="primary"><span>人员风险点监控</span>' +
    '                       </div>' +
    '                       <div class="type-box">' +
    '                         <input type="radio" lay-filter="userRiskPointType" name="userRiskPointType" value="global" title="使用全局预警监察配置">' +
    '                         <input type="radio" lay-filter="userRiskPointType" name="userRiskPointType" value="custom" title="定制预警监察配置">' +
    '                       </div>' +
    '                      </div>' +
    '                     <div class="control-content">' +
    '                       <div class="item-control-content">' +
    '                         <input type="checkbox" name="noDefaultUser" title="无默认参与者预警" lay-skin="primary">' +
    '                         <div class="select-box" lay-filter="noDefaultUserRank">' +
    '                           <select id="noDefaultUserRank" lay-ignore="" class="select2" >' +
    '                           </select>' +
    '                         </div>' +
    '                       </div>' +
    '                       <div class="item-control-content">' +
    '                         <input type="checkbox" name="selectOtherUser" title="另选参与者预警(前提同时存在默认参与者)" lay-skin="primary">' +
    '                         <div class="select-box" lay-filter="selectOtherUserRank">' +
    '                           <select id="selectOtherUserRank" lay-ignore="" class="select2">' +
    '                           </select>' +
    '                         </div>' +
    '                       </div>' +
    '                       <div class="risk-table">' +
    '                         <div class="btn-box border-top">' +
    '                           <button class="layui-btn geo-btn-default" id="addRiskPointUserControl">添加</button>' +
    '                           <button class="layui-btn layui-btn-danger" id="delRiskPointUserControl">删除</button>' +
    '                           <span class="ml-2 color-orange">提示：可对以下人员或角色进行风险预警操作</span>' +
    '                         </div>' +
    '                         <table id="riskPointUserControl" lay-filter="riskPointUserControl"></table>' +
    '                       </div>' +
    '                     </div>' +
    '                   </div>' +
    '                   <div class="control-box" id="docRiskPointContainer">' +
    '                     <div class="control-title">' +
    '                       <div class="title-checkbox">' +
    '                         <input type="checkbox" lay-filter="checkDocRiskPoint" lay-skin="primary"><span>要件风险点监控</span>' +
    '                       </div>' +
    '                       <div class="type-box">' +
    '                         <input type="radio" lay-filter="docRiskPointType" name="docRiskPointType" value="global" title="使用全局预警监察配置">' +
    '                         <input type="radio" lay-filter="docRiskPointType" name="docRiskPointType" value="custom" title="定制预警监察配置">' +
    '                       </div>' +
    '                     </div>' +
    '                     <div class="control-content">' +
    '                       <div class="item-control-content">' +
    '                           <input type="checkbox" name="noNeedDoc" title="必传附件未上传预警" lay-skin="primary">' +
    '                           <div class="select-box" lay-filter="noNeedDocRank">' +
    '                             <select id="noNeedDocRank" lay-ignore="" class="select2">' +
    '                             </select>' +
    '                           </div>' +
    '                       </div>' +
    '                       <div class="item-control-content">' +
    '                           <input type="checkbox" name="noDoc" title="无任何附件预警" lay-skin="primary">' +
    '                           <div class="select-box" lay-filter="noDocRank">' +
    '                             <select id="noDocRank" lay-ignore="" class="select2">' +
    '                             </select>' +
    '                           </div>' +
    '                       </div>' +
    '                     </div>' +
    '                   </div>' +
    '                   <div class="control-box" id="exceptionOperationContainer">' +
    '                     <div class="control-title">' +
    '                       <div class="title-checkbox">' +
    '                         <input type="checkbox" lay-filter="checkOperateRiskPoint" lay-skin="primary"><span>异常操作监控</span>' +
    '                       </div>' +
    '                       <div class="type-box">' +
    '                         <input type="radio" lay-filter="operateRiskPointType" name="operateRiskPointType" value="global" title="使用全局预警监察配置">' +
    '                         <input type="radio" lay-filter="operateRiskPointType" name="operateRiskPointType" value="custom" title="定制预警监察配置">' +
    '                       </div>' +
    '                     </div>' +
    '                     <div class="control-content">' +
    '                         <div class="risk-table">' +
    '                             <div class="btn-box border-top">' +
    '                               <button class="layui-btn geo-btn-default" id="addExceptionOperation">添加</button>' +
    '                               <button class="layui-btn layui-btn-danger" id="delexcEptionOperation">删除</button>' +
    '                             </div>' +
    '                             <table id="exceptionOperationControl" lay-filter="exceptionOperationControl"></table>' +
    '                         </div>' +
    '                     </div>' +
    '                   </div>' +
    '                   <div class="control-box" id="flowVarsRiskPointContainer">' +
    '                     <div class="control-title">' +
    '                       <div class="title-checkbox">' +
    '                         <input type="checkbox" lay-filter="checkFlowVarsRiskPoint" lay-skin="primary"><span>业务风险点监控</span>' +
    '                       </div>' +
    '                     </div>' +
    '                     <div class="control-content">' +
    '                         <div class="risk-table">' +
    '                             <div class="btn-box border-top">' +
    '                               <button class="layui-btn geo-btn-default" id="addFlowVarsRiskPoint">添加</button>' +
    '                               <button class="layui-btn layui-btn-danger" id="delFlowVarsRiskPoint">删除</button>' +
    '                             </div>' +
    '                             <table id="flowVarsRiskPointControl" lay-filter="flowVarsRiskPointControl"></table>' +
    '                         </div>' +
    '                     </div>' +
    '                   </div>' +
    '                </div>' +
    '              </div>' +
    '          </div>';
    return html;
}
/**
 * 获得连线属性html
 * @returns {string}
 */
function getLineHtml() {
    /* let obj = [{
        name: "连线名称",
        type: "text",
        colSpan: 12,
        id: "lineName",
        pfor: "lineName"
    }, {
        name: "连线类型",
        type: "radiobox",
        inputName: "radLineType",
        option: [{
            title: "默认连线",
            value: "默认连线",
            id: "defaultLine",
            pfor: "defaultLine"
        }, {
            title: "必选连线",
            value: "必选连线",
            id: "requiredLine",
            pfor: "requiredLine"
        }, {
            title: "条件验证连线",
            value: "条件验证连线",
            id: "conditionLine",
            pfor: "conditionLine"
        }],
        colSpan: 12,
        id: "lineType",
        pfor: "lineType"
    }];
  let res = translateObjectToForm(obj);*/

    let res = '<div class="layui-form scrollbar" id="attrForm" lay-filter="attrForm" style="padding:10px;height:330px;">';
    res += '  <div class="layui-form-item">';
    res += '    <label class="layui-form-label">连线标识</label>';
    res += '    <div class="layui-input-block">';
    res += '      <input type="text" id="lineId" lay-filter="lineId" name="lineId" class="layui-input form-control" placeholder="连线标识" pfor="lineId" />';
    res += '    </div>';
    res += '  </div>';
    res += '  <div class="layui-form-item">';
    res += '    <label class="layui-form-label">连线名称</label>';
    res += '    <div class="layui-input-block">';
    res += '      <input type="text" id="lineName" lay-filter="lineName" name="lineName" class="layui-input form-control" placeholder="连线名称" pfor="lineName" />';
    res += '    </div>';
    res += '  </div>';
    res += '  <div id="divLineType" class="layui-form-item" style="display:none;">';
    res += '    <label class="layui-form-label">连线类型</label>';
    res += '    <div class="layui-input-block">';
    res += '      <input type="radio" index="0" id="defaultLine" lay-filter="defaultLine" name="lineType" title="默认连线" value="默认连线" pfor="defaultLine" lay-skin="primary">';
    res += '      <input type="radio" index="1" id="requiredLine" lay-filter="requiredLine" name="lineType" title="必选连线" value="必选连线" pfor="requiredLine" lay-skin="primary">';
    res += '      <input type="radio" index="2" id="conditionLine" lay-filter="conditionLine" name="lineType" title="条件验证连线" value="条件验证连线" pfor="conditionLine" lay-skin="primary">';
    res += '    </div>';
    res += '  </div>';
    res += '  <div id="divLineCondition" class="layui-form-item layui-form-text" style="display:none;">';
    res += '    <label class="layui-form-label">条件表达式</label>';
    res += '    <div class="layui-input-block">';
    res += '      <table id="lineParamTable" lay-filter="lineParamTable"></table>';
    res += '    </div>';
    res += '    <div class="layui-input-block" style="margin-top:10px;display:none;">';
    res += '      <input type="radio" index="0" id="simpleMode" lay-filter="simpleMode" name="lineNote" title="简易表达式" value="简易表达式" pfor="simpleMode" lay-skin="primary">';
    res += '      <input type="radio" index="1" id="complicatedMode" lay-filter="complicatedMode" name="lineNote" title="复杂表达式" value="复杂表达式" pfor="complicatedMode" lay-skin="primary">';
    res += '    </div>';
    res += '    <div class="layui-input-block" style="margin-top:10px;">';
    res += '      <textarea placeholder="条件表达式" class="layui-textarea" id="lineCondition" lay-filter="lineCondition" name="lineCondition" pfor="lineCondition"></textarea>';
    res += '    </div>';
    res += '  </div>';
    res += '</div>';

    return res;
}
/**
 * 渲染风险点
 * @param type { String } 类型， 值为：活动 / 过程
 * @param nodeId { String } processId或activityId值
 */
var mArrWarnLevels = [];
function renderRiskPoint(type, nodeId) {
    const table = layui.table;
    const form = layui.form;
    const methods = {
        init: function () {
            const self = this;
            // 查询风险级别
            const url = getBaseUrl() + '/bpm/riskpoint/warnlevel/query';
            const reqData = getApiPojo();
            postRequest(url, reqData, function (res) {
                if (res.code === 0) {
                    const warnLevels = res.resData && res.resData.warnLevels || [];
                    mArrWarnLevels = warnLevels;
                    // 查询风险点
                    const getRiskPointUrl = getBaseUrl() + '/bpm/riskpoint/query';
                    reqData.actType = type;
                    reqData.actId = nodeId;
                    postRequest(getRiskPointUrl, reqData, function (resRiskPoint) {
                        if (resRiskPoint.code === 0) {
                            const warnParams = resRiskPoint.resData && resRiskPoint.resData.warnParams || [];
                            const riskPoints = resRiskPoint.resData && resRiskPoint.resData.riskPoints || [];
                            let isCheckTimeRiskPoint = false;
                            let isCheckUserRiskPoint = false;
                            let isCheckDocRiskPoint = false;
                            let isCheckExceptionOperate = false;
                            let isCheckFlowVarsRiskPoint = false;
                            riskPoints.forEach(function (item) {
                                switch (item.riskType) {
                                    case '时间预警': {
                                        isCheckTimeRiskPoint = true;
                                        break;
                                    }
                                    case '人员预警': {
                                        isCheckUserRiskPoint = true;
                                        break;
                                    }
                                    case '要件预警': {
                                        isCheckDocRiskPoint = true;
                                        break;
                                    }
                                    case '业务预警': {
                                        isCheckFlowVarsRiskPoint = true;
                                        break;
                                    }
                                    case '操作预警': {
                                        isCheckExceptionOperate = true;
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            });
                            const arrTimes = [];
                            const arrUser = [];
                            const arrDocs = [];
                            const arrFlowVars = [];
                            const arrExptionOperates = [];
                            const times = [];
                            const mapWarnParams = function (item) {
                                switch (item.paramType) {
                                    case '时间预警': {
                                        times.push(item);
                                        break;
                                    }
                                    case '人员预警': {
                                        arrUser.push(item);
                                        break;
                                    }
                                    case '要件预警': {
                                        arrDocs.push(item);
                                        break;
                                    }
                                    case '业务预警': {
                                        arrFlowVars.push(item);
                                        break;
                                    }
                                    case '操作预警': {
                                        arrExptionOperates.push(item);
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }
                            }
                            warnParams.forEach(mapWarnParams);
                            const extendRenderData = function (arr, id, targetArr, index) {
                                let timeObj = null;
                                arr.forEach(function (item) {
                                    if (item.levelId === id) {
                                        timeObj = item;
                                        return;
                                    }
                                })
                                if (timeObj) {
                                    targetArr[index].LAY_CHECKED = true;
                                    targetArr[index].paramNote = timeObj.paramNote || '';
                                    targetArr[index].paramValue = timeObj.paramValue || '';
                                }
                            }
                            const pushData = function (arr, obj, type) {
                                arr.push({
                                    levelName: obj.levelName,
                                    levelId: obj.levelId,
                                    paramType: type,
                                    paramNote: '',
                                    paramValue: '',
                                    LAY_CHECKED: false
                                });
                            }
                            const warnLevelsMap = function (item, index) {
                                pushData(arrTimes, item, '时间预警');
                                extendRenderData(times, item.levelId, arrTimes, index);
                            }
                            warnLevels.forEach(warnLevelsMap);
                            // 渲染时间风险点
                            self.renderTimeRiskPoint(isCheckTimeRiskPoint, times.length > 0, arrTimes);
                            // 渲染人员风险点
                            self.renderUserRiskPoint(isCheckUserRiskPoint, arrUser, warnLevels);
                            // 渲染要件风险点
                            self.renderDocRiskPoint(isCheckDocRiskPoint, arrDocs, warnLevels);
                            // 渲染异常操作风险点
                            self.renderExceptionOperate(isCheckExceptionOperate, arrExptionOperates, warnLevels);
                            // 渲染业务风险点
                            self.renderFlowVarsRiskPoint(isCheckFlowVarsRiskPoint, arrFlowVars, warnLevels);
                        } else {
                            fnTip(resRiskPoint.msg, 2000);
                        }
                    });
                } else {
                    fnTip(res.msg, 2000)
                }
            });
        },
        /**
         * 渲染时间风险点方法
         * @param {*} isCheck { Boolean } 是否选中
         * @param {*} isRenderCustom { Boolean } 是否是定制
         * @param {*} arrTimes { Array } 时间风险点数据
         */
        renderTimeRiskPoint: function (isCheck, isRenderCustom, arrTimes) {
            const $timeRiskPointContainer = $('#timeRiskPointContainer');
            $timeRiskPointContainer.find('input[name="timeRiskPointType"]').eq(isRenderCustom ? 1 : 0).attr('checked', true);
            const $checkTimeRiskPoint = $timeRiskPointContainer.find('input[lay-filter="checkTimeRiskPoint"]');
            if (isCheck) {
                $checkTimeRiskPoint.attr('checked', true);
            } else {
                $checkTimeRiskPoint.attr('checked', false);
            }
            form.render();
            const isCustom = $timeRiskPointContainer.find('input[name="timeRiskPointType"]:checked').val() === 'custom';
            const renderCustom = function (isCustom) {
                if (isCustom) {
                    $timeRiskPointContainer.children('.control-content').removeClass('layui-hide');
                    methods.renderRiskPointTimeControl(arrTimes);
                } else {
                    $timeRiskPointContainer.children('.control-content').addClass('layui-hide');
                }
            }
            renderCustom(isCustom);
            // 切换选择全局配置/定制配置
            form.on('radio(timeRiskPointType)', function(data) {
                renderCustom(data.value === 'custom');
            });
            const renderCheck = function (isCheck) {
                const $timeRiskPointTypes = $timeRiskPointContainer.find('input[name="timeRiskPointType"]');
                if (isCheck) {
                    $timeRiskPointTypes.attr('disabled', false);
                } else {
                    $timeRiskPointTypes.attr('disabled', true);
                    $timeRiskPointTypes.eq(0).attr('checked', true).eq(1).attr('checked', false);
                    renderCustom(false);
                }
                form.render();
            }
            renderCheck(isCheck);
            // 选择是否选中时间风险点
            form.on('checkbox(checkTimeRiskPoint)', function(data) {
                renderCheck(data.elem.checked);
            });
        },
        /**
         * 渲染人员风险点方法
         * @param {*} isCheck { Boolean } 是否选中
         * @param {*} arrUser { Array } 人员风险点数据
         * @param {*} warnLevels { Array } 风险级别数据
         */
        renderUserRiskPoint: function (isCheck, arrUser, warnLevels) {
            const $userRiskPointContainer = $('#userRiskPointContainer');
            $userRiskPointContainer.find('input[name="userRiskPointType"]').eq(arrUser.length > 0 ? 1 : 0).attr('checked', true);
            const $checkUserRiskPoint = $userRiskPointContainer.find('input[lay-filter="checkUserRiskPoint"]');
            if (isCheck) {
                $checkUserRiskPoint.attr('checked', true);
            } else {
                $checkUserRiskPoint.attr('checked', false);
            }
            form.render();
            const userData = [];
            let noDefaultUserObj = null;
            let selectOtherUserObj = null;
            const mapArrUser = function (item) {
                item.paramType = '人员预警';
                if (item.paramNote !== '无默认参与者' && item.paramNote !== '另选参与者') {
                    userData.push(item);
                } else if (item.paramNote === '无默认参与者') {
                    noDefaultUserObj = item;
                } else if (item.paramNote === '另选参与者') {
                    selectOtherUserObj = item;
                }
            }
            arrUser.forEach(mapArrUser);
            const isCustom = $userRiskPointContainer.find('input[name="userRiskPointType"]:checked').val() === 'custom';
            const renderCustom = function (isCustom) {
                if (isCustom) {
                    $userRiskPointContainer.children('.control-content').removeClass('layui-hide');
                    methods.renderRiskPointUserControl(userData, warnLevels);
                    methods.renderRiskPointUserForm(noDefaultUserObj, selectOtherUserObj);
                    methods.renderUserRiskPointEvent(warnLevels);
                } else {
                    $userRiskPointContainer.children('.control-content').addClass('layui-hide');
                }
            }
            renderCustom(isCustom);
            // 切换选择全局配置/定制配置
            form.on('radio(userRiskPointType)', function(data) {
                renderCustom(data.value === 'custom');
            });
            const renderCheck = function (isCheck) {
                const $userRiskPointType = $userRiskPointContainer.find('input[name="userRiskPointType"]');
                if (isCheck) {
                    $userRiskPointType.attr('disabled', false);
                } else {
                    $userRiskPointType.attr('disabled', true);
                    $userRiskPointType.eq(0).attr('checked', true).eq(1).attr('checked', false);
                    renderCustom(false);
                }
                form.render();
            }
            renderCheck(isCheck);
            // 选择是否选中人员风险点
            form.on('checkbox(checkUserRiskPoint)', function(data) {
                renderCheck(data.elem.checked);
            });
        },
        /**
         * 渲染时间风险点表格
         * @param data { Array } 风险点数据
         */
        renderRiskPointTimeControl: function (data) {
            table.render({
                elem: '#riskPointTimeControl',
                id: 'riskPointTimeControl',
                cols: [[
                    { type: 'numbers', width: 60, align: 'center', title: '序号', fixed: 'left' },
                    {
                        title: '是否开启', width: 120, align: 'center', event: 'switch',
                        templet: function (d) {
                            const isChecked = d.LAY_CHECKED ? 'checked' : '';
                            const html = '<div>' +
                            '  <input type="checkbox" ' + isChecked + ' lay-filter="isOpen" lay-skin="switch" lay-text="开启|关闭">' +
                            '<div>';
                            return html;
                        }
                    },
                    {
                        field: 'levelName', title: '预警名称', align: 'center', minWidth: 150,
                        templet: '<div>{{d.levelName}}时间预警</div>'
                    },
                    {
                        field: 'paramValue', title: '超期百分比', align: 'center', event: 'isCanEdit',
                        templet: function (d) {
                            const convertValue = function (val) {
                                if (!val || typeof Number(val) !== 'number') {
                                    return ''
                                }
                                return numberPrecision(Number(val) * 100) + '%';
                            }
                            const isDisabled = d.LAY_CHECKED ? '' : 'disabled';
                            const value = convertValue(d.paramValue);
                            const html = '<div>' +
                            '  <input type="text"  placeholder="请输入超期百分比" class="layui-input overdue paramValue" ' + isDisabled + ' value="' + value + '">' +
                            '</div>';
                            return html;
                        }
                    },
                    {
                        field: 'paramNote', title: '备注', align: 'center',
                        templet: function(d) {
                            const value = d.paramNote || '';
                            const html = '<div>' +
                            ' <input type="text"  placeholder="请输入备注" class="layui-input overdue paramNote"  value="' + value + '">' +
                            '</div>';
                            return html;
                        }
                    },
                    { field: 'paramType', title: '类型', align: 'center', hide: true }
                ]],
                height: 240,
                data: data
            });
            table.on('tool(riskPointTimeControl)', function(obj) {
                const objData = obj.data;
                // 编辑超期百分比
                if (obj.event === 'isCanEdit') {
                    if (!obj.tr.find('.layui-form-switch').hasClass('layui-form-onswitch')) {
                        fnTip('请先开启后再编辑');
                        return;
                    }
                    const $overdue = obj.tr.find('.layui-input.overdue.paramValue');
                    // 失焦事件
                    $overdue.blur(function () {
                        const inputVal = $overdue.val().trim();
                        if (!/^([1-9]\d*|0)(\.\d+)?%$/.test(inputVal)) {
                            fnTip(objData.levelName + objData.paramType + '输入格式不正确，请输入百分数', 2000);
                            $overdue.val('').focus().click();
                            return;
                        }
                        const inputConvertVal = numberPrecision(Number(inputVal.split('%')[0]) / 100);
                        const checkedData = table.checkStatus('riskPointTimeControl').data;
                        let editCheckedIndex = -1;
                        for (let i = 0; i < checkedData.length; i++) {
                            if (checkedData[i].levelId === objData.levelId) {
                                editCheckedIndex = i;
                                break;
                            }
                        }
                        if (editCheckedIndex === -1) {
                            return;
                        } else if (editCheckedIndex === 0) {
                            if (inputConvertVal <= Number(checkedData[1] && checkedData[1].paramValue || 0)) {
                                fnTip(objData.levelName + objData.paramType + '超期百分比不小于' + checkedData[1].levelName + checkedData[1].paramType + '超期百分比', 2000);
                                $overdue.val('').focus().click();
                                return;
                            }
                        } else {
                            const prevData = checkedData[editCheckedIndex - 1];
                            const nextData = checkedData[editCheckedIndex + 1];
                            if (inputConvertVal >= Number(prevData.paramValue)) {
                                fnTip(objData.levelName + objData.paramType + '超期百分比不大于' + prevData.levelName + prevData.paramType + '超期百分比', 2000);
                                $overdue.val('').focus().click();
                                return;
                            } else if (nextData && nextData.paramValue && inputConvertVal <= Number(nextData.paramValue)) {
                                fnTip(objData.levelName + objData.paramType + '超期百分比不小于' + nextData.levelName + nextData.paramType + '超期百分比', 2000);
                                $overdue.val('').focus().click();
                                return;
                            }
                        }
                        obj.update({
                            paramValue: inputConvertVal
                        });
                    })
                }
                // 是否开启
                if (obj.event === 'switch') {
                    const isOpen = obj.tr.find('.layui-form-switch').hasClass('layui-form-onswitch');
                    obj.update({
                        LAY_CHECKED: isOpen
                    });
                    const $paramValue = obj.tr.find('.layui-input.overdue.paramValue');
                    if (!isOpen) {
                        $paramValue.attr('disabled', true).val('');
                        return;
                    }
                    $paramValue.attr('disabled', false).focus().click();
                }
                // 编辑备注
                if (obj.event === 'editParamNote') {
                    const $paramNote = obj.tr.find('.layui-input.overdue.paramNote');
                    $paramNote.blur(function () {
                        obj.update({
                            paramNote: $paramNote.val().trim()
                        });
                    })
                }
            });
        },
        /**
         * 注册人员风险点中的事件
         * @param { Array } data 风险级别数据
         */
        renderUserRiskPointEvent: function (data) {
            const self = this;
            // 无默认参与者下拉事件
            $('.select-box[lay-filter="noDefaultUserRank"] #noDefaultUserRank').on('select2:opening', function() {
                const $this = $(this);
                let noDefaultHtml = '<option>请选择风险级别<option>';
                const selectOtherUserRankVal = $('#selectOtherUserRank').val();
                let isDisabled = false;
                const mapData = function (item, index) {
                    if (item.levelId === selectOtherUserRankVal) {
                        isDisabled = true;
                    }
                    if (isDisabled) {
                        noDefaultHtml += '<option value="' + item.levelId + '" disabled>' + item.levelName + '</option>';
                    } else {
                        noDefaultHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>'
                    }
                }
                data.forEach(mapData);
                $this.html(noDefaultHtml).click();
                // return true;
            });
            // 无默认参与者下拉选择事件
            $('.select-box[lay-filter="noDefaultUserRank"] #noDefaultUserRank').on('select2:select', function(e) {
                const $selectOtherUser = $('input[name="selectOtherUser"]');
                if (e.delegateTarget.length - 1 === e.delegateTarget.selectedIndex) {
                    const noDefaultUserRankVal = $('#selectOtherUserRank').val();
                    if (!noDefaultUserRankVal || noDefaultUserRankVal === '请选择风险级别') {
                        $selectOtherUser.attr('disabled', true).attr('checked', false);
                    }
                } else {
                    $selectOtherUser.attr('disabled', false);
                }
                form.render();
            });
            // 另选参与者下拉事件
            $('.select-box[lay-filter="selectOtherUserRank"] #selectOtherUserRank').on('select2:opening', function() {
                const $this = $(this);
                const noDefaultUserRankVal = $('#noDefaultUserRank').val();
                // const isCheckedNoDefaultUserVal = $('#userRiskPointContainer input[name="noDefaultUser"]').next().hasClass('layui-form-checked');
                let selectOtherHtml = '<option value="请选择风险级别">请选择风险级别<option>';
                if (!noDefaultUserRankVal || noDefaultUserRankVal === '请选择风险级别') {
                    const mapData = function (item) {
                        selectOtherHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>';
                    }
                    data.forEach(mapData);
                    $this.html(selectOtherHtml).click();
                    return true;
                }
                // const noDefaultUserRankVal = $('#noDefaultUserRank').val();
                let isCanSelect = false;
                const mapData = function (item, index) {
                    if (!isCanSelect) {
                        selectOtherHtml += '<option value="' + item.levelId + '" disabled>' + item.levelName + '</option>'
                    } else {
                        selectOtherHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>'
                    }
                    if (item.levelId === noDefaultUserRankVal) {
                        isCanSelect = true;
                    }
                }
                data.forEach(mapData);
                $this.html(selectOtherHtml).click();
            });
            // 无默认参与者下拉选择事件
            $('.select-box[lay-filter="selectOtherUserRank"] #selectOtherUserRank').on('select2:select', function(e) {
                const $noDefaultUser = $('input[name="noDefaultUser"]');
                if (e.delegateTarget.selectedIndex === 2) {
                    const noDefaultUserRankVal = $('#noDefaultUserRank').val();
                    if (!noDefaultUserRankVal || noDefaultUserRankVal === '请选择风险级别') {
                        $noDefaultUser.attr('disabled', true).attr('checked', false);
                    }
                } else {
                    $noDefaultUser.attr('disabled', false);
                }
                form.render();
            });
            // 新增人员风险点事件
            $('#addRiskPointUserControl').off().on('click', function () {
                const tableData = table.cache['riskPointUserControl'];
                self.addOrEditRiskPointUser(data, tableData);
            });
            // 删除人员风险点事件
            $('#delRiskPointUserControl').off().on('click', function () {
                const checkedData = table.checkStatus('riskPointUserControl').data;
                if (checkedData.length < 1) {
                    fnTip('请先选择', 2000);
                    return;
                }
                fnConfirm('确定删除吗？', function (modelIndex, layero, closeNow) {
                    const tableData = table.cache['riskPointUserControl'];
                    for (let i = 0; i < checkedData.length; i++) {
                        for (let j = 0; j < tableData.length; j++) {
                            if (checkedData[i].levelId === tableData[j].levelId) {
                                tableData.splice(j, 1);
                                break;
                            }
                        }
                    }
                    table.reload('riskPointUserControl', { data: tableData, limit: tableData.length });
                    closeNow();
                });
            });
        },
        /**
         * 新增、修改人员风险点方法
         * @param { Array } selectData 风险级别数据
         * @param { Array } tableData 表格数据
         * @param { Object } updateData 待修改数据对象
         * @param { Object } toolObj table工具返回对象
         */
        addOrEditRiskPointUser: function (selectData, tableData, updateData, toolObj) {
            let optionHtml = '<option></option>';
            const mapSelectData = function (item) {
                optionHtml += '<option value="' + item.levelId + '"' + (updateData && updateData.levelId === item.levelId ? 'selected' : '') + '>' + item.levelName + '</option>';
            }

            selectData.forEach(mapSelectData);
            const tempHtml = '<div class="layui-form-pane pt-2 pb-2">' +
            '<div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '  <label class="layui-form-label required">风险级别</label>' +
            '  <div class="layui-input-block selectUserRiskRank-box">' +
            '    <select id="selectUserRiskRank" lay-ignore class="select2">' +
                  optionHtml +
            '    </select>' +
            '  </div>' +
            '</div>' +
            '<div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '  <label class="layui-form-label required">人员名称</label>' +
            '  <div class="layui-input-block user-select-box">' +
            '    <input type="text" id="txtUserName" lay-filter="txtUserName" name="txtUserName" class="layui-input form-control" placeholder="人员名称" disabled value="' + (updateData && updateData.userName ? updateData.userName : '') + '">' +
            '    <button class="layui-btn layui-btn-primary ' + (updateData ? 'layui-hide' : '') + '" id="btnSelectUserRisk">选择</button>' +
            '  </div>' +
            '  </div>' +
            '</div>';
            const obj = {
                title: (updateData ? '修改' : '新增') + '人员风险点'
            };
            let userNames = [];
            let arrUserObj = [];
            const showCallback = function () {
                renderSelect2('.selectUserRiskRank-box', 'selectUserRiskRank');
                const onSelectUserBcallBack = function (checkedPersons) {
                    if (checkedPersons.length < 1) {
                        fnTip('没有选择任何职员或角色', 2000);
                        return;
                    }
                    userNames = [];
                    arrUserObj = [];
                    const mapCheckedPersons = function (item) {
                        if (item.type === '角色' || item.type === '职员') {
                            userNames.push(item.name);
                            arrUserObj.push({
                                paramNote: item.type,
                                paramValue: item.id,
                                userName: item.name
                            });
                        }
                    }
                    checkedPersons.forEach(mapCheckedPersons);
                    $('#txtUserName').val(userNames.join(','));
                }
                !updateData && $('#btnSelectUserRisk').click(function () {
                    const arrRoleIds = [];
                    const arrUserIds = [];
                    tableData.forEach(function (item) {
                        if (item.paramNote === '角色') {
                            arrRoleIds.push(item.paramValue)
                        } else {
                            arrUserIds.push(item.paramValue)
                        }
                    });
                    const roleCallback = function (roleTreeObj) {
                        let chkDisabledNodes = [];
                        arrRoleIds.forEach(function (item) {
                            const nodes = roleTreeObj.getNodesByParam('id', item, null);
                            chkDisabledNodes = chkDisabledNodes.concat(nodes);
                        });
                        chkDisabledNodes.forEach(function (item) {
                            roleTreeObj.setChkDisabled(item, true);
                        });
                    }
                    const orgCallback = function (orgTreeObj) {
                        let chkDisabledNodes = [];
                        arrUserIds.forEach(function (item) {
                            const nodes = orgTreeObj.getNodesByParam('id', item, null);
                            chkDisabledNodes = chkDisabledNodes.concat(nodes);
                        });
                        const orgNodes = orgTreeObj.getNodesByParam('type', '组织', null);
                        chkDisabledNodes = chkDisabledNodes.concat(orgNodes);
                        chkDisabledNodes.forEach(function (item) {
                            orgTreeObj.setChkDisabled(item, true);
                        });
                    }
                    showRolesEmplyeeModal('', 'checkbox', function(checkedPersons, closeLayer) {
                        onSelectUserBcallBack(checkedPersons);
                        if (userNames.length > 0) {
                            closeLayer();
                        } else {
                            fnTip('请选择人员或角色');
                        }
                    }, roleCallback, orgCallback);
                });
            }
            const BCallback = function (lauyer, modalIndex, closeNow) {
                const riskPointRank = $('#selectUserRiskRank').val();
                if (!riskPointRank) {
                    fnTip('风险级别不能为空');
                    return;
                }
                if (!$('#txtUserName').val()) {
                    fnTip('人员不能为空');
                    return;
                }
                if (updateData) {
                    toolObj.update({
                        levelId: riskPointRank
                    })
                } else {
                    const mapArrUser = function (item) {
                        item.levelId = riskPointRank;
                        item.paramType = '人员预警';
                    }
                    arrUserObj.forEach(mapArrUser);
                    tableData = tableData.concat(arrUserObj);
                }
                table.reload('riskPointUserControl', { data: tableData, limit: tableData.length });
                closeNow();
            }
            fnAlertShow(tempHtml, obj, showCallback, BCallback);
        },
        /**
         * 渲染无默认参与者，另选参与者
         * @param { Object } noDefaultObj 无默认参与者对象
         * @param { Object } selectOtherObj 另选参与者对象
         */
        renderRiskPointUserForm: function (noDefaultObj, selectOtherObj) {
            const noDefaulLevelName = noDefaultObj && noDefaultObj.paramCode.split('人员预警')[0] || '';
            const selectOtherLevelName = selectOtherObj && selectOtherObj.paramCode.split('人员预警')[0] || '';
            renderSelect2('.select-box[lay-filter="noDefaultUserRank"]', 'noDefaultUserRank', { placeholder: '请选择风险级别' });
            renderSelect2('.select-box[lay-filter="selectOtherUserRank"]', 'selectOtherUserRank', { placeholder: '请选择风险级别' });
            if (noDefaultObj) {
                const optionHtml = '<option value="' + (noDefaultObj.levelId ? noDefaultObj.levelId : '') + '" selected>' + noDefaulLevelName + '</option>';
                const $noDefaultUserRank = $('#noDefaultUserRank');
                $noDefaultUserRank.html(optionHtml).trigger('change');
                $('#userRiskPointContainer input[name="noDefaultUser"]').attr('checked', true);
            }
            if (selectOtherObj) {
                const optionHtml = '<option value="' + (selectOtherObj.levelId ? selectOtherObj.levelId : '') + '" selected>' + selectOtherLevelName + '</option>';
                const $selectOtherUserRank = $('#selectOtherUserRank');
                $selectOtherUserRank.html(optionHtml).trigger('change');
                $('#userRiskPointContainer input[name="selectOtherUser"]').attr('checked', true);
            }
        },
        /**
         * 渲染人员风险点表格
         * @param { Array } data 表格数据
         * @param { Array } riskData 风险级别数据
         */
        renderRiskPointUserControl: function (data, riskData) {
            const self = this;
            table.render({
                elem: '#riskPointUserControl',
                id: 'riskPointUserControl',
                cols: [[
                    { type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
                    {
                        title: '预警名称', align: 'center',
                        templet: function (d) {
                            let levelName = '';
                            if (Array.isArray(riskData)) {
                                riskData.forEach(function(item) {
                                    if (d.levelId === item.levelId) {
                                        levelName = item.levelName;
                                        return;
                                    }
                                })
                            }
                            const html = '<div>' + levelName + '人员预警</div>';
                            return html;
                        }
                    },
                    { field: 'userName', title: '人员名称', align: 'center' },
                    { field: 'paramNote', title: '人员类别', align: 'center' },
                    { field: 'paramValue', title: '人员ID', align: 'center', hide: true },
                    { field: 'levelId', title: '风险等级ID', align: 'center', hide: true },
                    { field: 'paramType', title: '类型', align: 'center', hide: true },
                    {
                        title: '操作', align: 'center', width: 90, fixed: 'right',
                        templet: '<div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</div>'
                    }
                ]],
                height: 240,
                data: []
            });
            table.on('tool(riskPointUserControl)', function(obj) {
                // 修改风险人员或角色
                if (obj.event === 'edit') {
                    const tableData = table.cache['riskPointUserControl'];
                    self.addOrEditRiskPointUser(riskData, tableData, obj.data, obj);
                }
            });
            // 通过人员、角色ID获取参与者名称
            const getUserNameById = function (userId, type) {
                if (!userId) { return ''; }
                return new Promise(function (resolve) {
                    let url = getBaseUrl() + '/auth/';
                    const reqData = getApiPojo();
                    let requestType = postRequest;
                    if (type === '职员') {
                        url += 'user/queryByIds';
                        reqData.data = [userId];
                    }
                    if (type === '角色') {
                        url += 'role/get';
                        reqData.roleId = userId;
                        requestType = getRequest;
                    }
                    requestType(url, reqData, function (res) {
                        if (type === '职员') {
                            resolve(res.code === 0 && res.resData && res.resData.userInfo[0] && res.resData.userInfo[0].userName || '')
                        }
                        if (type === '角色') {
                            resolve(res.code === 0 && res.resData && res.resData.roleInfo && res.resData.roleInfo.roleName || '')
                        }
                    }, function () {
                        resolve('')
                    });
                })
            }
            const fnToData = function (currentValue, idx) {
                return new Promise(function (resolve) {
                    if (!currentValue.userName) {
                        getUserNameById(currentValue.paramValue, currentValue.paramNote).then(function (res) {
                            currentValue.userName = res;
                            resolve();
                        })
                    }
                })
            };

            const promiseList = [];
            const fnPromiseMap = function (item, idx) {
                promiseList.push(fnToData(item, idx));
            };
            data.forEach(fnPromiseMap);
            Promise.all(promiseList).then(function () {
                table.reload('riskPointUserControl', { data: data, limit: data.length });
            })
        },
        /**
         * 渲染要件风险点
         * @param { Boolean } isCheck 是否选中
         * @param { Array } arrDocs 要件风险点数据
         * @param { Array } warnLevels 风险级别
         */
        renderDocRiskPoint: function (isCheck, arrDocs, warnLevels) {
            const $docRiskPointContainer = $('#docRiskPointContainer');
            $docRiskPointContainer.find('input[name="docRiskPointType"]').eq(arrDocs.length > 0 ? 1 : 0).attr('checked', true);
            const $checkDocRiskPoint = $docRiskPointContainer.find('input[lay-filter="checkDocRiskPoint"]');
            if (isCheck) {
                $checkDocRiskPoint.attr('checked', true);
            } else {
                $checkDocRiskPoint.attr('checked', false);
            }
            form.render();
            const isCustom = $docRiskPointContainer.find('input[name="docRiskPointType"]:checked').val() === 'custom';
            const renderCustom = function (isCustom) {
                if (isCustom) {
                    $docRiskPointContainer.children('.control-content').removeClass('layui-hide');
                    methods.renderRiskPointDocForm(arrDocs);
                    methods.renderDocEvent(warnLevels);
                } else {
                    $docRiskPointContainer.children('.control-content').addClass('layui-hide');
                }
            }
            renderCustom(isCustom);
            form.on('radio(docRiskPointType)', function(data) {
                renderCustom(data.value === 'custom');
            });
            const renderCheck = function (isCheck) {
                const $docRiskPointType = $docRiskPointContainer.find('input[name="docRiskPointType"]');
                if (isCheck) {
                    $docRiskPointType.attr('disabled', false);
                } else {
                    $docRiskPointType.attr('disabled', true);
                    $docRiskPointType.eq(0).attr('checked', true).eq(1).attr('checked', false);
                    renderCustom(false);
                }
                form.render();
            }
            renderCheck(isCheck);
            form.on('checkbox(checkDocRiskPoint)', function(data) {
                renderCheck(data.elem.checked);
            });
        },
        /**
         * 渲染必传附件、无任何附件
         * @param { Array } arrDocs 附件风险点数据
         */
        renderRiskPointDocForm: function (arrDocs) {
            let noNeedDocObj = null;
            let noDocObj = null;
            arrDocs.forEach(function (item) {
                if (item.paramNote === '必传附件未上传') {
                    noNeedDocObj = item;
                }
                if (item.paramNote === '无任何附件') {
                    noDocObj = item;
                }
            });
            const noDefaulLevelName = noNeedDocObj && noNeedDocObj.paramCode.split('要件预警')[0] || '';
            const selectOtherLevelName = noDocObj && noDocObj.paramCode.split('要件预警')[0] || '';
            renderSelect2('.select-box[lay-filter="noNeedDocRank"]', 'noNeedDocRank', { placeholder: '请选择风险级别' });
            renderSelect2('.select-box[lay-filter="noDocRank"]', 'noDocRank', { placeholder: '请选择风险级别' });
            if (noNeedDocObj) {
                const optionHtml = '<option value="' + (noNeedDocObj.levelId ? noNeedDocObj.levelId : '') + '" selected>' + noDefaulLevelName + '</option>';
                const $noNeedDocRank = $('#noNeedDocRank');
                $noNeedDocRank.html(optionHtml).trigger('change');
                $('#docRiskPointContainer input[name="noNeedDoc"]').attr('checked', true);
            }
            if (noDocObj) {
                const optionHtml = '<option value="' + (noDocObj.levelId ? noDocObj.levelId : '') + '" selected>' + selectOtherLevelName + '</option>';
                const $noDocRank = $('#noDocRank');
                $noDocRank.html(optionHtml).trigger('change');
                $('#docRiskPointContainer input[name="noDoc"]').attr('checked', true);
            }
        },
        /**
         * 注册要件风险点中事件
         * @param { Array } data 风险级别数据
         */
        renderDocEvent: function(data) {
            $('.select-box[lay-filter="noNeedDocRank"] #noNeedDocRank').on('select2:opening', function() {
                const $this = $(this);
                let noDefaultHtml = '<option>请选择风险级别<option>';
                const noDocRankVal = $('#noDocRank').val();
                let isDisabled = false;
                const mapData = function (item, index) {
                    if (item.levelId === noDocRankVal) {
                        isDisabled = true;
                    }
                    if (isDisabled) {
                        noDefaultHtml += '<option value="' + item.levelId + '" disabled>' + item.levelName + '</option>'
                    } else {
                        noDefaultHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>'
                    }
                }
                data.forEach(mapData);
                $this.html(noDefaultHtml).click();
                // return true;
            });
            $('.select-box[lay-filter="noNeedDocRank"] #noNeedDocRank').on('select2:select', function(e) {
                const $noDoc = $('input[name="noDoc"]');
                if (e.delegateTarget.length - 1 === e.delegateTarget.selectedIndex) {
                    const noNeedDocRankVal = $('#noDocRank').val();
                    if (!noNeedDocRankVal || noNeedDocRankVal === '请选择风险级别') {
                        $noDoc.attr('disabled', true).attr('checked', false);
                    }
                } else {
                    $noDoc.attr('disabled', false);
                }
                form.render();
            });
            $('.select-box[lay-filter="noDocRank"] #noDocRank').on('select2:opening', function() {
                const $this = $(this);
                const noNeedDocRankVal = $('#noNeedDocRank').val();
                let selectOtherHtml = '<option value="请选择风险级别">请选择风险级别<option>';
                if (!noNeedDocRankVal || noNeedDocRankVal === '请选择风险级别') {
                    const mapData = function (item) {
                        selectOtherHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>';
                    }
                    data.forEach(mapData);
                    $this.html(selectOtherHtml).click();
                    return true;
                }
                let isCanSelect = false;
                const mapData = function (item, index) {
                    if (!isCanSelect) {
                        selectOtherHtml += '<option value="' + item.levelId + '" disabled>' + item.levelName + '</option>'
                    } else {
                        selectOtherHtml += '<option value="' + item.levelId + '">' + item.levelName + '</option>'
                    }
                    if (item.levelId === noNeedDocRankVal) {
                        isCanSelect = true;
                    }
                }
                data.forEach(mapData);
                $this.html(selectOtherHtml).click();
            });
            $('.select-box[lay-filter="noDocRank"] #noDocRank').on('select2:select', function(e) {
                const $noNeedDoc = $('input[name="noNeedDoc"]');
                if (e.delegateTarget.selectedIndex === 2) {
                    const noNeedDocRankVal = $('#noNeedDocRank').val();
                    if (!noNeedDocRankVal || noNeedDocRankVal === '请选择风险级别') {
                        $noNeedDoc.attr('disabled', true).attr('checked', false);
                    }
                } else {
                    $noNeedDoc.attr('disabled', false);
                }
                form.render();
            });
        },
        /**
         * 渲染异常操作风险点
         * @param { Boolean } isCheck 是否选中
         * @param { Array } arrExptionOperates 异常操作风险数据
         * @param { Array } warnLevels 风险级别
         */
        renderExceptionOperate: function (isCheck, arrExptionOperates, warnLevels) {
            const $exceptionOperationContainer = $('#exceptionOperationContainer');
            $exceptionOperationContainer.find('input[name="operateRiskPointType"]').eq(arrExptionOperates.length > 0 ? 1 : 0).attr('checked', true);
            const $checkOperateRiskPoint = $exceptionOperationContainer.find('input[lay-filter="checkOperateRiskPoint"]');
            if (isCheck) {
                $checkOperateRiskPoint.attr('checked', true);
            } else {
                $checkOperateRiskPoint.attr('checked', false);
            }
            form.render();
            const isCustom = $exceptionOperationContainer.find('input[name="operateRiskPointType"]:checked').val() === 'custom';
            const renderCustom = function (isCustom) {
                if (isCustom) {
                    $exceptionOperationContainer.children('.control-content').removeClass('layui-hide');
                    methods.renderExceptionOperationControl(arrExptionOperates, warnLevels);
                    methods.renderExceptionOperateEvent(warnLevels);
                } else {
                    $exceptionOperationContainer.children('.control-content').addClass('layui-hide');
                }
            }
            renderCustom(isCustom);
            form.on('radio(operateRiskPointType)', function(data) {
                renderCustom(data.value === 'custom');
            });
            const renderCheck = function (isCheck) {
                const $operateRiskPointType = $exceptionOperationContainer.find('input[name="operateRiskPointType"]');
                if (isCheck) {
                    $operateRiskPointType.attr('disabled', false);
                } else {
                    $operateRiskPointType.attr('disabled', true);
                    $operateRiskPointType.eq(0).attr('checked', true).eq(1).attr('checked', false);
                    renderCustom(false);
                }
                form.render();
            }
            renderCheck(isCheck);
            form.on('checkbox(checkOperateRiskPoint)', function(data) {
                renderCheck(data.elem.checked);
            });
        },
        /**
         * 注册异常操作风险点中事件
         * @param {Array} data 风险级别
         */
        renderExceptionOperateEvent: function (data) {
            const self = this;
            $('#addExceptionOperation').off().on('click', function () {
                const tableData = table.cache['exceptionOperationControl'];
                self.addOrEditExceptionOperate(data, tableData);
            });
            $('#delexcEptionOperation').off().on('click', function () {
                const checkedData = table.checkStatus('exceptionOperationControl').data;
                if (checkedData.length < 1) {
                    fnTip('请先选择', 2000);
                    return;
                }
                fnConfirm('确定删除吗？', function (modelIndex, layero, closeNow) {
                    const tableData = table.cache['exceptionOperationControl'];
                    for (let i = 0; i < checkedData.length; i++) {
                        for (let j = 0; j < tableData.length; j++) {
                            if (checkedData[i].levelId === tableData[j].levelId) {
                                tableData.splice(j, 1);
                                break;
                            }
                        }
                    }
                    table.reload('exceptionOperationControl', { data: tableData, limit: tableData.length });
                    closeNow();
                });
            });
        },
        /**
         * 新增，修改异常风险点方法
         * @param { Array } selectData 风险级别
         * @param { Array } tableData 表数据
         * @param { Object } updateData 待修改数据
         * @param { Object } toolObj table工具返回对象
         */
        addOrEditExceptionOperate: function (selectData, tableData, updateData, toolObj) {
            let optionHtml = '<option></option>';
            const mapSelectData = function (item) {
                optionHtml += '<option value="' + item.levelId + '" ' + (updateData && updateData.levelId === item.levelId ? 'selected' : '') + '>' + item.levelName + '</option>';
            }
            selectData.forEach(mapSelectData);
            const arrOperateType = [];
            if (type === '活动') {
                arrOperateType.push('退回', '修改', '删除', '转办', '续办', '补办')
            } else if (type === '过程') {
                arrOperateType.push('挂起', '废弃')
            }
            const arrOperateNames = [];
            tableData.forEach(function (item) {
                arrOperateNames.push(item.paramValue);
            })
            let operateOptionHtml = '<option></option>';
            const mapArrOperateType = function (item) {
                const isHased = arrOperateNames.indexOf(item) !== -1;
                operateOptionHtml += '<option ' + (isHased ? 'disabled' : '') + ' value="' + item + '">' + item + '</option>';
            }
            if (updateData) {
                operateOptionHtml = '<option checked value="' + (updateData.paramValue || '') + '">' + (updateData.paramValue || '') + '</option>';
            } else {
                arrOperateType.forEach(mapArrOperateType);
            }
            const tempHtml = '<div class="layui-form-pane pt-2 pb-2">' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label required">风险级别</label>' +
            '    <div class="layui-input-block selectOperateRiskRank-box">' +
            '      <select id="selectOperateRiskRank" lay-ignore class="select2">' +
                    optionHtml +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label required">操作类型</label>' +
            '    <div class="layui-input-block selectOperateType-box">' +
            '      <select id="selectOperateType" lay-ignore class="select2">' +
                    operateOptionHtml +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label">备注</label>' +
            '    <div class="layui-input-block selectOperateType-box">' +
            '      <textarea id="txtParamNote" placeholder="请输入备注" class="layui-textarea">' + (updateData && updateData.paramNote || '') + '</textarea>' +
            '    </div>' +
            '  </div>' +
            '</div>';
            const obj = {
                title: (updateData ? '修改' : '新增') + '异常操作风险点'
            };
            const showCallback = function () {
                renderSelect2('.selectOperateType-box', 'selectOperateType');
                renderSelect2('.selectOperateRiskRank-box', 'selectOperateRiskRank');
            }
            const BCallback = function (lauyer, modalIndex, closeNow) {
                const riskPointRank = $('#selectOperateRiskRank').val().trim();
                if (!riskPointRank) {
                    fnTip('风险级别不能为空');
                    return;
                }
                const selectOperateType = $('#selectOperateType').val().trim();
                if (!selectOperateType) {
                    fnTip('操作类型不能为空');
                    return;
                }
                const paramNote = $('#txtParamNote').val().trim();
                if (updateData) {
                    toolObj.update({
                        levelId: riskPointRank,
                        paramNote: paramNote
                    })
                } else {
                    tableData.push({
                        paramValue: selectOperateType,
                        levelId: riskPointRank,
                        paramType: '操作预警',
                        paramCode: selectOperateType + '操作预警',
                        paramNote: paramNote
                    });
                }
                table.reload('exceptionOperationControl', { data: tableData, limit: tableData.length });
                closeNow();
            }
            fnAlertShow(tempHtml, obj, showCallback, BCallback);
        },
        /**
         * 渲染异常操作风险点表格
         * @param { Array } data 表格数据
         * @param { Array } riskData 风险级别
         */
        renderExceptionOperationControl: function (data, riskData) {
            const self = this;
            table.render({
                elem: '#exceptionOperationControl',
                id: 'exceptionOperationControl',
                cols: [[
                    { type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
                    {
                        title: '级别', minWidth: 150, align: 'center',
                        templet: function (d) {
                            let levelName = '';
                            if (Array.isArray(riskData)) {
                                riskData.forEach(function (item) {
                                    if (d.levelId === item.levelId) {
                                        levelName = item.levelName;
                                        return;
                                    }
                                });
                            }
                            return '<div>' + levelName + '</div>'
                        }
                    },
                    { field: 'paramValue', title: '操作类型', align: 'center' },
                    { field: 'paramNote', title: '备注', align: 'center' },
                    { field: 'levelId', title: '风险等级ID', align: 'center', hide: true },
                    { field: 'paramType', title: '类型', align: 'center', hide: true },
                    {
                        title: '操作', align: 'center', width: 90, fixed: 'right',
                        templet: '<div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</div>'
                    }
                ]],
                height: 240,
                data: data
            });
            table.on('tool(exceptionOperationControl)', function(obj) {
                if (obj.event === 'edit') {
                    const tableData = table.cache['exceptionOperationControl'];
                    self.addOrEditExceptionOperate(riskData, tableData, obj.data, obj);
                }
            });
        },
        /**
         * 渲染业务风险点方法
         * @param { Boolean } isCheck 是否选中
         * @param { Array } arrFlowVars 业务风险点数据
         * @param { Array } warnLevels 风险级别数据
         */
        renderFlowVarsRiskPoint: function (isCheck, arrFlowVars, warnLevels) {
            const $flowVarsRiskPointContainer = $('#flowVarsRiskPointContainer');
            isCheck && $flowVarsRiskPointContainer.find('input[lay-filter="checkFlowVarsRiskPoint"]').attr('checked', true);
            form.render();
            methods.renderFlowVarsRiskPointControl(arrFlowVars, warnLevels);
            methods.renderFlowVarsEvent(warnLevels);
        },
        /**
         * 渲染业务风险点表格
         * @param {Array} data 表格数据
         * @param {Array} riskData 风险级别数据
         */
        renderFlowVarsRiskPointControl: function (data, riskData) {
            table.render({
                elem: '#flowVarsRiskPointControl',
                id: 'flowVarsRiskPointControl',
                cols: [[
                    { type: 'checkbox', width: 60, align: 'center', fixed: 'left' },
                    { field: 'paramValue', title: '条件表达式', align: 'center' },
                    {
                        title: '级别', minWidth: 150, align: 'center',
                        templet: function (d) {
                            let levelName = '';
                            if (Array.isArray(riskData)) {
                                riskData.forEach(function (item) {
                                    if (d.levelId === item.levelId) {
                                        levelName = item.levelName;
                                        return;
                                    }
                                });
                            }
                            return '<div>' + levelName + '</div>'
                        }
                    },
                    { field: 'paramNote', title: '备注', align: 'center' },
                    { field: 'levelId', title: '风险等级ID', align: 'center', hide: true },
                    { field: 'paramType', title: '类型', align: 'center', hide: true },
                    {
                        title: '操作', align: 'center', width: 90, fixed: 'right',
                        templet: '<div><button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">修改</div>'
                    }
                ]],
                height: 240,
                data: data
            });
            table.on('tool(flowVarsRiskPointControl)', function(obj) {
                if (obj.event === 'edit') {
                    const tableData = table.cache['flowVarsRiskPointControl'];
                    methods.addOrEditFlowVarsRiskPoint(riskData, tableData, obj.data);
                }
            });
        },
        /**
         * 新增，修改业务风险点
         * @param {Array} selectData 风险级别
         * @param {Array} tableData 表格数据
         * @param {Object} updateData 待修改数据
         */
        addOrEditFlowVarsRiskPoint: function (selectData, tableData, updateData) {
            let optionHtml = '<option></option>';
            const mapSelectData = function (item) {
                optionHtml += '<option value="' + item.levelId + '" ' + (updateData && updateData.levelId === item.levelId ? 'selected' : '') + '>' + item.levelName + '</option>';
            }
            selectData.forEach(mapSelectData);
            const tempHtml = '<div class="layui-form-pane pt-2 pb-2">' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label required">风险级别</label>' +
            '    <div class="layui-input-block selectOperateRiskRank-box">' +
            '      <select id="selectOperateRiskRank" lay-ignore class="select2">' +
                    optionHtml +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label required">条件表达式</label>' +
            '    <div class="layui-input-block selectOperateType-box">' +
            '      <textarea id="txtParamValue" placeholder="请输入条件表达式" class="layui-textarea">' + (updateData && updateData.paramValue || '') + '</textarea>' +
            '    </div>' +
            '  </div>' +
            '  <div class="layui-form-item border-0 mt-1 mx-3" aria-label="iText" pane>' +
            '    <label class="layui-form-label">备注</label>' +
            '    <div class="layui-input-block selectOperateType-box">' +
            '      <textarea id="txtParamNote" placeholder="请输入备注" class="layui-textarea">' + (updateData && updateData.paramNote || '') + '</textarea>' +
            '    </div>' +
            '  </div>' +
            '</div>';
            const obj = {
                title: (updateData ? '修改' : '新增') + '业务风险点'
            };
            const showCallback = function () {
                renderSelect2('.selectOperateRiskRank-box', 'selectOperateRiskRank');
            }
            const BCallback = function (lauyer, modalIndex, closeNow) {
                const riskPointRank = $('#selectOperateRiskRank').val().trim();
                if (!riskPointRank) {
                    fnTip('风险级别不能为空');
                    return;
                }
                const paramValue = $('#txtParamValue').val().trim();
                if (!paramValue) {
                    fnTip('条件表达式不能为空');
                    return;
                }
                const paramNote = $('#txtParamNote').val().trim();
                if (updateData) {
                    tableData.forEach(function (item) {
                        if (item.levelId === updateData.levelId) {
                            item.levelId = riskPointRank;
                            item.paramNote = paramNote;
                            item.paramValue = paramValue;
                            return;
                        }
                    });
                } else {
                    tableData.push({
                        paramValue: paramValue,
                        levelId: riskPointRank,
                        paramType: '业务预警',
                        paramCode: paramValue + '业务预警',
                        paramNote: paramNote
                    });
                }
                table.reload('flowVarsRiskPointControl', { data: tableData, limit: tableData.length });
                closeNow();
            }
            fnAlertShow(tempHtml, obj, showCallback, BCallback);
        },
        /**
         * 注册业务风险中事件
         * @param {Array} data 风险级别
         */
        renderFlowVarsEvent: function (data) {
            $('#addFlowVarsRiskPoint').off().on('click', function () {
                const tableData = table.cache['flowVarsRiskPointControl'];
                methods.addOrEditFlowVarsRiskPoint(data, tableData);
            });
            $('#delFlowVarsRiskPoint').off().on('click', function () {
                const checkedData = table.checkStatus('flowVarsRiskPointControl').data;
                if (checkedData.length < 1) {
                    fnTip('请先选择', 2000);
                    return;
                }
                fnConfirm('确定删除吗？', function (modelIndex, layero, closeNow) {
                    const tableData = table.cache['flowVarsRiskPointControl'];
                    for (let i = 0; i < checkedData.length; i++) {
                        for (let j = 0; j < tableData.length; j++) {
                            if (checkedData[i].levelId === tableData[j].levelId) {
                                tableData.splice(j, 1);
                                break;
                            }
                        }
                    }
                    table.reload('flowVarsRiskPointControl', { data: tableData, limit: tableData.length });
                    closeNow();
                });
            });
        }
    }
    methods.init();
}
/**
 * 保存风险点数据
 * @param {String} type 类型，值为: '活动' 或 '过程'
 * @param {String} activityId 活动ID
 * @param {String} processId 过程ID
 * @param {Function} callBack 保存成功回调
 */
function saveRiskPoint(type, activityId, processId, callBack) {
    const table = layui.table;
    const riskPoint = {
        riskpointAddDTOs: [],
        warnparamAddDTOs: []
    }
    const arrMsg = [];
    const pushRiskpointAddDTOs = function (riskType) {
        riskPoint.riskpointAddDTOs.push({
            actId: activityId ? activityId : '',
            procId: processId ? processId : '',
            riskType: riskType
        });
    }
    const pushWarnparamAddDTOs = function (item) {
        if (item.paramType === '时间预警') {
            if (!item.paramValue) {
                arrMsg.push(item.levelName + item.paramType);
            }
            item.paramValue = Number(item.paramValue);
        }
        if (!item.levelName && item.levelId) {
            item.levelName = '';
            mArrWarnLevels.forEach(function (levelsItem) {
                if (item.levelId === levelsItem.levelId) {
                    item.levelName = levelsItem.levelName
                }
            });
        }
        riskPoint.warnparamAddDTOs.push({
            'levelId': item.levelId,
            'paramCode': item.levelName + item.paramType,
            'paramNote': item.paramNote,
            'paramType': item.paramType,
            'paramValue': item.paramValue,
            'procId': processId ? processId : '',
            'actId': activityId ? activityId : ''
        });
    }
    const mapTableData = function (item) {
        pushWarnparamAddDTOs(item);
    }
    const $timeRiskPointContainer = $('#timeRiskPointContainer');
    if ($timeRiskPointContainer.find('input[lay-filter="checkTimeRiskPoint"]').attr('checked') === 'checked') {
        pushRiskpointAddDTOs('时间预警');
        if ($timeRiskPointContainer.find('input[lay-filter="timeRiskPointType"]:checked').val() === 'custom') {
            const timeRiskPointTableData = table.checkStatus('riskPointTimeControl').data;
            timeRiskPointTableData.forEach(mapTableData);
            if (arrMsg.length > 0) {
                fnTip(arrMsg.join('、') + '超期百分比不能为空', 2000);
                return false;
            }
        }
    }
    const $userRiskPointContainer = $('#userRiskPointContainer');
    if ($userRiskPointContainer.find('input[lay-filter="checkUserRiskPoint"]').attr('checked') === 'checked') {
        pushRiskpointAddDTOs('人员预警');
        if ($userRiskPointContainer.find('input[lay-filter="userRiskPointType"]:checked').val() === 'custom') {
            const userRiskPointTableData = table.cache['riskPointUserControl'];
            userRiskPointTableData.forEach(mapTableData);
            if ($userRiskPointContainer.find('input[name="noDefaultUser"]').attr('checked') === 'checked') {
                const noDefaultUserRank = $('#noDefaultUserRank').val();
                if (!noDefaultUserRank || noDefaultUserRank === '请选择风险级别') {
                    fnTip('请选择无默认参与者预警级别', 2000);
                    return false;
                }
                const itemObj = {
                    'levelId': noDefaultUserRank,
                    'paramNote': '无默认参与者',
                    'paramType': '人员预警',
                    'paramValue': ''
                }
                pushWarnparamAddDTOs(itemObj);
            }
            if ($userRiskPointContainer.find('input[name="selectOtherUser"]').attr('checked') === 'checked') {
                const selectOtherUserRank = $('#selectOtherUserRank').val();
                if (!selectOtherUserRank || selectOtherUserRank === '请选择风险级别') {
                    fnTip('请选择另选参与者预警级别', 2000);
                    return false;
                }
                const itemObj = {
                    'levelId': selectOtherUserRank,
                    'paramNote': '另选参与者',
                    'paramType': '人员预警',
                    'paramValue': ''
                }
                pushWarnparamAddDTOs(itemObj);
            }
        }
    }
    const $docRiskPointContainer = $('#docRiskPointContainer');
    if ($docRiskPointContainer.find('input[lay-filter="checkDocRiskPoint"]').attr('checked') === 'checked') {
        pushRiskpointAddDTOs('要件预警');
        if ($docRiskPointContainer.find('input[lay-filter="docRiskPointType"]:checked').val() === 'custom') {
            if ($docRiskPointContainer.find('input[name="noNeedDoc"]').attr('checked') === 'checked') {
                const noNeedDocRank = $('#noNeedDocRank').val();
                if (!noNeedDocRank || noNeedDocRank === '请选择风险级别') {
                    fnTip('必传附件未上传预警级别', 2000);
                    return false;
                }
                const itemObj = {
                    'levelId': noNeedDocRank,
                    'paramNote': '必传附件未上传',
                    'paramType': '要件预警',
                    'paramValue': ''
                }
                pushWarnparamAddDTOs(itemObj);
            }
            if ($docRiskPointContainer.find('input[name="noDoc"]').attr('checked') === 'checked') {
                const noDocRank = $('#noDocRank').val();
                if (!noDocRank || noDocRank === '请选择风险级别') {
                    fnTip('无任何附件预警级别', 2000);
                    return false;
                }
                const itemObj = {
                    'levelId': noDocRank,
                    'paramNote': '无任何附件',
                    'paramType': '要件预警',
                    'paramValue': ''
                }
                pushWarnparamAddDTOs(itemObj);
            }
        }
    }
    const $exceptionOperationContainer = $('#exceptionOperationContainer');
    if ($exceptionOperationContainer.find('input[lay-filter="checkOperateRiskPoint"]').attr('checked') === 'checked') {
        pushRiskpointAddDTOs('操作预警');
        if ($exceptionOperationContainer.find('input[lay-filter="operateRiskPointType"]:checked').val() === 'custom') {
            const exceptionOperationTableData = table.cache['exceptionOperationControl'];
            exceptionOperationTableData.forEach(mapTableData);
        }
    }
    const $flowVarsRiskPointContainer = $('#flowVarsRiskPointContainer');
    if ($flowVarsRiskPointContainer.find('input[lay-filter="checkFlowVarsRiskPoint"]').attr('checked') === 'checked') {
        pushRiskpointAddDTOs('业务预警');
        const flowVarsRiskPointTableData = table.cache['flowVarsRiskPointControl'];
        flowVarsRiskPointTableData.forEach(mapTableData);
    }
    const url = getBaseUrl() + '/bpm/riskpoint/update';
    const reqData = getApiPojo();
    reqData.actType = type;
    reqData.activityId = activityId ? activityId : '';
    reqData.processId = processId ? processId : '';
    reqData.data = riskPoint;
    postRequest(url, reqData, function (res) {
        if (res.code === 0) {
            callBack();
            return;
        }
        fnTip(res.msg, 2000);
    });
}
