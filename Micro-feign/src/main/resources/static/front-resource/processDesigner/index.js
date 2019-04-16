'use strict';
$(function() {
    $('#descriptorarea').val('');
    $('#addCategory').hide();
    $('#updateCategory').hide();
    $('#deleteCategory').hide();
    // $('#saveProcess').hide();
    // $('#deployModel').hide();
    // $('#cloneProcess').hide();
    // $("#undoModel").hide();
    // $("#redoModel").hide();
    $('#deleteProcess').hide();
    $('#openProperties').hide();
    $('#configDoc').hide();
    // $('#moreTool').click(function (e) {
    //     cancelFlow(e);
    //     const $this = $(this);
    //     const $btnTools = $('#btnTools');
    //     if ($btnTools.hasClass('layui-hide')) {
    //         const top = $this.offset().top + $this.outerHeight(true) + 4;
    //         const right = $(window).width() - $this.offset().left - $this.outerWidth(true) + 5;
    //         const arrId = $this.attr('refid').split(';');
    //         const arrIcon = $this.attr('reficon').split(';');
    //         const arrName = $this.attr('refname').split(';');
    //         let strHtml = '';
    //         const isHideName = $this.children('em')[0].style.display === 'none';
    //         arrId.forEach(function (item, index) {
    //             strHtml += '<button id="' + item + '" class="layui-btn geo-btn-illusory" title="' + arrName[index] + '">';
    //             strHtml += '<i class="iconfont ' + arrIcon[index] + '"></i><em style="' + (isHideName ? 'display: none' : '') + '">' + arrName[index] + '</em>';
    //             strHtml += '</button>';
    //         });
    //         $btnTools.removeClass('layui-hide').html(strHtml).css({
    //             'right': right,
    //             'top': top
    //         });
    //         // 初始化参数管理
    //         $('#paramConfig').off().on('click', function () {
    //             loadParamConfig();
    //         });
    //         // 批量设置
    //         $('#batchSetting').off().on('click', function () {
    //             onSetting('批量设置');
    //         });
    //         // 全局设置
    //         $('#globalSetting').off().on('click', function () {
    //             onSetting('全局设置');
    //         });
    //     } else {
    //         $btnTools.addClass('layui-hide').html('');
    //     }
    // });
    // $('body').click(function () {
    //     const $btnTools = $('#btnTools');
    //     !$btnTools.hasClass('layui-hide') && $btnTools.addClass('layui-hide').html('');
    // });
    // 左右收缩按钮
    $('.swith-btn-left').click(function() {
        $('#menu,#dragbar').hide();
        $('#right').css('margin-left', '0');
        $('.swith-btn-left-open').show();
        if ($('#right .assembly-box').css('display') === 'block') {
            $('#right .form-box').width($('#right').width() - $('#right .assembly-box').width() - 10)
        } else {
            $('#right .form-box').width($('#right').width())
        }
    });
    $('.swith-btn-left-open').click(function() {
        $('#menu,#dragbar').show();
        $('#right').css('margin-left', $('#menu').width() + $('#dragbar').width());
        $(this).hide();
        $(window).resize();
        if ($('#right .assembly-box').css('display') === 'block') {
            $('#right .form-box').width($('#right').width() - $('#right .assembly-box').width() - 10)
        } else {
            $('#right .form-box').width($('#right').width())
        }
    });

    $('.swith-btn-right').click(function() {
        $('#right .assembly-box').hide();
        $('.swith-btn-right-open').show();
        $('#dragopen').css('right', '14px');
        $('#right .form-box').css('width', $('#right').width());
        if ($('#right .form-box .layui-btn-container').height() <= 40) {
            $('#dragopen').hide();
        }
    });
    $('.swith-btn-right-open').click(function() {
        $('#right .assembly-box').show();
        $(this).hide();
        $('#dragopen').css('right', '0');
        $(window).resize();
        if ($('#right .assembly-box').css('display') === 'block') {
            $('#right .form-box').width($('#right').width() - $('#right .assembly-box').width() - 10)
        } else {
            $('#right .form-box').width($('#right').width())
        }
    });

    // $('.swith-btn-right').click();

    // 加载流程模版树
    loadProcessCategory(null);

    // 新建流程模版
    $('#right .form-box .noinfo button').click(function() {
        createProcess();
    });

    // 导出
    $('#exportProcess').off().on('click', function () {
        exportProcess();
    });

    // 克隆
    // $('#cloneProcess').off().on('click', function () {
    //     cloneProcess();
    // });
    // 初始化导入
    // importProcess();

    // 流程模版设计器组件拖拽监听
    $('.dragbutton').draggable({
        appendTo: '#divDesigner',
        cursor: 'crosshair',
        helper: 'clone',
        scroll: false
    });
    // 监听组件拖拽后
    $('#divDesigner').droppable({
        drop: function(event, ui) {
            const dragObj = ui.draggable;
            if (dragObj) {
                const wfModel = $(dragObj.context).attr('wfModel');
                const shape = $(dragObj.context).attr('shape');

                if (wfModel) {
                // 如果当前是开始或者结束，需要验证是否已经存在，存在则提示
                    if (wfModel === 'Start') {
                        const models = workflow.getFigures();
                        for (let i = 0; i < models.getSize(); i++) {
                            const model = models.get(i);
                            if (model.type === 'draw2d.Start') {
                                fnTip('当前流程模版已经存在“开始”节点，请勿重复添加!', 2000);
                                return;
                            }
                        }
                    } else if (wfModel === 'End') {
                        const models = workflow.getFigures();
                        for (let i = 0; i < models.getSize(); i++) {
                            const model = models.get(i);
                            if (model.type === 'draw2d.End') {
                                fnTip('当前流程模版已经存在“结束”节点，请勿重复添加!', 2000);
                                return;
                            }
                        }
                    }
                    m_needSave = true;
                    const x = ui.offset.left;
                    const y = ui.offset.top;
                    const xOffset = workflow.getAbsoluteX();
                    const yOffset = workflow.getAbsoluteY();
                    const scrollLeft = workflow.getScrollLeft();
                    const scrollTop = workflow.getScrollTop();
                    addModel(wfModel, x - xOffset + scrollLeft, y - yOffset + scrollTop, shape);
                }
            }
        }
    });
    $('ul, li').disableSelection();

    myResizeFn();
    window.onresize = myResizeFn;
    bindResize(document.getElementById('dragbar'));
    $('#dragopen').click(function() {
        if ($('#right .form-box .list-title').css('height') === '40px') {
            $('#right .form-box .list-title').css('height', 'auto');
        } else {
            $('#right .form-box .list-title').css('height', '40px');
        }
    })
    $('#treeProcessCategory').click(function() {
        $(window).resize();
    })

    // 设置模版设计器页面自适应
    $(window).resize();
});

