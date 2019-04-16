let workflow = null; // 流程模型对象
let m_processIsSave = false; // 区分流程模版发布和保存
let m_processId = ''; // 流程模版定义ID
let m_categoryId = ''; // 流程模版分类ID（外部传入）
let m_processProp = {}; // 流程模版属性信息
let m_candidates = []; // 流程模版授权用户
let m_parameters = []; // 流程模版参数
let m_listeners = []; // 流程模版事件监听
let m_lines = []; // 流程模版连线
let m_activities = []; // 流程模版所有活动
let m_newModal = { name: '', type: '' };
let m_needSave = false;
let layerIndex = null;

/**
 * 创建新的流程模版
 * @returns
 */
function createProcess() {
    let bDone = false;
    // 获取选中的分类树节点
    if (m_treeNode != null) {
        if (m_treeNode.type === '分类') {
            bDone = true;

            const processId = guidGenerator('proc');
            const newNode = {
                id: processId,
                pid: m_treeNode.id,
                name: '新建模版',
                type: '模版',
                sortnum: 1,
                catNote: '',
                iconSkin: 'icon-process',
                bSave: false
            };
            const treeObj = $.fn.zTree.getZTreeObj('treeProcessCategory');
            const nodes = treeObj.addNodes(m_treeNode, newNode);
            treeObj.selectNode(nodes[0]);
            m_treeNode = nodes[0];
            showModel(nodes[0]);
        }
    }
    if (!bDone) {
        fnTip('请选择流程模版分类后创建新的流程模版！', 1500);
    }
}

/**
 * 显示流程模版设计器面板
 * @param treeNode
 * @returns
 */
function showModel(treeNode) {
    const parentNode = treeNode.getParentNode();
    const obj = {
        processId: treeNode.id,
        categoryId: parentNode.id,
        categoryName: parentNode.name,
        processName: treeNode.name,
        processNote: treeNode.catNote,
        processSortnum: treeNode.sortnum,
        bSave: treeNode.bSave
    }

    $('#right .form-box .noinfo').hide();
    $('#right .form-box .edit-box').show();
    $('#divDesigner').show();
    $('#descriptorarea').val('');
    $('#saveProcess').show();
    $('#deployModel').show();
    $('#cloneProcess').show();
    // $("#undoModel").show();
    // $("#redoModel").show();
    $('#deleteProcess').show();
    $('#openProperties').show();
    $('#configDoc').show();

    $('.swith-btn-right-open').click();

    if (obj.processId !== undefined) {
        if (obj.bSave) {
            $('#deployModel').hide();
            $('#cloneProcess').hide();
        } else {
            $('#saveProcess').hide();
            $('#deleteProcess').hide();
            $('#configDoc').hide();
            m_newModal = {
                name: '新建模版',
                type: obj.categoryName
            };
        }
        createModel(obj.processId, false, obj);
    }
}

/**
 * 绘制流程模版设计器面板
 * @param processId
 * @param disabled
 * @param infoObj
 * @returns
 */
function createModel(processId, disabled, infoObj) {
    try {
        layerIndex = layui.layer.msg('流程绘制中', {
            icon: 16,
            shade: 0.01
        });
        // 重新加载新的流程模型，先清除原加载模型
        clearModel();

        m_processIsSave = infoObj.bSave;
        m_processId = processId;
        m_categoryId = infoObj.categoryId;

        // 绘制流程模版设计器面板
        workflow = new draw2d.MyCanvas('paintarea');
        workflow.scrollArea = document.getElementById('designer-area');
        if (disabled) {
            workflow.setDisabled();
        }

        if (processId) {
            if (infoObj.bSave) { // 已发布过
                loadProcessDesigner(processId, infoObj);
                loadProcessData(processId, true);
            } else { // 新建流程模版
                parseProcessDescriptor(null, infoObj);
                m_processProp.categoryId = infoObj.categoryId;
                m_processProp.processSortnum = infoObj.processSortnum;
                m_processProp.workdateType = '工作日';
                m_processProp.processState = '启用';
                m_processProp.processFlowctrl = '禁用';
                m_processProp.processFormctrl = '禁用';
                m_processProp.processExectrl = '禁用';
                m_processProp.processWorkareatype = '流转线索模式';
            }

            // 先移除流程模版设计器面板双击事件绑定
            $('#paintarea').unbind('dblclick');
            // 绑定流程模版设计器面板双击事件
            $('#paintarea').dblclick(function() {
                openProcessProperty(processId);
            });
        } else {
            fnTip('流程模板ID为空，请确认模版是否存在！', 1500);
            return false;
        }
    } catch (e) {
        fnTip(e.message);
    }
}

/**
 * 添加流程图元素模型
 * @param name
 * @param x
 * @param y
 * @param icon
 * @returns
 */
function addModel(name, x, y, icon) {
    let model = null;
    if (icon != null && icon !== undefined) { model = eval('new draw2d.' + name + "('" + icon + "')"); } else { model = eval('new draw2d.' + name + '()'); }
    model.generateId();
    workflow.addModel(model, x, y);
}

/**
 * 删除流程图元素模型
 * @param id
 * @returns
 */
function deleteModel(id) {
    const task = workflow.getFigure(id);
    workflow.removeFigure(task);
}

/**
 * 清除模型
 * @returns
 */
function clearModel() {
    try {
        if (workflow) {
            // 清除模型
            workflow.clear();
            // 防止模版切换后模版右键菜单多次弹出
            workflow.getContextMenu = null;
            // 流程模版设计器对象置空
            workflow = null;
        }

        // 清理对象
        m_processId = ''; // 流程模版定义ID
        m_categoryId = ''; // 流程模版分类ID（外部传入）
        m_processProp = {}; // 流程模版属性
        m_candidates = []; // 流程模版授权用户
        m_parameters = []; // 流程模版参数
        m_listeners = []; // 流程模版事件监听
        m_lines = []; // 流程模版连线
        m_activities = []; // 所有流程活动

        // 模版切换后右键菜单清除
        $('.context-menu').hide();
    } catch (e) {
        tip(e.message);
    }
}

// 上一步
function redoModel() {
    workflow.getCommandStack().redo();
}

// 下一步
function undoModel() {
    workflow.getCommandStack().undo();
}

// 通过字符串，获取xmlDoc对象，兼容多浏览器
function stringToXml(strxml) {
    let xmlDoc;
    if (window.ActiveXObject) { // IE
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = false;
        xmlDoc.loadXML(strxml);
    } else { // 其他
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(strxml, 'text/xml');
    }

    return xmlDoc;
}

// 获取xmlDoc对象，兼容多浏览器
function getXmlDoc(xmlFile) {
    let xmlDoc;
    if (window.ActiveXObject) { // IE
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = false;
        xmlDoc.load(xmlFile);
    } else if (isFirefox = navigator.userAgent.indexOf('Firefox') > 0) { // 火狐
        xmlDoc = document.implementation.createDocument('', '', null);
        xmlDoc.load(xmlFile);
    } else { // 谷歌
        const xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open('GET', xmlFile, false);
        xmlhttp.send(null);
        if (xmlhttp.readyState === 4) {
            xmlDoc = xmlhttp.responseXML.documentElement;
        }
    }

    return xmlDoc;
}

