layui.define(['table'], function (exports) {
    let $ = layui.jquery;
    let table = layui.table;

    let treetable = {
        // 渲染树形表格
        render: function (param) {
            if (param.tree) {
                // 检查参数
                if (!treetable.checkParam(param)) {
                    return;
                }
                // 获取数据
                if (param.data) {
                    treetable.init(param, param.data);
                } else {
                    $.getJSON(param.url, param.where, function (res) {
                        treetable.init(param, res.data);
                    });
                }
            } else {
                table.render(param);
            }
        },
        // 渲染表格
        init: function (param, data) {
            let mData = [];
            let doneCallback = param.done;
            let tNodes = data;
            let idDataObj = {};
            let pIdDataObj = {};
            // 补上id和pid字段
            for (let i = 0; i < tNodes.length; i++) {
                let tt = tNodes[i];
                if (!tt.id) {
                    if (!param.treeIdName) {
                        fnAlert('参数treeIdName不能为空！', '', false);
                        return;
                    }
                    tt.id = tt[param.treeIdName];
                }
                if (!tt.pid) {
                    if (!param.treePidName) {
                        fnAlert('参数treePidName不能为空', '', false);
                        return;
                    }
                    tt.pid = tt[param.treePidName];
                }
                idDataObj[tt.id] = tt;
                if (!pIdDataObj[tt.pid]) {
                    pIdDataObj[tt.pid] = [];
                }
                pIdDataObj[tt.pid].push(tt);
            }

            // 对数据进行排序
            // let sort = function (s_pid, data) {
            //     for (let i = 0; i < data.length; i++) {
            //         if (data[i].pid == s_pid) {
            //             let len = mData.length;
            //             if (len > 0 && mData[len - 1].id == s_pid) {
            //                 mData[len - 1].isParent = true;
            //             }
            //             mData.push(data[i]);
            //             sort(data[i].id, data);
            //         }
            //     }
            // };
            // sort(param.treeSpid, tNodes);

            let sort = function (data) {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let rootPId = findRootPId(item);
                    loadChildrenNode(rootPId, mData);
                }
            }

            let findRootPId = function (node) {
                let pid = node.pid;
                if (!!idDataObj[node.pid]) {
                    pid = findRootPId(idDataObj[node.pid]);
                }
                return pid;
            }

            let loadChildrenNode = function (pId, node) {
                if (!!pIdDataObj[pId]) {
                    let childrenNodeArr = pIdDataObj[pId];
                    if (childrenNodeArr.length > 0) {
                        if (node.length > 0 && node[node.length - 1].id === pId) {
                            node[node.length - 1].isParent = true;
                        }
                        for (let i = 0; i < childrenNodeArr.length; i++) {
                            node.push(childrenNodeArr[i]);
                            loadChildrenNode(childrenNodeArr[i].id, node);
                        }
                        delete pIdDataObj[pId];
                    }
                }
            };

            sort(tNodes);

            // 重写参数
            param.url = undefined;
            param.data = mData;
            if (param.page) {
                param.page = { count: param.data.length, limit: param.data.length};
            } else {
                // param.page = { count: param.data.length, limit: param.data.length, hidePage: true };
                param.limit = param.data.length;

            }
            param.cols[0][param.treeColIndex].templet = function (d) {
                let mId = d.id;
                let mPid = d.pid;
                let isDir = d.isParent;
                let emptyNum = treetable.getEmptyNum(mPid, mData);
                let iconHtml = '';
                for (let i = 0; i < emptyNum; i++) {
                    iconHtml += '<span class="treeTable-empty"></span>';
                }
                if (isDir) {
                    iconHtml += '<i class="layui-icon layui-icon-triangle-d"></i>';
                }
                let contentHtml = '<span class="treeTable-data">' + d[param.cols[0][param.treeColIndex].field] + '</span>';
                let ttype = isDir ? 'dir' : 'file';
                let vg = '<span class="treeTable-icon open" lay-tid="' + mId + '" lay-tpid="' + mPid + '" lay-ttype="' + ttype + '">';
                return vg + iconHtml + contentHtml + '</span>';
            };

            param.done = function (res, curr, count) {
                $(param.elem).next().addClass('treeTable');
                // $('.treeTable .layui-table-page').css('display', 'none');
                $('.treeTable .layui-table-page').remove();

                $(param.elem).next().attr('treeLinkage', param.treeLinkage);
                $('.treeTable-data').parent().parent().parent('td').css('text-align', 'left');
                // 绑定事件换成对body绑定
                /*$('.treeTable .treeTable-icon').click(function () {
                    treetable.toggleRows($(this), param.treeLinkage);
                });*/
                if (param.treeDefaultClose) {
                    treetable.foldAll(param.elem);
                }
                if (doneCallback) {
                    doneCallback(res, curr, count);
                }
            };

            // 渲染表格
            table.render(param);
        },
        // 计算缩进的数量
        getEmptyNum: function (pid, data) {
            let num = 0;
            if (!pid) {
                return num;
            }
            let tPid;
            for (let i = 0; i < data.length; i++) {
                if (pid == data[i].id) {
                    num += 1;
                    tPid = data[i].pid;
                    break;
                }
            }
            return num + treetable.getEmptyNum(tPid, data);
        },
        // 展开/折叠行
        toggleRows: function ($dom, linkage) {
            let type = $dom.attr('lay-ttype');
            if ('file' == type) {
                return;
            }
            let mId = $dom.attr('lay-tid');
            let isOpen = $dom.hasClass('open');
            if (isOpen) {
                $dom.removeClass('open');
            } else {
                $dom.addClass('open');
            }
            $dom.closest('tbody').find('tr').each(function (index) {
                let $ti = $(this).find('.treeTable-icon');
                let pid = $ti.attr('lay-tpid');
                let ttype = $ti.attr('lay-ttype');
                let tOpen = $ti.hasClass('open');
                if (mId === pid) {
                    let $fixedTrDom = $dom.closest('.layui-table-body').siblings('.layui-table-fixed').find('tr[data-index="' + index + '"]');
                    if (isOpen) {
                        //解决和iGrid控件点击改变单元格或行颜色样式冲突
                        // $(this).hide();
                        // $fixedTrDom.hide();
                        $(this).addClass('layui-hide');
                        $fixedTrDom.addClass('layui-hide');
                        if ('dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    } else {
                        // $(this).show();
                        // $fixedTrDom.show();
                        $(this).removeClass('layui-hide');
                        $fixedTrDom.removeClass('layui-hide');
                        if (linkage && 'dir' == ttype && tOpen == isOpen) {
                            $ti.trigger('click');
                        }
                    }
                }
            });
            //展开或折叠后，同步固定栏
            let $dataBodyDom = $dom.closest('.layui-table-body');
            let $fixBodyDom = $dataBodyDom.siblings('.layui-table-fixed').find('.layui-table-body');
            let dataBodyHeight = $dataBodyDom.height() - 14;//14为滚动条的高度
            if($fixBodyDom.children('table').height() <= dataBodyHeight) {
                $fixBodyDom.css('height','auto');
            } else{
                $fixBodyDom.height(dataBodyHeight);
            }
        },
        // 检查参数
        checkParam: function (param) {
            // if (!param.treeSpid && param.treeSpid != 0) {
            //     fnAlert('参数treeSpid不能为空', '', false);
            //     return false;
            // }

            if (!param.treeColIndex && param.treeColIndex != 0) {
                fnAlert('参数treeColIndex不能为空', '', false);
                return false;
            }
            return true;
        },
        // 展开所有
        expandAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                let $ti = $(this).find('.treeTable-icon');
                let ttype = $ti.attr('lay-ttype');
                let tOpen = $ti.hasClass('open');
                if ('dir' == ttype && !tOpen) {
                    $ti.trigger('click');
                }
            });
        },
        // 折叠所有
        foldAll: function (dom) {
            $(dom).next('.treeTable').find('.layui-table-body tbody tr').each(function () {
                let $ti = $(this).find('.treeTable-icon');
                let ttype = $ti.attr('lay-ttype');
                let tOpen = $ti.hasClass('open');
                if ('dir' == ttype && tOpen) {
                    $ti.trigger('click');
                }
            });
        }
    };

    layui.link(layui.cache.base + 'layui.treetable.css');

    // 给图标列绑定事件
    $('body').on('click', '.treeTable .treeTable-icon', function () {
        let treeLinkage = $(this).parents('.treeTable').attr('treeLinkage');
        if ('true' == treeLinkage) {
            treetable.toggleRows($(this), true);
        } else {
            treetable.toggleRows($(this), false);
        }
    });

    exports('treetable', treetable);
});