$(window).resize(function() {
    const bodyHeight = $(document.body).height();
    $('#divDesigner').css('height', bodyHeight - 51);
    $('#designer-area').css('height', bodyHeight - 51);
    $('#descriptorarea').css('height', bodyHeight - 51);
    $('#treeProcessCategory').css('height', bodyHeight - 41);
});

/**
 * tab选项卡切换绑定
 * @returns
 */
layui.use('element', function() {
    const element = layui.element;

    // 获取hash来切换选项卡，假设当前地址的hash为lay-id对应的值
    const layid = location.hash.replace(/^#designer=/, '');
    element.tabChange('designer', layid);

    // 监听Tab切换，以改变地址hash值
    element.on('tab(designer)', function() {
        if (this.getAttribute('lay-id') === 'codeTab') {
            if (workflow) {
                $('#descriptorarea').val(workflow.toXML());
            } else {
                $('#descriptorarea').val('');
            }
            $('#saveProcess').attr('disabled', 'disabled');
            $('#deployModel').attr('disabled', 'disabled');
            $('#cloneProcess').attr('disabled', 'disabled');
            // $("#undoModel").attr("disabled","disabled");
            // $("#redoModel").attr("disabled","disabled");
            $('#deleteProcess').attr('disabled', 'disabled');
            $('#openProperties').attr('disabled', 'disabled');
        } else {
            $('#saveProcess').removeAttr('disabled');
            $('#deployModel').removeAttr('disabled');
            $('#cloneProcess').removeAttr('disabled');
            // $("#undoModel").removeAttr("disabled");
            // $("#redoModel").removeAttr("disabled");
            $('#deleteProcess').removeAttr('disabled');
            $('#openProperties').removeAttr('disabled');
        }
    });
});

function myResizeFn() {
    const totalHeight = $(window).height();
    $('#menu,#dragbar,#right').height(totalHeight);
    $('#right').css('margin-left', $('#menu').width() + $('#dragbar').width());
    if ($('#right .assembly-box').css('display') === 'block' && $('#menu').css('display') === 'block') {
        $('#right .form-box').width($('#right').width() - $('#right .assembly-box').width() - 11);
    } else if ($('#right .assembly-box').css('display') === 'block' && $('#menu').css('display') === 'none') {
        $('#right .form-box').width($('#right').width() - $('#right .assembly-box').width() + $('#menu').width() - 1);
        $('#right').css('margin-left', '0');
    } else {
        $('#right .form-box').width($('#right').width());
    }
    if ($('#right .form-box .layui-btn-container').height() > 40) {
        $('#right .layui-btn-container .layui-btn em').hide();
        $('#right .layui-btn-container .layui-btn i').css('margin-right', '0');
        if ($('#right .form-box .layui-btn-container').height() > 40) {
            $('#dragopen').show();
            $('#right .layui-btn-container .li-right').css({ 'float': 'none', 'margin-top': '0' });
            $('#right .form-box .layui-btn-container').css('padding-right', '30px');
        }
    } else {
        $('#right .layui-btn-container .layui-btn em').show();
        $('#right .layui-btn-container .layui-btn i').css('margin-right', '3px');
        $('#dragopen').hide();
        $('#right .form-box .layui-btn-container').css('padding-right', '14px');
        $('#right .layui-btn-container .li-right').css({ 'float': 'right', 'margin-top': '4px' });
        if ($('#right .form-box .layui-btn-container').height() > 40) {
            $('#right .layui-btn-container .layui-btn em').hide();
            $('#right .layui-btn-container .layui-btn i').css('margin-right', '0');
        }
    }
    const $btnTools = $('#btnTools');
    !$btnTools.hasClass('layui-hide') && $btnTools.addClass('layui-hide').html('');
}

// JavaScript Document
function bindResize(el) {
    // 初始化参数
    const els = document.getElementById('menu').style;
    // 鼠标的 X 坐标
    let x = 0;
    // 鼠标事件
    $(el).mousedown(function (e) {
        // 按下元素后，计算当前鼠标与对象计算后的坐标
        x = e.clientX - el.offsetWidth - $('#menu').width() + 10;
        const fnSetCapture = function () {
            el.setCapture();
            // 设置事件
            el.onmousemove = function (ev) {
                mouseMove(ev || event);
            };
            el.onmouseup = mouseUp
        }
        // 在支持 setCapture 做些东东
        el.setCapture ? fnSetCapture() : $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
        // 防止默认事件发生
        e.preventDefault();
    });

    // 移动事件
    function mouseMove(e) {
        // 运算
        els.width = e.clientX - x + 'px';
        myResizeFn();
        $(window).resize();
    }

    // 停止事件
    function mouseUp() {
        const fnReleaseCapture = function () {
            // 释放焦点
            el.releaseCapture();
            // 移除事件
            el.onmousemove = el.onmouseup = null
        }
        // 在支持 releaseCapture 做些东东
        el.releaseCapture ? fnReleaseCapture() : $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
    }
}
/**
 * 注册设置事件
 * @param { String } type 类型：全局设置，批量设置
 */
function onSetting (type) {
    const clearStr = '<div class="layui-inline">' +
    '                    <div class="layui-input-inline">' +
    '                       <input type="checkbox" id="clearInhere" title="清除原有">' +
    '                    </div>' +
    '                 </div>';
    let htmlTemp = '<div id="settingBox">' +
    '                    <div class="layui-form layui-form-pane">' +
    '                        <div class="layui-inline">' +
    '                            <label class="layui-form-label">类型</label>' +
    '                            <div class="layui-input-inline">' +
    '                                <select name="type"  lay-filter="typeSelect">' +
    '                                    <option value="过程">过程</option>' +
    '                                    <option value="活动">活动</option>' +
    '                                </select>' +
    '                            </div>' +
    '                        </div>';
    htmlTemp += (type === '全局设置' ? '' : clearStr);
    htmlTemp += '        </div>' +
    '                    <div class="setting-main">';
    htmlTemp += (type === '全局设置' ? '' : '<div id="treeSetting" class="ztree scrollbar"></div>');
    htmlTemp += '            <div class="prop-set-box"></div>' +
    '                    </div>' +
    '                 </div>';
    const modalObj = {
        title: type,
        width: 800,
        height: 600,
        needB: false
    };
    const resetData = function (arr, isAct) {
        arr.forEach(function(item) {
            if (item.type === '模版') {
                if (isAct) {
                    !item.children && (item.children = []);
                } else {
                    item.children && (delete item.children);
                }
            }
            item.children && item.children.length > 0 && resetData(item.children, isAct);
        })
    };
    const zTreeBeforeExpand = function (treeId, treeNode) {
        if (treeNode.type === '模版') {
            if (treeNode.children.length > 0) {
                return true
            }
            const strUrl = getBaseUrl() + '/bpm/process/queryAllActivities';
            const resquestData = getApiPojo();
            resquestData.processId = treeNode.id;
            postRequest(strUrl, resquestData, function (res) {
                if (res.code === 0 && res.resData && res.resData.processActivities) {
                    const procActs = res.resData.processActivities;
                    const procActsData = [];
                    procActs.forEach(function (item) {
                        procActsData.push({
                            pid: treeNode.id,
                            id: item.activityId,
                            name: item.activityName,
                            type: '活动',
                            iconSkin: 'icon-work'
                        })
                    });
                    $.fn.zTree.getZTreeObj(treeId).addNodes(treeNode, procActsData);
                } else {
                    fnTip('获取流程模版任务活动节点信息失败', 2000)
                }
            })
        }
    };
    const zTreeOnCheck = function () {
        const table = layui.table;
        table.reload('userAuthTable', { data: [] });
        table.reload('paramTable', { data: [] });
        table.reload('actAppTable', { data: [] });
        table.reload('listenPlugInTable', { data: [] });
    }
    const renderSettingTree = function (isAct) {
        const settings = {
            view: {
                selectedMulti: false,
                autoCancelSelected: false,
                dblClickExpand: true
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: 'id',
                    pIdKey: 'pid',
                    rootPId: ''
                }
            },
            check: {
                enable: true
            },
            callback: {
                onCheck: zTreeOnCheck
            }
        };
        const allNodes = $.fn.zTree.getZTreeObj('treeProcessCategory').getNodesByParam('pid', '');
        resetData(allNodes, isAct);
        if (isAct) {
            settings.callback.beforeExpand = zTreeBeforeExpand;
        }
        const settingTreeObj = $.fn.zTree.init($('#treeSetting'), settings, allNodes);
        const notDeployData = settingTreeObj.getNodesByParam('bSave', false, null);
        settingTreeObj.hideNodes(notDeployData);
    }
    const renderSettingMain = function (type, isAct) {
        $('#settingBox .prop-set-box').html(initSettingPanel(type, isAct));
        const height = $('#panelContent').height() - 51;
        if (type === '批量设置') {
            renderSettingTree(isAct);
            $('#btnDeleteListenPlugIn, #btnDeleteParam, #btnUserDelete, #btnDeleteApp').remove();
            loadPluginSetting(height, false, isAct);
            loadParamSetting(height);
            !!isAct && loadAppSetting(height);
            !isAct && loadUserSetting(height);
        }
        if (type === '全局设置') {
            loadPluginSetting(height, true, isAct);
        }
        initSettingEvent(type === '全局设置', isAct);
    }
    const showCallback = function (index, layero, closeLayero) {
        renderSettingMain(type);
        layui.form.on('select(typeSelect)', function(data) {
            if (data.value === '活动') {
                renderSettingMain(type, true);
            } else {
                renderSettingMain(type);
            }
        });
    };
    fnAlertShow(htmlTemp, modalObj, showCallback, null, null, null, function() {
        const $panelContent = $('#panelContent');
        const panelHeight = $panelContent.height() - 53;
        const panelWidth = $panelContent.width();
        const table = layui.table;
        $('#listenPlugInTable').length > 0 && table.reload('listenPlugInTable', {
            height: panelHeight,
            width: panelWidth
        });
        if (type === '批量设置') {
            $('#userAuthTable').length > 0 && table.reload('userAuthTable', {
                height: panelHeight,
                width: panelWidth
            });
            $('#paramTable').length > 0 && table.reload('paramTable', {
                height: panelHeight,
                width: panelWidth
            });
            $('#actAppTable').length > 0 && table.reload('actAppTable', {
                height: panelHeight,
                width: panelWidth
            });
        }
    });
}
/**
 * 是否能往下执行
 * @param { Array } toIds 目标ID数组
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function canPass(toIds, isGlobal, isAct) {
    if (!isGlobal) {
        const treeObj = $.fn.zTree.getZTreeObj('treeSetting');
        const checkedTreeNodes = treeObj.getCheckedNodes(true);
        for (let i = 0; i < checkedTreeNodes.length; i++) {
            const item = checkedTreeNodes[i];
            if (item.isParent && item.children.length < 1) {
                fnTip('请展开过程节点后再选择', 2000);
                treeObj.checkAllNodes(false);
                return false;
            }
            if (!item.isParent) {
                toIds.push(item.id);
            }
        }
        if (toIds.length < 1) {
            fnTip('请先选择' + (isAct ? '活动节点' : '过程'), 2000);
            return false;
        }
    }
    return true;
}
/**
 * 初始化设置界面中的事件
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function initSettingEvent(isGlobal, isAct) {
    $('#btnAddListenPlugIn').off().on('click', function () {
        addOrEditSettingListenPlugIn(isGlobal, isAct, true);
    });
    $('#btnDeleteListenPlugIn').off().on('click', function () {
        deleteSettingListenPlugIn(isGlobal, isAct);
    });
    $('#btnUserSelect').off().on('click', function () {
        addSettingUser(isGlobal, isAct);
    });
    $('#btnAddParam').off().on('click', function () {
        addSettingParam(isGlobal, isAct);
    });
    $('#btnAddApp').off().on('click', function () {
        addSettingApp(isGlobal, isAct);
    });
}
/**
 * 新增设置参与者
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function addSettingUser(isGlobal, isAct) {
    const toIds = [];
    const isPass = canPass(toIds, isGlobal, isAct);
    if (!isPass) {
        return;
    }
    const table = layui.table;
    let userAuthList = table.cache['userAuthTable'];
    const callBack = function(arr, closeModal) {
        if (arr.length < 1) {
            fnTip('请选择参与者', 2000);
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
            fnTip('选中参与者已全被授权，无需重新授权？', 1500);
            closeModal();
            return false;
        }

        // for (let i = 0; i < addCandidates.length; i++) {
        //     userAuthList.push(addCandidates[i]);
        // }
        // let url = getBaseUrl() + '/bpm/';
        // const reqData = getApiPojo();
        // if (isAct) {
        //     url += 'activity/candidate/clone';
        //     reqData.activityIds = toIds;
        // } else {
        //     url += 'process/candidate/clone';
        //     reqData.processIds = toIds;
        // }
        // reqData.isClear = $('#clearInhere').next().hasClass('layui-form-checked');
        // reqData.data = addCandidates;
        // const bCallBack = function (res) {
        //     if (res.code === 0) {
        //         if (reqData.isClear) {
        //             userAuthList = addCandidates;
        //         }
        //         table.reload('userAuthTable', {
        //             data: userAuthList,
        //             limit: userAuthList.length
        //         });
        //         closeModal();
        //     } else {
        //         fnTip(res.msg, 2000);
        //     }
        // }
        // postRequest(url, reqData, bCallBack);
    };
    showRolesEmplyeeModal('', 'checkbox', callBack);
}
/**
 * 新增设置参数
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function addSettingParam(isGlobal, isAct) {
    const toIds = [];
    const isPass = canPass(toIds, isGlobal);
    if (!isPass) {
        return;
    }
    const table = layui.table;
    const obj = [{
        'id': 'paramName',
        'name': '名称',
        'type': 'select',
        'editable': true,
        'search': true,
        'option': [],
        'maxLength': 64,
        'data': '',
        'required': true
    }, {
        'id': 'paramType',
        'name': '类型',
        'type': 'select',
        'option': ['全局参数', '流程参数', '业务变量', '打印菜单', '工具菜单'],
        'data': '',
        'required': true
    }, {
        'id': 'paramValue',
        'name': '值',
        'type': 'select',
        'editable': true,
        'search': true,
        'option': [],
        'maxLength': 64,
        'data': '',
        'required': true
    }, {
        'id': 'paramClassify',
        'name': '变量数据类型',
        'type': 'select',
        'option': ['数值', '字符串', '布尔值'],
        'data': ''
    }, {
        'id': 'paramSortnum',
        'name': '排序',
        'type': 'text',
        'dataType': 'int',
        'data': '',
        'required': true
    }, {
        'id': 'paramNote',
        'name': '描述',
        'type': 'textarea',
        'maxLength': 512,
        'data': ''
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

        renderParamNameSelect('', '');

        $('#paramName').on('select2:select', function (e) {
            renderParamValueSelect(e.params.data.id, '');
        });
    }, function (modelIndex, layerObj, closeNow) {
        let isExit = false;
        let parameters = table.cache['paramTable'];
        const paramObj = {
            paramName: $('#paramName').val(),
            paramType: $('#paramType').val(),
            paramValue: $('#paramValue').val(),
            paramClassify: $('#paramType').val() === '业务变量' ? $('#paramClassify').val() : '',
            paramSortnum: $('#paramSortnum').val(),
            paramNote: $('#paramNote').val()
        }
        for (let i = 0; i < parameters.length; i++) {
            if (parameters[i].paramName === $('#paramName').val()) {
                fnTip('已经存在同名参数！', 1500);
                isExit = true;
                break;
            }
        }
        if (!isExit) {
            const url = getBaseUrl() + '/bpm/parameter/clone';
            const reqData = getApiPojo();
            reqData.isClear = $('#clearInhere').next().hasClass('layui-form-checked');
            reqData.paramParentIds = toIds;
            reqData.paramParentType = isAct ? '活动' : '过程';
            reqData.data = [paramObj];
            const bCallBack = function (res) {
                if (res.code === 0) {
                    if (reqData.isClear) {
                        parameters = [paramObj];
                    } else {
                        parameters.push(paramObj);
                        parameters.sort(compare('paramSortnum'));
                    }
                    table.reload('paramTable', {
                        data: parameters,
                        limit: parameters.length
                    });
                    closeNow();
                } else {
                    fnTip(res.msg, 2000);
                }
            }
            postRequest(url, reqData, bCallBack);
        }
    });
}
/**
 * 新增设置应用程序
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function addSettingApp(isGlobal, isAct) {
    const toIds = [];
    const isPass = canPass(toIds, isGlobal, isAct);
    if (!isPass) {
        return;
    }
    const table = layui.table;
    const appNameData = '';
    const appTypeData = '';
    const appPathData = '';
    const appForuseData = '';
    const relNoteData = '';
    const relInitParamData = '';
    const relSortnumData = '';
    const appClassifyData = '';
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
        const appObj = {
            appId: $('#appId').val(),
            appName: $('#appName').val(),
            appClassify: $('#appClassify').val(),
            appType: $('#appType').val(),
            appPath: $('#appPath').val(),
            appForuse: $('#appForuse').val(),
            appPolicy: $('#relNote').val(),
            appInitParam: $('#relInitParam').val(),
            appBindSortnum: $('#relSortnum').val()
        };
        let strUrl = getBaseUrl() + '/bpm/';
        const reqData = getApiPojo();
        if (isAct) {
            strUrl += 'activity/appliction/clone';
            reqData.activityIds = toIds;
        }
        reqData.data = [appObj];
        reqData.isClear = $('#clearInhere').next().hasClass('layui-form-checked');
        postRequest(strUrl, reqData, function (res) {
            // 数据保存成功后，属性表格
            if (res.code === 0) {
                let applicationList = table.cache['actAppTable'];
                if (reqData.isClear) {
                    applicationList = [appObj];
                } else {
                    applicationList.push(appObj);
                    applicationList.sort(compare('appBindSortnum'));
                }
                table.reload('actAppTable', {
                    data: applicationList,
                    limit: applicationList.length
                });
                closeNow();
            } else {
                fnTip(res.msg, 2000);
            }
        }, null, true);
    }, null, modalObj);
}
/**
 * 删除设置监听事件
 * @param { Boolean } isGlobal 是否是全局设置
 * @param { Boolean } isAct 是否是活动
 */