// 根据Id获取流程XML,并解析渲染
function loadProcessDesigner(id, infoObj) {
    const url = getBaseUrl() + '/bpm/process/getDesignerXML';
    const reData = getApiPojo();
    reData.processId = id;
    postRequest(url, reData, function(res) {
        if (res.code === 0) {
            const modelXML = res.resData.processXML;
            const xml = stringToXml(modelXML);
            parseProcessDescriptor(xml, infoObj);
        } else {
            fnTip('流程模版XML资源文件不存在，请联系系统管理员确认！', 1500);
        }
    })
}

/**
 * 打开选中模版元素属性编辑页面，默认过程属性
 * @returns
 */
function openCurrElementProperties() {
    if (workflow) {
        let currElementId = ''; // 当前选中模版元素ID
        let currElementType = ''; // 当前选中模版元素类型

        // 获取当前选中模版元素
        const currElement = workflow.getCurrentSelection();
        if (currElement == null) {
            currElementId = m_processId;
            currElementType = 'processProperties';
        } else {
            currElementId = currElement.id;
            currElementType = currElement.type;

            if (currElementType === 'draw2d.UserTask') {
                currElementType = 'taskProperties';
            } else if (currElementType === 'DecoratedConnection') {
                currElementType = 'lineProperties';
            } else {
                fnTip('请选中流程模版空白处或模版元素节点！', 1500);
                return false;
            }
        }

        openProperties(currElementId, currElementType);
    }
}

/**
 * 打开属性编辑页面
 * @param id 对象标识
 * @param type 对象类型
 * @returns
 */
function openProperties(id, type) {
    if (type === 'processProperties') {
        // 注意：当前id是流程模型PROC_KEY，不是流程模版定义ID
        openProcessProperty(m_processId);
    } else if (type === 'taskProperties') {
        openActivityProperty(id);
    } else if (type === 'lineProperties') {
        // 先移除流程模版设计器面板双击事件绑定（防止流程过程属性和连线属性同时触发编辑）
        $('#paintarea').unbind('dblclick');

        // 打开连线属性编辑器
        openLineProperty(id);

        // 绑定流程模版设计器面板双击事件（防止流程过程属性和连线属性同时触发编辑）
        $('#paintarea').dblclick(function() {
            openProcessProperty(m_processId);
        });
    }
}

/* function openProcess() {
    var $ = layui.jquery, upload = layui.upload;
    //选完文件后不自动上传
    upload.render({
      elem: '#openProcess',
      auto: false,
      accept: 'file', //普通文件
      exts: 'xml', //只允许上传压缩文件
      //multiple: true,
      bindAction: '#test9',
      choose: function(obj){
          //读取本地文件
          obj.preview(function(index, file, result){
              let processId = guidGenerator("proc");
          let newNode = {
                id: processId,
                pid: m_treeNode.id,
                name: "临时模版",
                type: '模版',
                sortnum: 1,
                catNote: "",
                iconSkin: 'icon-process',
                bSave: false
            };
            let treeObj = $.fn.zTree.getZTreeObj("treeProcessCategory");
            let nodes = treeObj.addNodes(m_treeNode, newNode);
            treeObj.selectNode(nodes[0]);
            m_treeNode = nodes[0];

            let parentNode = m_treeNode.getParentNode();
            let obj = {
                processId: m_treeNode.id,
                categoryId: parentNode.id,
                categoryName: parentNode.name,
                processName: m_treeNode.name,
                processNote: m_treeNode.catNote,
                processSortnum: m_treeNode.sortnum,
                bSave: m_treeNode.bSave
            }

            $('#right .form-box .noinfo').hide();
            $('#right .form-box .edit-box').show();
            $('#divDesigner').show();
            $('#descriptorarea').val("");
            $("#saveProcess").show();
            $("#deployModel").show();
            $("#cloneProcess").show();
            //$("#undoModel").show();
            //$("#redoModel").show();
            $("#deleteProcess").show();
            $("#openProperties").show();
            $("#configDoc").show();

            if (obj.processId !=undefined){
                if (obj.bSave) {
                    $("#deployModel").hide();
                    $("#cloneProcess").hide();
                } else {
                    $("#saveProcess").hide();
                    $("#deleteProcess").hide();
                }

                try {
                    // 重新加载新的流程模型，先清除原加载模型
                    clearModel();

                    m_processId = processId;
                    m_categoryId = infoObj.categoryId;

                    // 绘制流程模版设计器面板
                    workflow = new draw2d.MyCanvas("paintarea");
                    workflow.scrollArea = document.getElementById("designer-area");

                    if (processId) {
                        let modelXML = Base64.decode64(result.replace("data:text/xml;base64,", ""));
                        let xml = stringToXml(modelXML);
                        parseProcessDescriptor(xml, infoObj);
                        m_processProp.categoryId = infoObj.categoryId;
                        m_processProp.processSortnum = infoObj.processSortnum;

                        // 先移除流程模版设计器面板双击事件绑定
                        $('#paintarea').unbind("dblclick");
                        // 绑定流程模版设计器面板双击事件
                        $('#paintarea').dblclick(function() {
                          openProcessProperty(processId);
                        });
                    } else {
                        fnTip("模板ID为空！", 1500);
                        return false;
                    }
                } catch (e) {
                    tip(e.message);
                }
            }
        });
      },
      done: function(res){
          alert(res);
      }
    });
}*/

/**
 * 保存模版
 */
function saveProcess() {
    layerIndex = layui.layer.msg('流程保存中', {
        icon: 16,
        shade: 0.01
    });
    const xml = workflow.toXML();
    m_processProp.processBytes = xml;
    const url = getBaseUrl() + '/bpm/process/definition/update';
    const reData = getApiPojo();
    reData.processId = m_processId;
    reData.data = {
        candidateDTOs: m_candidates,
        parameterDTOs: m_parameters,
        listenerDTOs: m_listeners,
        linepropDTOs: m_lines,
        activities: m_activities,
        procpropDTO: m_processProp
    }
    postRequest(url, reData, function(res) {
        layerIndex && layui.layer.close(layerIndex);
        fnTip(res.msg, 2000);
    });
    m_needSave = false;
}

/**
 * 模版发布
 */
function deployModel() {
    fnConfirm('确认发布该模版？', function(modelIndex, layerObj, closeNow) {
        // layerIndex = layui.layer.msg('流程发布中', {
        //     icon: 16,
        //     shade: 0.01
        // });

        // const reData = getApiPojo();
        // const url = getBaseUrl() + '/bpm/process/definition/deploy';
        // const xml = workflow.toXML();
        // m_processProp.categoryId = m_categoryId;
        // m_processProp.processBytes = xml;
        // reData.data = {
        //     candidateDTOs: m_candidates,
        //     parameterDTOs: m_parameters,
        //     listenerDTOs: m_listeners,
        //     linepropDTOs: m_lines,
        //     activities: m_activities,
        //     procpropDTO: m_processProp
        // };
        // postRequest(url, reData, function(res) {
        //     layerIndex && layui.layer.close(layerIndex);
        //     if (res.code === 0) {
                // fnTip('发布成功！', 1500);

                // // 产生新的流程模版ID，原新建流程模版ID失效，必须重新加载树
                // const procId = ''; // res.resData.procId;
                // loadProcessCategory(procId);
                console.log($('#descriptorarea').val());
                alert($('#descriptorarea').val())
        //     } else {
        //         fnAlert(res.msg);
        //     }
        // });
        closeNow();
    });
}

/**
 * 删除模版
 */
