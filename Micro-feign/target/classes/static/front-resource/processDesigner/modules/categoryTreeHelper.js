/**
 * 流程模版分类树管理js
 */

// 当前选中节点
let m_treeNode = null;

/**
 * 加载流程模版树
 * @param processId 默认选中节点，可为null
 * @returns
 */
function loadProcessCategory(processId) {
    let settings = {
        view: {
            selectedMulti: false,
            autoCancelSelected: false,
            dblClickExpand: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: ""
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
            	if (m_needSave) {
        			m_needSave = false;
        			fnConfirm("是否保存当前流程设置？",function (modelIndex, layerObj, closeNow) {
                        closeNow();
                        saveProcess();
                        categoryTreeOnClick(treeNode);
                    }, 1000, function(){
                    	categoryTreeOnClick(treeNode);
                    });
            	} else {
            		categoryTreeOnClick(treeNode);
            	}
            }
        }
    };
    let modelCatTreeData = [
      { id: 'root', name: '流程模版', pId: '' },
      { catNote: '测试使用', id: '5525fd5c-7895-497a-aa40-1521e4073623', name: '测试模版', pid: 'root', sortnum: 1, type: '分类'}
    ];
    for (let i=0;i<modelCatTreeData.length;i++){
      modelCatTreeData[i].name = XMLDecode(modelCatTreeData[i].name);
      modelCatTreeData[i].relName = modelCatTreeData[i].name;
        if (modelCatTreeData[i].pId === null || modelCatTreeData[i].pId === ""){
            modelCatTreeData[i].open = true;
            modelCatTreeData[i].iconSkin = 'icon-organization';
        }
        if (modelCatTreeData[i].type === "分类"){
            // modelCatTreeData[i].iconSkin = 'icon-template-1';
        }else if (modelCatTreeData[i].type === "模版"){
            modelCatTreeData[i].iconSkin = 'icon-process';
            modelCatTreeData[i].bSave = true;
            modelCatTreeData[i].name = modelCatTreeData[i].name; // + '(v' + modelCatTreeData[i].version + ')';
        }
    }
    let treeObj = $.fn.zTree.init($("#treeProcessCategory"), settings, modelCatTreeData);

    if (processId != null){
        let node =  treeObj.getNodeByParam("id", processId, null);
        treeObj.selectNode(node);
        showModel(node);
    }
}

function categoryTreeOnClick(treeNode) {
	m_treeNode = treeNode;
	if (treeNode.id === "root") {
		$('#right .form-box .noinfo').show();
		$('#right .form-box .edit-box').hide();
		$('#divDesigner').hide();
		$('#descriptorarea').val("");
		$("#addCategory").show();
		$("#updateCategory").hide();
		$("#deleteCategory").show();
		$("#createProcess").hide();
		$("#saveProcess").hide();
        $("#deployModel").hide();
        $("#cloneProcess").hide();
        //$("#undoModel").hide();
        //$("#redoModel").hide();
        $("#deleteProcess").hide();
        $("#openProperties").hide();
        $("#configDoc").hide();
        $('.swith-btn-right').click();

		clearModel();
	} else if (treeNode.type === "分类"){
    	$('#right .form-box .noinfo').show();
		$('#right .form-box .edit-box').hide();
		$('#divDesigner').hide();
		$('#descriptorarea').val("");
		$("#addCategory").show();
		$("#updateCategory").show();
		$("#deleteCategory").show();
		$("#createProcess").show();
		$("#saveProcess").hide();
        $("#deployModel").hide();
        $("#cloneProcess").hide();
        //$("#undoModel").hide();
        //$("#redoModel").hide();
        $("#deleteProcess").hide();
        $("#openProperties").hide();
        $("#configDoc").hide();
        $('.swith-btn-right').click();
        $('.empty-form-tip:empty').append('<div class="folderClick h-100"><button class="layui-btn geo-btn-default layui-btn-lg" data-toggle="addForm">新建表单</button></div>');
		clearModel();
    } else if (treeNode.type === "模版"){
    	$("#addCategory").hide();
    	$("#updateCategory").hide();
    	$("#deleteCategory").hide();
    	$("#createProcess").hide();
        showModel(treeNode);
    }
};

/**
 * 添加流程模版分类
 * @returns
 */
function addProcessCategory() {
	let bDone = false;
	// 获取选中的分类树节点
	if (m_treeNode != null) {
		if (m_treeNode.id === "root" || m_treeNode.type === "分类") {
			bDone = true;
			addOrEditProcessCategory(true, m_treeNode);
		}
	}
	if (!bDone) {
		fnAlert("请选中流程模版分类树节点创建新的分类");
	}
}

/**
 * 修改流程模版分类
 * @returns
 */
function updateProcessCategory() {
	let bDone = false;
	// 获取选中的分类树节点
	if (m_treeNode != null) {
		if (m_treeNode.id === "root" || m_treeNode.type === "分类") {
			bDone = true;
			addOrEditProcessCategory(false, m_treeNode);
		}
	}
	if (!bDone) {
		fnAlert("请选中流程模版分类树节点进行分类信息修改");
	}
}

/**
 * 删除流程模版分类
 * @returns
 */