function deleteSettingListenPlugIn(isGlobal, isAct) {
    const table = layui.table;
    const checkData = table.checkStatus('listenPlugInTable').data;
    if (checkData.length < 1) {
        fnTip('请选择需要删除的事件监听', 2000);
        return;
    }
    if (isGlobal) {
        let url = getBaseUrl() + '/bpm/';
        const reqData = getApiPojo();
        if (isAct) {
            url += 'activity/listener/delete';
            reqData.activityId = 'globalActivity';
        } else {
            url += 'process/listener/delete';
            reqData.processId = 'globalProcess';
        }
        reqData.data = checkData;
        const bCallBack = function (res) {
            if (res.code === 0) {
                const tableData = table.cache['listenPlugInTable'];
                checkData.forEach(function(checkItem) {
                    tableData.forEach(function(tableItem, index) {
                        if (checkItem.pluginId === tableItem.pluginId) {
                            tableData.splice(index, 1);
                            return;
                        }
                    })
                });
                table.reload('listenPlugInTable', { data: tableData, limit: tableData.length });
            } else {
                fnTip(res.msg, 2000);
            }
        }
        postRequest(url, reqData, bCallBack);
    }
}
/**
 * 新增/修改设置监听事件插件
 * @param { Boolean } isGlobal 是否全局设置
 * @param { Boolean } isAct 是否是活动
 * @param { Boolean } bAdd 是否是新增
 * @param { Object } setData 待修改数据
 */