function deleteProcess() {
    if (m_processId) {
        fnConfirm('确认删除当前选中流程模版？', function (modelIndex, layerObj, closeNow) {
            const url = getBaseUrl() + '/bpm/process/definition/delete';
            const resquestData = getApiPojo();
            resquestData.processId = m_processId;

            postRequest(url, resquestData, function (res) {
                closeNow();
                if (res.code === 0) {
                    loadProcessCategory(null);

                    $('#right .form-box .noinfo').show();
                    $('#right .form-box .edit-box').hide();
                    $('#divDesigner').hide();
                    $('#descriptorarea').val('');
                    $('#addCategory').hide();
                    $('#updateCategory').hide();
                    $('#deleteCategory').hide();
                    $('#saveProcess').hide();
                    $('#deployModel').hide();
                    // $("#undoModel").hide();
                    // $("#redoModel").hide();
                    $('#deleteProcess').hide();
                    $('#openProperties').hide();
                    $('#configDoc').hide();

                    clearModel();
                    fnTip('删除成功！', 1500);
                } else {
                    fnAlert(res.msg);
                }
            });
        });
    }
}

/**
 * 导出流程模版
 * @returns
 */
function exportProcess() {
    const tempHtml = '<div id="exportBox" class="h-100">' +
      '              <div id="exportProcessCategory" class="ztree scrollbar"></div>' +
      '              <div class="exportSelectItem">' +
      '                <form class="layui-form">' +
      '                  <div class="select-other">' +
      '                    <label>附加项：</label>' +
      '                    <input type="checkbox" name="userSetting" lay-skin="primary" title="用户配置">' +
      '                    <input type="checkbox" name="pluginSetting" lay-skin="primary" title="插件配置">' +
      '                    <input type="checkbox" name="DocSetting" lay-skin="primary" title="附件配置">' +
      '                  </div>' +
      '                  <button class="layui-btn geo-btn-default" lay-submit lay-filter="btnExport">导出</button>' +
      '                </form>' +
      '              </div>' +
      '           </div>';
    const modalObj = {
        title: '导出流程模版',
        width: 450,
        height: 500,
        modalIndex: -1000,
        needB: false
    };
    const showCallBack = function() {
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
            }
        };
        const allNodes = $.fn.zTree.getZTreeObj('treeProcessCategory').getNodesByParam('pid', '');
        $.fn.zTree.init($('#exportProcessCategory'), settings, allNodes);
        const url = getBaseUrl() + '/bpm/process/export' + translateJsonToParams(getApiPojo(), true);
        const $formBox = $('#exportBox .layui-form');
        $formBox.attr({
            'target': '',
            'method': 'post',
            'action': url
        });
        layui.form.on('submit(btnExport)', function(data) {
            const nodes = $.fn.zTree.getZTreeObj('exportProcessCategory').getCheckedNodes(true);
            if (nodes.length > 0) {
                const layerIndex = layui.layer.msg('流程导出中', {
                    icon: 16,
                    shade: 0.01
                });
                let exportProc = '';
                nodes.forEach(function (item) {
                    if (item.id !== 'root') {
                        exportProc += '|' + item.id + ':' + item.type;
                    }
                });
                exportProc = exportProc.substring(1);
                const tempHtml = '<input type="hidden" name="exportCandidate" value="' + (!!data.field.userSetting) + '"/>' +
                    '<input type="hidden" name="exportListener" value="' + (!!data.field.pluginSetting) + '"/>' +
                    '<input type="hidden" name="exportDoc" value="' + (!!data.field.DocSetting) + '"/>' +
                    '<input type="hidden" name="exportProc" value="' + exportProc + '" />';
                $formBox.append(tempHtml);
                $formBox.submit(function (e) {
                    layerIndex && layui.layer.close(layerIndex)
                });
                $formBox.submit()
            } else {
                fnTip('请选择需要导出的流程模版！', 1500);
            }
            return false;
        });
    };
    fnAlertShow(tempHtml, modalObj, showCallBack);
}

/**
 * 导入流程模版
 * @returns
 */
function importProcess() {
    const upload = layui.upload;
    const url = getBaseUrl() + '/bpm/process/import?' + $.param(getApiPojo());
    // 执行实例
    upload.render({
        elem: '#importProcess', // 绑定元素
        url: url, // 上传接口
        accept: 'file',
        done: function (res) {
            if (res.code === 0) {
                fnTip(res.msg, 2000);
                loadProcessCategory(null);
            } else {
                fnAlert(res.msg, '', false);
            }
        },
        error: function () {
            fnAlert('导入失败，请联系管理员！', '', false);
        }
    });
}

/**
 * 克隆流程模版
 * @returns
 */
function cloneProcess() {
    const tempHtml = '<div id="cloneBox" class="h-100">' +
      '              <div id="cloneProcessCategory" class="ztree scrollbar"></div>' +
      '              <div class="cloneSelectItem">' +
      '                <form class="layui-form">' +
      '                  <div class="select-other">' +
      '                    <label>附加项：</label>' +
      '                    <input type="checkbox" name="userSetting" lay-skin="primary" title="用户配置">' +
      '                    <input type="checkbox" name="pluginSetting" lay-skin="primary" title="插件配置">' +
      '                    <input type="checkbox" name="DocSetting" lay-skin="primary" title="附件配置">' +
      '                  </div>' +
      '                  <button class="layui-btn geo-btn-default" lay-submit lay-filter="btnClone">克隆</button>' +
      '                </form>' +
      '              </div>' +
      '           </div>';
    const modalObj = {
        title: '克隆流程模版',
        width: 450,
        height: 500,
        modalIndex: -1000,
        needB: false
    };
    const showCallBack = function(index, layero, closeNow) {
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
            }
        };
        const procTreeObj = $.fn.zTree.getZTreeObj('treeProcessCategory');
        const allNodes = procTreeObj.getNodesByParam('pid', '');
        const cloneTreeObj = $.fn.zTree.init($('#cloneProcessCategory'), settings, allNodes);
        const selectNode = procTreeObj.getSelectedNodes()[0];
        const node = cloneTreeObj.getNodeByParam('id', selectNode.id);
        cloneTreeObj.removeNode(node);
        layui.form.on('submit(btnClone)', function(data) {
            const cloneTreeObj = $.fn.zTree.getZTreeObj('cloneProcessCategory');
            const nodes = cloneTreeObj.getSelectedNodes();
            if (nodes.length < 1) {
                fnTip('请选择需要克隆的流程模版', 1500)
            } else {
                const layerIndex = layui.layer.msg('流程克隆中', {
                    icon: 16,
                    shade: 0.01
                });
                const url = getBaseUrl() + '/bpm/process/clone';
                const options = $.extend(getApiPojo(), {
                    processId: nodes[0].id,
                    catId: selectNode.pid,
                    cloneCandidate: (!!data.field.userSetting),
                    cloneListener: (!!data.field.pluginSetting),
                    cloneDoc: (!!data.field.DocSetting),
                    catName: m_newModal.type,
                    processName: m_newModal.name
                });
                const sucessCallBack = function(res) {
                    if (res.code === 0) {
                        layerIndex && layui.layer.close(layerIndex);
                        closeNow();
                        const processId = res.resData.processId;
                        if (processId) {
                            loadProcessCategory(processId);
                        }
                    } else {
                        fnTip(res.msg, 3000);
                    }
                };
                postRequest(url, options, sucessCallBack);
                m_newModal = {
                    name: '',
                    type: ''
                };
            }
            return false;
        })
    };
    fnAlertShow(tempHtml, modalObj, showCallBack);
}