function deleteProcessCategory() {
	let bDone = false;
	// 获取选中的分类树节点
	if (m_treeNode != null) {
		if (m_treeNode.type === "分类") {
			bDone = true;

			fnConfirm("确认删除选中流程分类及其所有子分类？",function (modelIndex, layerObj, closeNow) {
				let url = getBaseUrl() + "/bpm/process/category/delete";
			    let resquestData = getApiPojo();
			    resquestData.categoryId = m_treeNode.id;

			    postRequest(url, resquestData, function (res) {
			    	closeNow();
			        if (res.code === 0){
			            let treeObj = $.fn.zTree.getZTreeObj("treeProcessCategory");
			            treeObj.removeNode(m_treeNode);
			        }
			    	fnAlert(res.msg);
			    });
			});
		}
	}
	if (!bDone) {
		fnAlert("请选中流程模版分类树节点进行分类信息删除");
	}
}

/**
 * 添加或修改流程模版分类信息
 * @param bAdd 是否新增
 * @param treeNode 分类父节点
 */
function addOrEditProcessCategory(bAdd, treeNode) {
    let nameData = "", sortnumData = "", noteData = "", titleObj = "添加";

    if (!bAdd){
        nameData = treeNode.name;
        sortnumData = treeNode.sortnum;
        noteData = treeNode.catNote;
        titleObj = "修改";
    }

    let obj = [{
        "id": "categoryName",
        "name": "分类名称",
        "type": "text",
        "maxLength": 64,
        "data": nameData,
        "required": true
    },{
        "id": "categorySortnum",
        "name": "排序序号",
        "type": "text",
        "dataType": "int",
        "data": sortnumData,
        "required": true
    },{
        "id": "categoryNote",
        "name": "描述",
        "type": "textarea",
        "maxLength": 512,
        "data": noteData
    }];

    let BCallback = function (modelIndex, layerObj, closeNow) {
        let treeObj = $.fn.zTree.getZTreeObj("treeProcessCategory");
        let strUrl;
        let catObj = translateFormToObject(modelIndex);
        catObj.categoryType = "分类";
        if (bAdd){
            strUrl = getBaseUrl() + "/bpm/process/category/add";
            catObj.categoryParentId = treeNode.id;
        }else {
            strUrl = getBaseUrl() + "/bpm/process/category/update";
            catObj.categoryId = treeNode.id;
        }
        let resquestData = getApiPojo();
        resquestData.data = catObj;

        postRequest(strUrl, resquestData, function (res) {
            closeNow();
            if (res.code === 0){
                let resNode = res.resData.process;
                if (bAdd){
                    let newNode = {
                        id: resNode.catId,
                        pid: treeNode.id,
                        name: resNode.catName,
                        type: '分类',
                        sortnum: resNode.catSortnum,
                        catNote: resNode.catNote
                        //iconSkin: 'icon-template-1'
                    };
                    treeObj.addNodes(treeNode,newNode);
                }else{
                    treeNode.name = resNode.catName;
                    treeNode.sortnum = resNode.catSortnum;
                    treeNode.catNote = resNode.catNote;
                    treeObj.updateNode(treeNode);
                    //树节点重新排序
                    treeNodeSortnum(treeObj, treeNode);
                }
                fnTip(res.msg, 1500);
            }else{
                fnAlert(res.msg, 2, false);
            }
        } , null, true);
    };
    fnFormDialog(titleObj + '流程模版分类信息', obj, null, BCallback);
}

/**
 * 树节点排序
 * @param treeObj 树对象
 * @param treeNode 当前节点
 * @returns
 */
function treeNodeSortnum(treeObj, treeNode) {
	let preNode = treeNode.getPreNode();
    if (preNode !== null && preNode.type === treeNode.type) {
    	let iPreSortnum = parseInt(preNode.sortnum, 10);
    	let iCurrSortnum = parseInt(treeNode.sortnum, 10);
    	if (iPreSortnum > iCurrSortnum) {
    		treeObj.moveNode(preNode, treeNode, "prev");
    		treeNodeMoveUp(treeObj, treeNode);
    	} else {
    		treeNodeMoveDown(treeObj, treeNode);
    	}
    } else {
    	treeNodeMoveDown(treeObj, treeNode);
    }
}

/**
 * 树节点上移
 * @param treeObj 树对象
 * @param treeNode 当前节点
 * @returns
 */
function treeNodeMoveUp(treeObj, treeNode) {
	let preNode = treeNode.getPreNode();
    if (preNode !== null && preNode.type === treeNode.type) {
    	let iPreSortnum = parseInt(preNode.sortnum, 10);
    	let iCurrSortnum = parseInt(treeNode.sortnum, 10);
    	if (iPreSortnum > iCurrSortnum) {
    		treeObj.moveNode(preNode, treeNode, "prev");
    		treeNodeMoveUp(treeObj, treeNode);
    	}
    }
}

/**
 * 树节点下移
 * @param treeObj 树对象
 * @param treeNode 当前节点
 * @returns
 */
function treeNodeMoveDown(treeObj, treeNode) {
	let nextNode = treeNode.getNextNode();
    if (nextNode !== null && nextNode.type === treeNode.type) {
    	let iNextSortnum = parseInt(nextNode.sortnum, 10);
    	let iCurrSortnum = parseInt(treeNode.sortnum, 10);
    	if (iNextSortnum < iCurrSortnum) {
    		treeObj.moveNode(nextNode, treeNode, "next");
    		treeNodeMoveDown(treeObj, treeNode);
    	}
    }
}