function addOrEditSettingListenPlugIn(isGlobal, isAct, bAdd, setData) {
    const toIds = [];
    const isPass = canPass(toIds, isGlobal, isAct);
    if (!isPass) {
        return;
    }
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
    let arrPluginClassify = ['流程启动前', '流程启动后', '流程挂起前', '流程挂起后', '流程恢复挂起前', '流程恢复挂起后', '流程终止前', '流程终止后', '流程废弃前', '流程废弃后', '流程删除前', '流程删除后', '流程结束前', '流程结束后'];
    !!isAct && (arrPluginClassify = ['任务启动前', '任务启动后', '任务签收前', '任务签收后', '任务保存前', '任务保存后', '任务提交前', '任务提交后', '任务收回前', '任务收回后', '任务退回前', '任务退回后', '任务关注前', '任务关注后', '任务取消关注前', '任务取消关注后', '任务结束前', '任务结束后']);
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
                arr = arrPluginClassify;
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
                    $('#pluginName').val(pluginObj.pluginName);
                    $('#pluginId').val(pluginObj.pluginId);
                    $('#pluginType').val(pluginObj.pluginType);
                    $('#pluginClassify').val(pluginObj.pluginClassify);
                    $('#pluginPath').val(pluginObj.pluginPath);
                    let arr = [];
                    if (pluginObj.pluginClassify === 'flowable') {
                        arr = ['create', 'assignment', 'complete', 'all'];
                    } else if (pluginObj.pluginClassify === '自定义') {
                        arr = arrPluginClassify;
                    }
                    let optHtml = '';
                    for (let i = 0; i < arr.length; i++) {
                        optHtml += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
                    }
                    $('#eventName').html(optHtml);
                    if ($('#pluginType').val() === 'Javaclass') {
                        $('#className').parents('.layui-form-item').show();
                        const pluginClass = getSettingPluginClass(pluginObj.pluginPath);
                        if (pluginClass !== '') {
                            $('#className').html(pluginClass);
                            layui.form.render();
                            closeNow();
                        }
                    } else {
                        $('#className').parents('.layui-form-item').hide();
                        $('#className').html('<option value="' + pluginObj.pluginPath + '">' + pluginObj.pluginPath + '</option>');
                        layui.form.render();
                        closeNow();
                    }
                }
            });
        });
    }
    const modalObj = {
        'width': 500
    }
    fnFormDialog('事件监听信息', obj, showCallback, function (modelIndex, layerObj, closeNow) {
        let listeners = layui.table.cache['listenPlugInTable'];
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
        const reloadListeners = function (listeners) {
            listeners.sort(compare('listenerSortnum'));
            // for (let i = 0; i < listeners.length; i++) {
            //     listeners[i].listenerSortnum = i + 1;
            // }
            layui.table.reload('listenPlugInTable', {
                data: listeners,
                limit: listeners.length
            });
        }
        let url = getBaseUrl() + '/bpm/';
        const reqData = getApiPojo();
        if (bAdd) {
            if (isGlobal) {
                reqData.data = newListenPlugIn;
                if (isAct) {
                    reqData.activityId = 'globalActivity';
                    url += 'activity/listener/add';
                } else {
                    reqData.processId = 'globalProcess';
                    url += 'process/listener/add';
                }
            } else {
                url += 'listenerplugin/clone';
                reqData.data = [newListenPlugIn];
                reqData.nodeIds = toIds;
                reqData.nodeType = isAct ? '活动' : '过程';
                reqData.isClear = $('#clearInhere').next().hasClass('layui-form-checked');
            }
            const bCallBack = function (res) {
                if (res.code === 0) {
                    closeNow();
                    if (reqData.isClear) {
                        listeners = [newListenPlugIn];
                    } else {
                        listeners.push(newListenPlugIn);
                    }
                    reloadListeners(listeners);
                } else {
                    fnTip(res.msg, 2000);
                }
            }
            postRequest(url, reqData, bCallBack);
        } else if (isGlobal) {
            if (isAct) {
                url += 'activity/listener/update';
                reqData.activityId = 'globalActivity';
            } else {
                url += 'process/listener/update';
                reqData.processId = 'globalProcess';
            }
            reqData.originalEventName = eventNameData;
            reqData.originalClassName = classNameData;
            reqData.data = newListenPlugIn;
            reqData.data.pluginId = setData.pluginId;
            const bCallBack = function (res) {
                if (res.code === 0) {
                    closeNow();
                    for (let i = 0; i < listeners.length; i++) {
                        if (listeners[i].listenerSortnum === setData.listenerSortnum) {
                            listeners[i].eventName = newListenPlugIn.eventName;
                            listeners[i].listenerPolicy = newListenPlugIn.listenerPolicy;
                            listeners[i].className = newListenPlugIn.className;
                            listeners[i].listenerSortnum = newListenPlugIn.listenerSortnum;
                            break;
                        }
                    }
                    reloadListeners(listeners);
                } else {
                    fnTip(res.msg, 2000);
                }
            }
            postRequest(url, reqData, bCallBack);
        }
    }, 1, modalObj);
}
/**
 * 获取设置的监听插件类名
 * @param { String } pluginName 监听事件类名
 */