/**
 * 解析XML数据，绘制流程图
 * @param data
 * @param infoObj
 * @returns
 */
function parseProcessDescriptor(data, infoObj) {
    const id = 'process' + Sequence.create();

    const isBrowserWebkit = false; // $.browser.webkit
    const BPMNShape = (isBrowserWebkit) ? 'BPMNShape' : 'bpmndi\\:BPMNShape';
    const BPMNEdge = (isBrowserWebkit) ? 'BPMNEdge' : 'bpmndi\\:BPMNEdge';
    const executionListener = (isBrowserWebkit) ? 'activiti\\:executionListener'
        : 'executionListener';
    const Bounds = (isBrowserWebkit) ? 'Bounds' : 'omgdc\\:Bounds';
    const waypoint = (isBrowserWebkit) ? 'waypoint' : 'omgdi\\:waypoint';
    const taskListener = (isBrowserWebkit) ? 'taskListener'
        : 'activiti\\:taskListener';
    const formProperty = (isBrowserWebkit) ? 'formProperty'
        : 'activiti\\:formProperty';
    const field = (isBrowserWebkit) ? 'activiti\\:field' : 'field';
    const expression = (isBrowserWebkit) ? 'expression' : 'activiti\\:expression';
    const intag = (isBrowserWebkit) ? 'in' : 'activiti\\:in';
    const outtag = (isBrowserWebkit) ? 'out' : 'activiti\\:out';
    const descriptor = $(data);
    const definitions = descriptor.find('definitions');
    const process = descriptor.find('process');
    const startEvent = descriptor.find('startEvent');
    const endEvent = descriptor.find('endEvent');
    const manualTasks = descriptor.find('manualTask');
    const userTasks = descriptor.find('userTask');
    const serviceTasks = descriptor.find('serviceTask');
    const scriptTasks = descriptor.find('scriptTask');
    const receiveTasks = descriptor.find('receiveTask');
    const exclusiveGateway = descriptor.find('exclusiveGateway');
    const inclusiveGateway = descriptor.find('inclusiveGateway');
    const parallelGateway = descriptor.find('parallelGateway');
    const timerBoundary = descriptor.find('boundaryEvent');
    const callActivitys = descriptor.find('callActivity');
    const businessRuleTasks = descriptor.find('businessRuleTask');
    const lines = descriptor.find('sequenceFlow');

    const shapes = descriptor.find(BPMNShape);
    const edges = descriptor.find(BPMNEdge);

    if (!definitions.attr('targetNamespace')) {
        workflow.process.category = infoObj.categoryName;
        m_processProp.categoryId = infoObj.categoryId;
        m_processProp.processCategory = infoObj.categoryName;
    } else {
        workflow.process.category = XMLEncode(definitions.attr('targetNamespace'));
    }

    if (!process.attr('id')) {
        workflow.process.id = id;
    } else {
        workflow.process.id = process.attr('id');
    }

    if (!process.attr('name')) {
        workflow.process.name = infoObj.processName;
        m_processProp.processName = infoObj.processName;
    } else {
        workflow.process.name = XMLEncode(process.attr('name'));
    }

    const documentation = trim(descriptor.find('process > documentation').text());
    if (!documentation) {
        workflow.process.documentation = infoObj.processNote;
        m_processProp.processDescription = infoObj.processNote;
    } else {
        workflow.process.documentation = XMLEncode(documentation);
    }

    const extentsion = descriptor.find('process > extensionElements');
    if (extentsion != null) {
        const listeners = extentsion.find('activiti\\:executionListener');
        workflow.process.setListeners(parseListeners(listeners,
            'draw2d.Process.Listener', 'draw2d.Process.Listener.Field'));
    }

    const processDefinitionVariables = ''; // 未使用
    $.each(processDefinitionVariables, function(i, n) {
        const variable = new draw2d.Process.variable();
        variable.name = n.name;
        variable.type = n.type;
        variable.scope = n.scope;
        variable.defaultValue = n.defaultValue;
        variable.remark = n.remark;
        workflow.process.addVariable(variable);
    });

    startEvent.each(function(i) {
        const start = new draw2d.Start();
        start.id = $(this).attr('id');
        start.eventId = $(this).attr('id');
        start.eventName = $(this).attr('name');
        let expression = $(this).attr('activiti:initiator');
        if (expression === null || expression === 'null') {
            expression = '';
        }
        start.expression = expression;
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === start.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                start.setDimension(w, h);
                workflow.addFigure(start, x, y);
                return false;
            }
        });
    });
    endEvent.each(function(i) {
        const end = new draw2d.End();
        end.id = $(this).attr('id');
        end.eventId = $(this).attr('id');
        end.eventName = $(this).attr('name');
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === end.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                end.setDimension(w, h);
                workflow.addFigure(end, x, y);
                return false;
            }
        });
    });

    userTasks.each(function(i) {
        const task = new draw2d.UserTask();
        const tid = $(this).attr('id');
        task.id = tid;
        const tname = $(this).attr('name');
        const assignee = $(this).attr('activiti:assignee');
        const candidataUsers = $(this).attr('activiti:candidateUsers');
        const candidataGroups = $(this).attr('activiti:candidateGroups');
        const formKey = $(this).attr('activiti:formKey');

        if (assignee) { // 指定了签收人，那么候选人无效
            task.isUseExpression = true;
            task.performerType = 'assignee';
            task.expression = assignee;
        } else { // 仅指定候选人情况
            // 候选职员情况
            if (candidataUsers) {
                // 这里存在多个情况，使用英文逗号拼接
                task.addCandidateUser({
                    sso: candidataUsers
                });
            }

            // 候选角色情况
            if (candidataGroups) {
                // 这里存在多个情况，使用英文逗号拼接
                task.addCandidateGroup(candidataGroups);
            }
        }

        if (formKey !== null && formKey !== '') {
            task.formKey = formKey;
        }

        // begin---author:zhangdaihao date:20140730 for:动态会签
        const multiInstanceLoopCharacteristics = $(this).find(
            'multiInstanceLoopCharacteristics');
        const isSequential = $(multiInstanceLoopCharacteristics).attr(
            'isSequential');
        if (isSequential !== null && isSequential !== '') {
            task.task_extend = isSequential;
        }
        // end---author:zhangdaihao date:20140730 for:动态会签

        const documentation = XMLEncode(trim($(this).find('documentation').text()));
        if (documentation != null && documentation !== '') { task.documentation = documentation; }
        task.taskId = tid;
        task.taskName = XMLEncode(tname);
        task.setContent(tname);
        const listeners = $(this).find('extensionElements').find(
            taskListener);

        task.setListeners(parseListeners(listeners,
            'draw2d.Task.Listener', 'draw2d.Task.Listener.Field'));
        const forms = $(this).find('extensionElements').find(
            'activiti\\:formProperty');
        task.setForms(parseForms(forms, 'draw2d.Task.Form'));
        const performersExpression = $(this).find('potentialOwner').find(
            'resourceAssignmentExpression')
            .find('formalExpression').text();
        if (performersExpression.indexOf('user(') !== -1) {
            task.performerType = 'candidateUsers';
        } else if (performersExpression.indexOf('group(') !== -1) {
            task.performerType = 'candidateGroups';
        }
        const performers = performersExpression.split(',');
        $.each(performers, function(i, n) {
            let start = 0;
            const end = n.lastIndexOf(')');
            if (n.indexOf('user(') !== -1) {
                start = 'user('.length;
                const performer = n.substring(start, end);
                task.addCandidateUser({
                    sso: performer
                });
            } else if (n.indexOf('group(') !== -1) {
                start = 'group('.length;
                const performer = n.substring(start, end);
                task.addCandidateGroup(performer);
            }
        });
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === task.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                task.setDimension(w, h);
                workflow.addModel(task, x, y);
                return false;
            }
        });
    });

    manualTasks.each(function(i) {
        const task = new draw2d.ManualTask();
        const tid = $(this).attr('id');
        task.id = tid;
        const tname = $(this).attr('name');
        const assignee = $(this).attr('activiti:assignee');
        const candidataUsers = $(this).attr('activiti:candidateUsers');
        const candidataGroups = $(this).attr('activiti:candidateGroups');
        const formKey = $(this).attr('activiti:formKey');
        if (assignee !== null && assignee !== '') {
            task.isUseExpression = true;
            task.performerType = 'assignee';
            task.expression = assignee;
        } else if (candidataUsers !== null && candidataUsers !== '') {
            task.isUseExpression = true;
            task.performerType = 'candidateUsers';
            task.expression = candidataUsers;
        } else if (candidataGroups !== null && candidataGroups !== '') {
            task.isUseExpression = true;
            task.performerType = 'candidateGroups';
            task.expression = candidataGroups;
        }
        if (formKey != null && formKey !== '') {
            task.formKey = formKey;
        }
        const documentation = trim($(this).find('documentation').text());
        if (documentation != null && documentation !== '') { task.documentation = documentation; }
        task.taskId = tid;
        task.taskName = tname;
        task.setContent(tname);
        const listeners = $(this).find('extensionElements').find(
            'activiti\\:taskListener');
        task.setListeners(parseListeners(listeners, 'draw2d.Task.Listener',
            'draw2d.Task.Listener.Field'));
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === task.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                task.setDimension(w, h);
                workflow.addModel(task, x, y);
                return false;
            }
        });
    });

    serviceTasks.each(function(i) {
        const flag = $(this).attr('activiti:type');
        if (flag === 'mail') {
            const task = new draw2d.MailTask();
            const tid = $(this).attr('id');
            task.id = tid;
            const elements = $(this).find('activiti\\:field');
            elements.each(function(i) {
                if ($(this).attr('name') === 'to') {
                    task.toEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'from') {
                    task.fromEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'subject') {
                    task.subjectEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'cc') {
                    task.ccEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'bcc') {
                    task.bccEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'charset') {
                    task.charsetEmail = $(this).attr('expression');
                }
                if ($(this).attr('name') === 'html') {
                    task.htmlEmail = trim($(this).find('activiti\\:expression')
                        .text());
                }
                if ($(this).attr('name') === 'text') {
                    task.textEmail = trim($(this).find('activiti\\:expression')
                        .text());
                }
            });

            task.taskId = tid;

            shapes.each(function(i) {
                const id = $(this).attr('bpmnElement');
                if (id === task.id) {
                    const x = parseInt($(this).find(Bounds).attr('x'), 10);
                    const y = parseInt($(this).find(Bounds).attr('y'), 10);
                    workflow.addModel(task, x, y);
                    return false;
                }
            });
        } else {
            const task = new draw2d.ServiceTask();
            const tid = $(this).attr('id');
            task.id = tid;
            const tname = $(this).attr('name');
            const assignee = $(this).attr('activiti:assignee');
            const candidataUsers = $(this).attr('activiti:candidateUsers');
            const candidataGroups = $(this).attr('activiti:candidateGroups');
            const formKey = $(this).attr('activiti:formKey');
            if (assignee != null && assignee !== '') {
                task.isUseExpression = true;
                task.performerType = 'assignee';
                task.expression = assignee;
            } else if (candidataUsers != null && candidataUsers !== '') {
                task.isUseExpression = true;
                task.performerType = 'candidateUsers';
                task.expression = candidataUsers;
            } else if (candidataGroups != null && candidataGroups !== '') {
                task.isUseExpression = true;
                task.performerType = 'candidateGroups';
                task.expression = candidataGroups;
            }
            if (formKey != null && formKey !== '') {
                task.formKey = formKey;
            }
            const documentation = trim($(this).find('documentation').text());
            if (documentation != null && documentation !== '') { task.documentation = documentation; }
            task.taskId = tid;
            task.taskName = tname;
            // if (tid != tname)
            task.setContent(tname);
            const listeners = $(this).find('extensionElements').find(
                'activiti\\:taskListener');
            task.setListeners(parseListeners(listeners, 'draw2d.Task.Listener',
                'draw2d.Task.Listener.Field'));
            const performersExpression = $(this).find('potentialOwner').find(
                'resourceAssignmentExpression').find('formalExpression')
                .text();
            if (performersExpression.indexOf('user(') !== -1) {
                task.performerType = 'candidateUsers';
            } else if (performersExpression.indexOf('group(') !== -1) {
                task.performerType = 'candidateGroups';
            }
            const performers = performersExpression.split(',');
            $.each(performers, function(i, n) {
                let start = 0;
                const end = n.lastIndexOf(')');
                if (n.indexOf('user(') !== -1) {
                    start = 'user('.length;
                    const performer = n.substring(start, end);
                    task.addCandidateUser({
                        sso: performer
                    });
                } else if (n.indexOf('group(') !== -1) {
                    start = 'group('.length;
                    const performer = n.substring(start, end);
                    task.addCandidateGroup(performer);
                }
            });
            shapes.each(function(i) {
                const id = $(this).attr('bpmnElement');
                if (id === task.id) {
                    const x = parseInt($(this).find(Bounds).attr('x'), 10);
                    const y = parseInt($(this).find(Bounds).attr('y'), 10);
                    const w = parseInt($(this).find(Bounds).attr('width'), 10);
                    const h = parseInt($(this).find(Bounds).attr('height'), 10);
                    task.setDimension(w, h);
                    workflow.addModel(task, x, y);
                    return false;
                }
            });
        }
    });

    scriptTasks.each(function(i) {
        const task = new draw2d.ScriptTask();
        const tid = $(this).attr('id');
        task.id = tid;
        const tname = $(this).attr('name');
        const scriptFormat = $(this).attr('scriptFormat');
        const resultVariable = $(this).attr('activiti:resultVariable');
        task.scriptFormat = scriptFormat;
        task.resultVariable = resultVariable;
        const documentation = trim($(this).find('documentation').text());
        if (documentation !== null && documentation !== '') { task.documentation = documentation; }
        const script = trim($(this).find('script').text());
        if (script != null && script !== '') { task.expression = script; }
        task.taskId = tid;
        task.taskName = tname;
        // if (tid != tname)
        task.setContent(tname);

        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === task.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                task.setDimension(w, h);
                workflow.addModel(task, x, y);
                return false;
            }
        });
    });

    receiveTasks.each(function(i) {
        const task = new draw2d.ReceiveTask();
        const tid = $(this).attr('id');
        task.id = tid;
        const tname = $(this).attr('name');
        task.taskId = tid;
        task.taskName = tname;
        // if (tid != tname)
        task.setContent(tname);

        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === task.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                task.setDimension(w, h);
                workflow.addModel(task, x, y);
                return false;
            }
        });
    });

    exclusiveGateway.each(function(i) {
        const gateway = new draw2d.ExclusiveGateway();
        const gtwid = $(this).attr('id');
        const gtwname = $(this).attr('name');
        gateway.id = gtwid;
        gateway.gatewayId = gtwid;
        gateway.gatewayName = gtwname;
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === gateway.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                gateway.setDimension(w, h);
                workflow.addModel(gateway, x, y);
                return false;
            }
        });
    });
    inclusiveGateway.each(function(i) {
        const gateway = new draw2d.InclusiveGateway();
        const gtwid = $(this).attr('id');
        const gtwname = $(this).attr('name');
        gateway.id = gtwid;
        gateway.gatewayId = gtwid;
        gateway.gatewayName = gtwname;
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === gateway.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                gateway.setDimension(w, h);
                workflow.addModel(gateway, x, y);
                return false;
            }
        });
    });
    parallelGateway.each(function(i) {
        const gateway = new draw2d.ParallelGateway();
        const gtwid = $(this).attr('id');
        const gtwname = $(this).attr('name');
        gateway.id = gtwid;
        gateway.gatewayId = gtwid;
        gateway.gatewayName = gtwname;
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === gateway.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                gateway.setDimension(w, h);
                workflow.addModel(gateway, x, y);
                return false;
            }
        });
    });

    timerBoundary.each(function(i) {
        if ($(this).find('timeDate').text() !== '') {
            const timeBoundaryevent = new draw2d.TimerBoundary('plug-in/designer/icons/timer.png');
            const boundaryId = $(this).attr('id');
            const cancelActivity = $(this).attr('cancelActivity');
            const attachedToRef = $(this).attr('attachedToRef');
            timeBoundaryevent.id = boundaryId;
            timeBoundaryevent.boundaryId = boundaryId;
            timeBoundaryevent.cancelActivity = cancelActivity;
            timeBoundaryevent.attached = attachedToRef;
            timeBoundaryevent.timeType = 'timeDate';
            timeBoundaryevent.expression = $(this).find('timeDate').text();
        } else if ($(this).find('timeDuration').text() !== '') {
            const timeBoundaryevent = new draw2d.TimerBoundary('plug-in/designer/icons/timer.png');
            const boundaryId = $(this).attr('id');
            const cancelActivity = $(this).attr('cancelActivity');
            const attachedToRef = $(this).attr('attachedToRef');
            timeBoundaryevent.id = boundaryId;
            timeBoundaryevent.boundaryId = boundaryId;
            timeBoundaryevent.cancelActivity = cancelActivity;
            timeBoundaryevent.attached = attachedToRef;
            timeBoundaryevent.timeType = 'timeDuration';
            timeBoundaryevent.expression = $(this).find('timeDuration').text();
        } else if ($(this).find('timeCycle').text() !== '') {
            const timeBoundaryevent = new draw2d.TimerBoundary('plug-in/designer/icons/timer.png');
            const boundaryId = $(this).attr('id');
            const cancelActivity = $(this).attr('cancelActivity');
            const attachedToRef = $(this).attr('attachedToRef');
            timeBoundaryevent.id = boundaryId;
            timeBoundaryevent.boundaryId = boundaryId;
            timeBoundaryevent.cancelActivity = cancelActivity;
            timeBoundaryevent.attached = attachedToRef;
            timeBoundaryevent.timeType = 'timeCycle';
            timeBoundaryevent.expression = $(this).find('timeCycle').text();
        } else {
            const timeBoundaryevent = new draw2d.ErrorBoundary('plug-in/designer/icons/error.png');
            const boundaryId = $(this).attr('id');
            const attachedToRef = $(this).attr('attachedToRef');
            timeBoundaryevent.id = boundaryId;
            timeBoundaryevent.boundaryId = boundaryId;
            timeBoundaryevent.attached = attachedToRef;
            timeBoundaryevent.expression = $(this).find('errorEventDefinition')
                .attr('errorRef');
        }
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === timeBoundaryevent.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                timeBoundaryevent.setDimension(w, h);
                workflow.addModel(timeBoundaryevent, x, y);
                return false;
            }
        });
    });

    callActivitys.each(function(i) {
        const callActivity = new draw2d.CallActivity(
            'plug-in/designer/icons/callactivity.png');
        const subProcessId = $(this).attr('id');
        const name = $(this).attr('name');
        const callSubProcess = $(this).attr('calledElement');
        callActivity.id = subProcessId;
        callActivity.subProcessId = subProcessId;
        callActivity.callSubProcess = callSubProcess;
        callActivity.name = name;
        const flag = $(this).find('extensionElements');
        if (flag != null) {
            callActivity.insource = $(this).find(intag).attr('source');
            callActivity.intarget = $(this).find(intag).attr('target');
            callActivity.outsource = $(this).find(outtag).attr('source');
            callActivity.outtarget = $(this).find(outtag).attr('target');
        }
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === callActivity.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                callActivity.setDimension(w, h);
                workflow.addModel(callActivity, x, y);
                return false;
            }
        });
    });

    businessRuleTasks.each(function(i) {
        const task = new draw2d.BusinessRuleTask();
        const tid = $(this).attr('id');
        const valueInput = $(this).attr('activiti:ruleVariablesInput');
        const valueOutput = $(this).attr('activiti:resultVariables');
        const rules = $(this).attr('activiti:rules');
        const exclude = $(this).attr('exclude');
        if (rules != null && rules !== '') {
            task.rules = rules;
            if (exclude != null && exclude !== '') {
                task.isclude = 'exclude';
            } else {
                task.isclude = 'include';
            }
        } else {
            task.isclude = '';
        }
        task.id = tid;
        task.taskId = tid;
        task.rulesInput = valueInput;
        task.rulesOutputs = valueOutput;
        shapes.each(function(i) {
            const id = $(this).attr('bpmnElement');
            if (id === task.id) {
                const x = parseInt($(this).find(Bounds).attr('x'), 10);
                const y = parseInt($(this).find(Bounds).attr('y'), 10);
                const w = parseInt($(this).find(Bounds).attr('width'), 10);
                const h = parseInt($(this).find(Bounds).attr('height'), 10);
                task.setDimension(w, h);
                workflow.addModel(task, x, y);
                return false;
            }
        });
    });

    lines.each(function(i) {
        const lid = $(this).attr('id');
        const name = $(this).attr('name');
        const condition = $(this).find('conditionExpression').text();
        const sourceRef = $(this).attr('sourceRef');
        const targetRef = $(this).attr('targetRef');
        const source = workflow.getFigure(sourceRef);
        const target = workflow.getFigure(targetRef);
        edges.each(function(i) {
            const eid = $(this).attr('bpmnElement');
            if (eid === lid) {
                let startPort = null;
                let endPort = null;
                const points = $(this).find(waypoint);
                const len = points.length;
                const startX = Math.round($(points[0]).attr('x'));
                const startY = Math.round($(points[0]).attr('y'));
                const endX = Math.round($(points[len - 1]).attr('x'));
                const endY = Math.round($(points[len - 1]).attr('y'));
                const sports = source.getPorts();
                for (let i = 0; i < sports.getSize(); i++) {
                    const s = sports.get(i);
                    const x = parseInt(s.getAbsoluteX(), 10);
                    const y = parseInt(s.getAbsoluteY(), 10);
                    if (x === startX && y === startY) {
                        startPort = s;
                        break;
                    }
                }

                const tports = target.getPorts();

                for (let i = 0; i < tports.getSize(); i++) {
                    const t = tports.get(i);
                    const x = parseInt(t.getAbsoluteX(), 10);
                    const y = parseInt(t.getAbsoluteY(), 10);
                    if (x === endX && y === endY) {
                        endPort = t;

                        break;
                    }
                }
                if (startPort != null && endPort != null) {
                    const cmd = new draw2d.CommandConnect(workflow, startPort,
                        endPort);
                    const connection = new draw2d.DecoratedConnection();

                    connection.id = lid;
                    connection.lineId = lid;
                    connection.lineName = XMLEncode(name);
                    connection.setLabel(name);
                    if (condition != null && condition !== '') {
                        connection.condition = condition;
                    }
                    cmd.setConnection(connection);
                    workflow.getCommandStack().execute(cmd);
                }
                return false;
            }
        });
    });

    if (typeof setHightlight !== 'undefined') {
        setHightlight();
    }

    // 默认选中流程模版
    workflow.setCurrentSelection(null);
    $('#descriptorarea').val(workflow.toXML());
    layerIndex && layui.layer.close(layerIndex);
}