function getSettingPluginClass(pluginName) {
    let sHtml = '';
    const url = getBaseUrl() + '/bpm/listenerplugin/queryJavaClassOfJar';
    const reData = getApiPojo();
    reData.jarName = pluginName;
    synchPostRequest(url, reData, function (res) {
        if (res.code === 0) {
            const arrJavaClass = res.resData.JavaClassNames;
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
 * 加载参与者设置
 * @param { Number } height 高度
 */
function loadUserSetting(height) {
    // 加载表格
    layui.table.render({
        elem: '#userAuthTable',
        id: 'userAuthTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'numbers', width: 60, fixed: 'left', title: '序号', align: 'center' },
            { field: 'candidateName', align: 'center', title: '名称' },
            { field: 'candidateType', align: 'center', title: '类别' },
            { field: 'candidatePolicy', align: 'center', title: '参与方式' }
        ]]
    });
}
/**
 * 加载参数设置
 * @param { Number } height 高度
 */
function loadParamSetting(height) {
    // 加载table
    layui.table.render({
        elem: '#paramTable',
        id: 'paramTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'numbers', width: 60, fixed: 'left', title: '序号', align: 'center' },
            { field: 'paramSortnum', width: 60, title: '排序', align: 'center' },
            { field: 'paramName', title: '名称', align: 'center' },
            { field: 'paramType', title: '类型', align: 'center' },
            { field: 'paramValue', title: '值', align: 'center' }
        ]]
    });
}
/**
 * 加载应用程序设置
 * @param { Number } height 高度
 */