/**
 * 监听器转换（未使用）
 *
 * @param listeners
 * @param listenerType
 * @param fieldType
 * @returns {draw2d.ArrayList}
 */
function parseListeners(listeners, listenerType, fieldType) {
    const parsedListeners = new draw2d.ArrayList();
    listeners.each(function(i) {
        const listener = eval('new ' + listenerType + '()');
        listener.event = $(this).attr('event');
        listener.id = $(this).attr('id');
        const expression = $(this).attr('delegateExpression');
        const clazz = $(this).attr('class');
        if (expression != null && expression !== '') {
            listener.serviceType = 'expression';
            listener.serviceExpression = expression;
        } else if (clazz != null && clazz !== '') {
            listener.serviceType = 'javaClass';
            listener.serviceClass = clazz;
        }
        const fields = $(this).find('activiti\\:field');
        fields.each(function(i) {
            const field = eval('new ' + fieldType + '()');
            field.name = $(this).attr('name');
            const string = $(this).find('activiti\\:string').text();
            const expression = $(this).find('activiti\\:expression').text();
            if (string != null && string !== '') {
                field.type = 'string';
                field.value = string;
            } else if (expression != null && expression !== '') {
                field.type = 'expression';
                field.value = expression;
            }
            listener.setField(field);
        });
        parsedListeners.add(listener);
    });
    return parsedListeners;
}

/**
 * 应用程序转换（未使用）
 * @param forms
 * @param formType
 * @returns
 */
function parseForms(forms, formType) {
    const parsedForms = new draw2d.ArrayList();
    forms.each(function(i) {
        const form = eval('new ' + formType + '()');
        form.id = $(this).attr('id');
        const name = $(this).attr('name');
        form.name = name;
        const type = $(this).attr('type');
        form.type = type;
        const value = $(this).attr('value');
        form.value = value;
        const exp = $(this).attr('exp');
        form.exp = exp;
        const remark = $(this).attr('remark');
        form.remark = remark;
        parsedForms.add(form);
    });
    return parsedForms;
}

/**
 * 打开文档参数配置页面
 * @returns
 */
function openCurrElementDocConfig() {
    if (workflow) {
        // 获取当前选中模版元素
        const currElement = workflow.getCurrentSelection();
        if (currElement == null) {
            openDocConfig('', '');
        } else {
            if (currElement.type === 'draw2d.UserTask') {
                openDocConfig(currElement.taskId, currElement.taskName);
            } else {
                fnTip('请选中流程模版空白处或活动节点！', 1500);
            }
        }
    }
}

/**
 * 调用文档模块的参数配置
 * @param taskId
 */
function openDocConfig(taskId, taskName) {
    if (m_processId === null) {
        fnTip('未获取到流程信息！', 1500);
        return false;
    }

    let pType = '流程模板';
//    if (taskId != null && taskId !== '') {
//        pType = '节点模板';
//    }
    const url = '/geoios/frames/doc/templateArea/index.html?parentPnode=' + m_processId + '&pNode=' + taskId + '&pType=' + encodeURIComponent(pType);
    const strHtml = '<iframe src="' + url + '"></iframe>';

    let title = '过程-';
    if (taskName != null && taskName !== '') {
        title = '活动[' + taskName + ']-';
    }

    const objModal = {
        'title': title + '附件设置',
        'needB': false,
        'width': 748,
        'height': 454
    };
    fnAlertShow(strHtml, objModal, function() {

    }, function(modelIndex, layerObj, closeNow) {

    });
}