function loadAppSetting(height) {
    layui.table.render({
        elem: '#actAppTable',
        id: 'actAppTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'numbers', width: 60, fixed: 'left', title: '序号', align: 'center' },
            { field: 'appBindSortnum', title: '排序', align: 'center', width: 60 },
            { field: 'appName', title: '名称', align: 'center', width: 200 },
            { field: 'appType', title: '类型', align: 'center', width: 100 },
            { field: 'appClassify', title: '分类', align: 'center', width: 100 },
            { field: 'appForuse', title: '用途', align: 'center', width: 100 }
        ]]
    });
}
/**
 * 加载事件监听设置
 * @param { Number } height 高度
 * @param { Boolean } isGlobal 是否全局设置
 * @param { Boolean } isAct 是否是活动
 */
function loadPluginSetting(height, isGlobal, isAct) {
    const table = layui.table;
    // 加载table
    table.render({
        elem: '#listenPlugInTable',
        id: 'listenPlugInTable',
        data: [],
        height: height,
        limit: 100,
        even: true,
        cols: [[
            { type: 'checkbox', width: 40, hide: !isGlobal, fixed: 'left' },
            { type: 'numbers', width: 60, title: '序号', fixed: 'left', align: 'center' },
            { field: 'listenerSortnum', width: 60, title: '排序', align: 'center' },
            { field: 'pluginClassify', title: '事件类型', align: 'center', width: 100 },
            { field: 'eventName', title: '事件名称', align: 'center', width: 150 },
            { field: 'pluginType', title: '操作插件类型', align: 'center', width: 130 },
            { field: 'listenerPolicy', title: '监听方式', align: 'center', width: 100 },
            { field: 'className', title: '类名', align: 'center', minWidth: 150 },
            { field: 'CZ', title: '操作', align: 'center', toolbar: '#barlistenPlugInDemos', fixed: 'right', width: 80, hide: !isGlobal }
        ]]
    });
    table.on('tool(listenPlugInTable)', function(obj) {
        if (obj.event === 'updateListenPlugIn') {
            addOrEditSettingListenPlugIn(isGlobal, isAct, false, obj.data);
        }
    });
    if (isGlobal) {
        const url = getBaseUrl() + '/bpm/' + (isAct ? 'activity/listener/get' : 'process/listener/query');
        const reqData = getApiPojo();
        isAct ? (reqData.activityId = 'globalActivity') : (reqData.processId = 'globalProcess');
        const bCallBack = function (res) {
            if (res.code === 0) {
                const listenerList = res.resData[isAct ? 'listenerList' : 'processListeners'] || [];
                table.reload('listenPlugInTable', {
                    data: listenerList,
                    limit: listenerList.length
                });
            } else {
                fnTip(res.msg, 2000);
            }
        }
        postRequest(url, reqData, bCallBack);
    }
}
/**
 * 初始化设置弹窗面板内容html
 * @param { String } type 类型：全局设置、批量设置
 * @param { Boolean } isAct 是否是活动
 */
function initSettingPanel (type, isAct) {
    const panelObj = getSettingPanelObj(type === '全局设置', isAct);
    const html = getPanelHtml(panelObj);
    return html;
}
/**
 * 获取设置面板对象
 * @param { Boolean } isGlobal 是否全局设置
 * @param { Boolean } isAct 是否是活动
 */
function getSettingPanelObj(isGlobal, isAct) {
    const res = [];
    res.push({
        id: 'listenerPlugIn',
        name: '事件监听',
        content: getListenerPluginHtml(true)
    });
    if (isGlobal) {
        return res;
    }
    res.unshift({
        id: 'actParams',
        name: '参数',
        content: getParameterHtml(true)
    });
    if (isAct) {
        res.unshift({
            id: 'actApps',
            name: '应用程序',
            content: getApplicationHtml(true)
        });
    } else {
        res.unshift({
            id: 'actUserAuth',
            name: '参与者授权',
            content: getCandidateHtml(true)
        });
    }
    return res;
}