/**
 * &lt; < 小于号
 * &gt; > 大于号
 * &amp; & 和
 * &apos; ' 单引号
 * &quot; " 双引号
 * @param text
 * @returns
 */
function XMLEncode(text) {
    if (!text) { return ''; }

    text = text.replace(/&/g, '&amp;');
    text = text.replace(/'/g, '&apos;');
    text = text.replace(/"/g, '&quot;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');

    return text;
}

function XMLDecode(text) {
    if (!text) { return ''; }

    text = text.replace(/&apos;/g, '\'');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&amp;/g, '&');

    return text;
}
/**
 * 拷入拷出界面弹窗
 */
function showCopyIntoOutPopup (id, type, isAct, isCopyOut) {
    const table = layui.table;
    const tempHtml = '<div id="copyIntoOutBox">' +
    '                    <div class="select-box">' +
    '                       <div class="ztree scrollbar" id="copyIntoOutProcessTree"></div>' +
    '                       <div class="type-table-box">' +
    '                          <table id="copyIntoOutTable" lay-filter="copyIntoOutTable"></table>' +
    '                       </div>' +
    '                    </div>' +
    '                    <div class="layui-form">' +
    '                       <input type="checkbox" name="isClear" title="清除原有' + type + '"  lay-skin="primary">' +
    '                       <button class="layui-btn geo-btn-default" lay-submit lay-filter="formCopyProcess">确定</button>' +
    '                    </div>' +
    '                 </div>';
    const modalObj = {
        title: '请选择' + (isCopyOut ? '拷出' : '拷入') + type,
        width: 800,
        height: 600,
        needB: false
    };
    const showCallback = function (index, layero, closeLayero) {
        $('#copyIntoOutBox').css({
            'width': '100%',
            'height': '100%',
            'overflow': 'hidden'
        }).children('.layui-form').css({
            'display': 'flex',
            'justify-content': 'space-between',
            'padding': '5px 10px 0',
            'min-height': '32px',
            'border-top': '1px solid #eee'
        }).prev('.select-box').css({
            'display': 'flex',
            'justify-content': 'space-between',
            'height': 'calc(100% - 39px)'
        }).children().eq(1).css({
            'width': '500px',
            'min-width': '500px'
        });
        const tableSthObj = getTableSth(type, isAct);
        const reloadCopyIntoOutTable = function (type, isAct, id) {
            const reqData = getApiPojo();
            const resListType = tableSthObj.resListType || '';
            if (isAct) {
                reqData.activityId = id;
            } else {
                reqData.processId = id
            }
            if (!resListType) {
                return;
            }
            postRequest(tableSthObj.strUrl, reqData, function (res) {
                if (res.code === 0 && res.resData && res.resData[resListType]) {
                    table.reload('copyIntoOutTable', { cols: tableSthObj.cols, data: res.resData[resListType] });
                } else {
                    table.reload('copyIntoOutTable', { cols: tableSthObj.cols, data: [] });
                }
            })
        }
        const zTreeOnClick = function (event, treeId, treeNode) {
            if (!isAct && treeNode.type === '模版' || (isAct && treeNode.type === '活动')) {
                reloadCopyIntoOutTable(type, isAct, treeNode.id);
            }
        }
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
            callback: {}
        };
        const resetData = function (arr) {
            arr.forEach(function(item) {
                if (item.type === '模版') {
                    if (isAct) {
                        !item.children && (item.children = []);
                    } else {
                        item.children && (delete item.children);
                    }
                }
                item.children && item.children.length > 0 && resetData(item.children);
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
                            item.activityId !== id && procActsData.push({
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
        !!isCopyOut && (settings.check = { enable: true });
        !isCopyOut && (settings.callback.onClick = zTreeOnClick);
        const allNodes = $.fn.zTree.getZTreeObj('treeProcessCategory').getNodesByParam('pid', '');
        resetData(allNodes);
        if (isAct) {
            settings.callback.beforeExpand = zTreeBeforeExpand;
        }
        const copyIntoOutTreeObj = $.fn.zTree.init($('#copyIntoOutProcessTree'), settings, allNodes);
        !isAct && copyIntoOutTreeObj.hideNode(copyIntoOutTreeObj.getNodesByParam('id', id, null)[0]);
        table.render({
            elem: '#copyIntoOutTable',
            id: 'copyIntoOutTable',
            height: 497,
            cols: [[
                // { type: 'checkbox', align: 'center' },
                // { type: 'numbers', align: 'center' }
            ]],
            data: []
        });
        if (isCopyOut) {
            table.reload('copyIntoOutTable', { cols: tableSthObj.cols, data: tableSthObj.tableData });
        }
        layui.form.on('submit(formCopyProcess)', function(data) {
            const checkedData = table.checkStatus('copyIntoOutTable').data;
            if (checkedData.length < 1) {
                fnTip('请选择' + (isCopyOut ? '拷出' : '拷入') + type);
                return false;
            }
            const commitParams = getApiPojo();
            commitParams.isClear = data.field.isClear === 'on';
            const toIds = [];
            if (isCopyOut) {
                const treeObj = $.fn.zTree.getZTreeObj('copyIntoOutProcessTree');
                const checkedTreeNodes = $.fn.zTree.getZTreeObj('copyIntoOutProcessTree').getCheckedNodes(true);
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
            } else {
                isAct ? toIds.push($('#activityId').val()) : toIds.push($('#processId').val());
            }
            if (toIds.length < 1) {
                fnTip('请选择流程模版' + (isAct ? '活动节点' : '过程') + '对象');
                return false;
            }
            let reloadTable = null;
            switch (type) {
                case '参与者': {
                    commitParams.processIds = toIds;
                    commitParams.data = checkedData;
                    reloadTable = function () {
                        !isAct && loadProcUserAuth();
                    }
                    break;
                }
                case '应用程序': {
                    commitParams.activityIds = toIds;
                    commitParams.data = checkedData;
                    reloadTable = function () {
                        isAct && loadActApps();
                    }
                    break;
                }
                case '参数': {
                    commitParams.paramParentIds = toIds;
                    commitParams.paramParentType = isAct ? '活动' : '过程';
                    commitParams.data = checkedData;
                    reloadTable = function () {
                        isAct ? loadActParams() : loadProcParams();
                    }
                    break;
                }
                case '事件监听': {
                    commitParams.nodeIds = toIds;
                    commitParams.nodeType = isAct ? '活动' : '过程';
                    commitParams.data = checkedData;
                    reloadTable = function () {
                        isAct ? loadActListenPlugIn() : loadProcListenPlugIn();
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            postRequest(tableSthObj.commitUrl, commitParams, function (res) {
                if (res.code === 0) {
                    closeLayero();
                    if (!isCopyOut) {
                        typeof reloadTable === 'function' && reloadTable();
                    } else {
                        fnTip(type + '拷出成功', 2000);
                    }
                } else {
                    fnTip(type + (isCopyOut ? '拷出' : '拷入') + '失败', 2000);
                }
            })
            return false;
        });
    };
    fnAlertShow(tempHtml, modalObj, showCallback)
}
function getTableSth(type, isAct) {
    const baseUrl = getBaseUrl() + '/bpm/';
    let strUrl = baseUrl + (isAct ? 'activity' : 'process');
    let commitUrl = baseUrl;
    let resListType = '';
    let tableData = [];
    const table = layui.table;
    let cols = [
        { type: 'checkbox' },
        { type: 'numbers', title: '序号' }
    ];
    switch (type) {
        case '参与者': {
            strUrl += '/candidate/' + (isAct ? 'get' : 'query');
            commitUrl += 'process/candidate/clone';
            resListType = isAct ? 'candidateList' : 'processCandidates';
            tableData = table.cache['userAuthTable'];
            cols = cols.concat([
                { field: 'candidateName', align: 'center', title: '名称' },
                { field: 'candidateType', align: 'center', title: '类别' },
                { field: 'candidatePolicy', align: 'center', title: '参与方式' }
            ]);
            break;
        }
        case '应用程序': {
            strUrl += '/appliction/' + (isAct ? 'get' : 'query');
            commitUrl += 'activity/appliction/clone';
            resListType = isAct ? 'applicationList' : 'processApplications';
            tableData = table.cache[isAct ? 'actAppTable' : 'procAppTable'];
            cols = cols.concat([
                { field: 'appName', title: '名称', align: 'center' },
                { field: 'appType', title: '类型', align: 'center' },
                { field: 'appClassify', title: '分类', align: 'center' },
                { field: 'appPolicy', title: '主从关系', align: 'center' },
                { field: 'appForuse', title: '用途', align: 'center' }
            ]);
            break;
        }
        case '参数': {
            strUrl += '/parameter/' + (isAct ? 'get' : 'query');
            commitUrl += 'parameter/clone';
            resListType = isAct ? 'activityParameterList' : 'processParameters';
            tableData = table.cache['paramTable'];
            cols = cols.concat([
                { field: 'paramName', title: '名称', align: 'center' },
                { field: 'paramType', title: '类型', align: 'center' },
                { field: 'paramValue', title: '值', align: 'center' }
            ]);
            break;
        }
        case '事件监听': {
            strUrl += '/listener/' + (isAct ? 'get' : 'query');
            commitUrl += 'listenerplugin/clone';
            resListType = isAct ? 'listenerList' : 'processListeners';
            tableData = table.cache['listenPlugInTable'];
            cols = cols.concat([
                { field: 'pluginClassify', title: '事件类型', align: 'center', width: 100 },
                { field: 'eventName', title: '事件名称', align: 'center', width: 150 },
                { field: 'pluginType', title: '操作插件类型', align: 'center', width: 130 },
                { field: 'listenerPolicy', title: '监听方式', align: 'center', width: 100 },
                { field: 'className', title: '类名', align: 'center' }
            ]);
            break;
        }
        default: {
            break;
        }
    }
    return {
        strUrl: strUrl,
        commitUrl: commitUrl,
        resListType: resListType,
        tableData: tableData,
        cols: [cols]
    }
}
