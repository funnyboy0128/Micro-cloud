/** 通用的工具方法------------------------------------------------------------------- */
/** 扩展对象原生属性                                                                          */
/**
 * 数组扩展方法
 * contains  remove
 */
Array.prototype.contains = function (val) {
    let flag = false;
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) flag = true;
    }
    return flag;
};

Array.prototype.findByName = function (name) {
    let res = null;
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (item.name === name) {
            item.cindex = i;
            res = item;
            break;
        }
    }
    return res;
};

Array.prototype.findById = function (id) {
    let res = null;
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (item.id === id) {
            item.cindex = i;
            res = item;
            break;
        }
    }
    return res;
};

Array.prototype.findByParentId = function (id) {
    const res = [];
    this.forEach(function (item, index) {
        if (item.parentId === id) {
            res.push(item);
        }
    });
    return res;
};

Array.prototype.findByPId = function (id) {
    const res = [];
    this.forEach(function (item, index) {
        if (item.pId === id) {
            res.push(item);
        }
    });
    return res;
};

Array.prototype.findByCtrlId = function (id) {
    const res = [];
    this.forEach(function (item, index) {
        if (item.ctrlId === id) {
            res.push(item);
        }
    });
    return res;
};

Array.prototype.findByPolicyType = function (id) {
    const res = [];
    this.forEach(function (item, index) {
        if (item.policyType === id) {
            res.push(item);
        }
    });
    return res;
};

Array.prototype.indexOf = function (val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};

Array.prototype.indexOfName = function (name) {
    let res = false;
    for (let i = 0; i < this.length; i++) {
        if (name.indexOf(this[i]) > -1) {
            res = true;
            break;
        }
    }
    return res;
};

Array.prototype.remove = function (val) {
    const index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/**
 * 字符格式化
 *  let template1 = "我是{0}，今年{1}了";
 *  let template2 = "我是{name}，今年{age}了";
 *  let result1 = template1.format("loogn", 22);
 *  let result2 = template1.format({ name: "loogn", age: 22 });
 */
String.prototype.format = function (args) {
    if (arguments.length > 0) {
        let result = this;
        if (arguments.length === 1 && typeof (args) === 'object') {
            for (const key in args) {
                const reg = new RegExp('({' + key + '})', 'g');
                result = result.replace(reg, args[key]);
            }
        } else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] === undefined) {
                    return '';
                } else {
                    const reg = new RegExp('({[' + i + ']})', 'g');
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    } else {
        return this;
    }
};

/**
 * 比较对象指定属性值
 * 用于根据指定属性对对象数组排序（默认升序）
 * @param {*} property 对象属性名
 * @param {Boolean} isDesc 降序
 */
function compareObj(property, isDesc) {
    return function (obj1, obj2) {
        const value1 = obj1[property];
        const value2 = obj2[property];
        if (isDesc) {
            return value2 - value1; // 降序
        } else {
            return value1 - value2; // 升序
        }
    };
}

/**
 * 对象复制其他对象值
 * @param {Object} objA 需要被插入属性的对象
 * @param {Object} objB 需要插入属性的对象
 * @param {Boolean} isAdd 是否覆盖将objB的属性值直接覆盖objA的属性值
 */
function pushObj(objA, objB, isAdd) {
    if (typeof objA === 'object' && typeof objB === 'object') {
        if (isAdd === undefined) {
            isAdd = false;
        }
        for (const item in objB) {
            if (isAdd) {
                if (objA[item] === undefined) {
                    objA[item] = objB[item];
                }
            } else {
                objA[item] = objB[item];
            }
        }
    }
    return objA;
}

/**
 * 将当前对象的属性修改为另外一个对象的属性值
 * @param {Object} objA 需要修改属性的对象
 * @param {Object} objB 用于修改属性的对象
 */
function changeObj(objA, objB) {
    if (typeof objA === 'object' && typeof objB === 'object') {
        for (const item in objA) {
            objA[item] = objB[item];
        }
    }
    return objA;
}
/**
 * js格式化
 */
function jsFormat() {
    let r = editor.getValue();
    r = r.replace(/^\s+/, '');
    if (r && r.charAt(0) === '<') {
        r = style_html(r, 4, ' ', 80);
    } else {
        r = js_beautify(r, 4, ' ');
    }
    if (editor) {
        editor.setValue(r);
    }
}

/**
 * 生成唯一ID
 * @param {String} name 需要加载随机生成的字符串前面，非必传
 */
function guidGenerator(name) {
    if (name === undefined) {
        name = '';
    }
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    const now = new Date();
    const nowStr = formatDate(now, 1);
    const newCreateStr = name + nowStr + S4() + S4();
    return newCreateStr.toUpperCase();
}

/**
 * 判断浏览器的类型
 * @returns 具体浏览器版本
 */
function getBrowserInfo() {
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    const isOpera = userAgent.indexOf('Opera') > -1;

    const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
    const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;

    if (isOpera) {
        return 'Opera';
    }
    // 判断是否Opera浏览器
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF';
    } // 判断是否Firefox浏览器
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari';
    } // 判断是否Safari浏览器
    if (!isOpera && /(msie\s|trident.*rv:)([\w.]+)/.exec(userAgent)) {
        return 'IE';
    } // 判断是否IE浏览器

    if (!isOpera && (isIE || isEdge || isIE11)) {
        return 'IE';
    } // 判断是否IE浏览器
    const mobileAgents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod'
    ];
    for (let v = 0; v < mobileAgents.length; v++) {
        if (userAgent.indexOf(mobileAgents[v]) > 0) {
            return mobileAgents[v];
        }
    }
}

/**
 * 判断当前是否支持localStorage
 */
function supportStorage() {
    let res = false;
    if (typeof window.localStorage === 'object') {
        res = true;
    }
    return res;
}

/**
 * 检测浏览器是否支持CORS
 */
function checkBrowserCORS() {
    let res = false;
    // Detect browser support for CORS
    if ('withCredentials' in new XMLHttpRequest()) {
        /* supports cross-domain requests */
        console.log('CORS supported (XHR)');
        res = true;
    } else {
        if (typeof XDomainRequest !== 'undefined') {
            // Use IE-specific "CORS" code with XDR
            console.log('CORS supported (XDR)');
            res = true;
        } else {
            // Time to retreat with a fallback or polyfill
            console.log('No CORS Support!');
        }
    }
}
/**
 * 将url后面的对象转为参数
 * eg. {a:1,b:2}
 * 我返回的是?a=1&b=2
 * @param {Boolean} isStart 是否需要起始的问号
 * @returns Object
 */
function translateJsonToParams(obj, isStart) {
    let res = '';
    const _params = obj;
    if (_params === null && !_params && typeof _params !== 'object') {
        return res;
    }
    if (isStart === undefined) {
        isStart = true;
    }
    const temp = $.extend({}, _params);
    const symbol = '=';
    const lastSymbol = '&';
    if (isStart) {
        res = '?';
    } else {
        res = '&';
    }

    for (const key in temp) {
        if (temp[key] !== undefined && temp[key] !== null) {
            res += key + symbol + encodeURIComponent(temp[key]) + lastSymbol;
        }
    }
    res = res.substring(0, res.length - 1); // 去掉最后一个多余的lastSymbol
    return res;
}

/**
 * 将url后面的参数转为对象
 * eg. 地址是192.168.37.152/index.html?a=1&b=2
 * 我返回的是{a:1,b:2}
 * @returns Object
 */
function translateParamsToJson() {
    const _url = decodeURI(location.href);
    const paramsString = _url.substring(_url.indexOf('?') + 1, _url.length).split('&');
    const paramsObj = {};
    for (let i = 0, len = paramsString.length; i < len; i++) {
        const nameValue = paramsString[i];
        const equalIndex = nameValue.indexOf('=');
        const paramStringLength = nameValue.length;
        const _name = nameValue.substring(0, equalIndex);
        let _value = nameValue.substring(equalIndex + 1, paramStringLength);
        if (_value.indexOf('#') > -1) {
            _value = _value.split('#')[0];
        }
        paramsObj[_name] = decodeURIComponent(_value);
    }
    return paramsObj;
}

/**
 * 阻止默认事件
 * @param {Event} event
 */
function cancelFlow(event) {
    // 阻止默认事件
    // 兼容FF和IE和Opera
    const Event = event || window.event;
    if (Event) {
        if (Event.preventDefault) {
            // 因此它支持W3C的stopPropagation()方法
            Event.preventDefault();
            Event.stopPropagation();
        } else {
            // 否则，我们需要使用IE的方式来取消事件冒泡
            Event.returnValue = false;
            Event.cancelBubble = true;

            return false;
        }
    } else {
        return false;
    }
}

/**
 * 将对象的属性值绑定到对应的输入框上
 * @param {Object} obj 需要进行值绑定的对象
 * 形如{
 *      "roleId": "roleId1",
 *       "roleName": "roleName1",
 *      "roleFullname": "roleFullname1",
 *      "roleType": "roleType1",
 *       "roleCreatetime": "roleCreatetime1",
 *       "roleSortnum": "roleSortnum1",
 *       "roleNote": "roleNote1",
 *       "rolePopedom": "rolePopedom1"
 *   }
 * 需要对象属性的键名和控件的id是一致的，通过控件id给控件绑值
 * 执行过程类似 $("#roleId").val("roleId1")
 * @param {Boolean} needDefault 是否需要添加default-value属性，非必传
 * @returns 没有返回值
 */
function bindObjectToInput(obj, needDefault) {
    for (const key in obj) {
        $('#' + key).val(obj[key]).trigger('change');
        if (needDefault !== undefined && Boolean(needDefault)) {
            $('#' + key).attr('default-value', obj[key]);
        }
    }
    const form = layui.form;
    form.val('dialogForm', obj);
}

/**
 * 分割原始参数数组，只保留用户输入的value值的方法
 * @param {Array} obj  包含所有参数的param数组，必选
 *           格式举例[{text:'melon',data:'melon'},{text:'water',data:'water'}]
 * @param {String} param 需要进行返回的属性值
 *  *            举例设置为data，则每个子数组至少包含一个data属性值
 * @param {Boolean} isString 返回的是对象，还是通过英文逗号拼接的字符串
 * @param {Function} checkData 需要对当前数组值进行相关判断，判断为真才进行数据插入
 * @return {Array,String} res 只保存了规定属性值的数组，或者通过英文逗号拼接的String
 */
function splitArguData(obj, param, isString, checkData) {
    let res = [];
    if (isArr(obj) && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i][param]) {
                if (typeof checkData === 'function') {
                    if (checkData(obj[i])) {
                        res.push(obj[i][param]);
                    }
                } else {
                    res.push(obj[i][param]);
                }
            }
        }
        if (isString) {
            res = res.toString();
        }
    } else {
        res = 'Parameter pass error,it is not an array object!';
    }
    return res;
}

/**
 * 分割原始参数数组，只保留用户输入的多个属性值的方法
 * @param {Array} obj  包含所有参数的param数组，必选
 *           格式举例[{text:'melon',data:'melon'},{text:'water',data:'water'}]
 * @param {Array} params 需要进行返回的属性值数组
 *  *            举例设置为['data','attr']，则每个子数组至少包含一个data属性值和一个attr属性值
 * @param {Function} checkData 需要对当前数组值进行相关判断，判断为真才进行数据插入
 * @return {Array} res 只保存了规定属性值的数组，或者通过英文逗号拼接的String
 */
function splitArguBigData(obj, params, checkData) {
    let res = '';
    if (isArr(obj) && obj.length > 0 && isArr(params) && params.length > 0) {
        if (params.length === 2) {
            res = {};
        } else {
            res = [];
        }
        for (let i = 0; i < obj.length; i++) {
            if (params.length === 2) {
                if (typeof checkData === 'function') {
                    if (checkData(obj[i])) {
                        res[obj[i][params[0]]] = obj[i][params[1]];
                    }
                } else {
                    res[obj[i][params[0]]] = obj[i][params[1]];
                }
            } else {
                let currParams = {};
                params.forEach(function (item) {
                    currParams[item] = item;
                });
                if (typeof checkData === 'function') {
                    if (checkData(obj[i])) {
                        currParams = changeObj(currParams, obj[i]);
                        res.push(currParams);
                    }
                } else {
                    currParams = changeObj(currParams, obj[i]);
                    res.push(currParams);
                }
            }
        }
    } else {
        res = 'Parameter pass error,it is not an array object!';
    }
    return res;
}

/**
 * 时间格式化方法
 * @param {Date} iDate，需要进行转换的日期
 * @param {Number} type 格式，一共有两种情况，。
 *                      一种是0，将原始的日期转成yyyy-MM-dd hh:mm:ss格式，默认的格式。
 *                      一种是1，是将原始的日期转换成yyyyMMddhhmmss格式
 *                      一种是2，将原始的时间戳转换成yyyy-MM-dd
 */
function formatDate(iDate, type) {
    if (typeof iDate === 'number') {
        iDate = new Date(iDate);
    }
    // toLocaleString在IE下有问题，会多出未知占位符
    /* iDate = iDate.toLocaleString("zh-CN", {
        hour12: false
    }); //将默认的日期按照当地的日期格式进行转移，这边转化的效果是yyyy/M/d h:m:s
    iDate = iDate.replace(/\b\d\b/g, '0$&'); //将yyyy/M/d h:m:s中的月份，日期，时间只有一位的，用0进行补位，比如将2018/5/14 转换成2018/05/14 */
    switch (type) {
        case 0:
        {
            // iDate = iDate.replace(new RegExp('/', 'gm'), '-'); //将日期转换成yyyy-MM-dd hh:mm:ss
            iDate = iDate.dateFormat('yyyy-MM-dd HH:mm:ss');
            break;
        }
        case 1:
        {
            // iDate = iDate.replace(/\/|\:|\s/g, ''); //将日期转换成yyyyMMddhhmmss
            iDate = iDate.dateFormat('yyyyMMddHHmmss');
            break;
        }
        case 2:
        {
            // iDate = iDate.replace(new RegExp('/', 'gm'), '-').substr(0, 10); //将日期转换成yyyy-MM-dd
            iDate = iDate.dateFormat('yyyy-MM-dd');
            break;
        }
    }
    return iDate;
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).dateFormat("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).dateFormat("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).dateFormat("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).dateFormat("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).dateFormat("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.dateFormat = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
        'H+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    };
    const week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (String(this.getFullYear())).substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[String(this.getDay())]);
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr((String(o[k])).length)));
        }
    }
    return fmt;
};

/**
 * 获取某个日期时间n天前/后的时间
 * @param {Date} iDate，需要进行转换的某个日期
 * @param {Number} n,天数:正数为n天后，负数为n天前
 */
function getNDaysBeforeEndDate(iDate, n) {
    const timestamp = new Date(iDate).getTime();
    // 获取n天前/后的日期
    const newDate = new Date(timestamp + n * 24 * 3600 * 1000);
    return newDate;
}
/**
 * 打印正常日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function log(variable) {
    console.log(variable);
}
/**
 * 打印消息日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function info(variable) {
    console.info(variable);
}
/**
 * 打印错误日志的方法
 * @param {Any} variable  需要打印的变量值，必选
 */
function err(variable) {
    console.error(variable);
}

/**
 * bootstrap table中需要写行内button，并且需要将当前行数据进行返回，
 * 提供一个公共方法，返回对应的按钮html内容
 * @param {Object} row 当前行数据，不可缺省
 * @param {Number} index 当前行索引，不可缺省
 * @param {String} id 需要新增的按钮id，不可缺省
 * @param {String} name  需要新增的按钮内容，不可缺省
 * @param {String} callBackName  需要新增的按钮对应的事件名，不可缺省
 * @param {String} className  需要新增的按钮样式，可缺省
 */
function setTableBtn(row, index, id, name, callBackName, className) {
    let res = '';
    if (!!row && !!id && !!name && !!callBackName) {
        if (typeof row === 'object') {
            let tempRow = JSON.stringify(row);
            tempRow = tempRow.replace(/\"/g, "'");
            res = '<button id="' + id + index + '" type="button" index="' + index + '" class="layui-btn layui-btn-sm ' + (className ? className : 'layui-btn-primary') + '" onclick="' + callBackName + '(' + tempRow + ')">' + name + '</button>';
        }
    }
    return res;
}

/**
 * 检测ie的具体版本
 * @returns {Number} 具体的版本号
 */
function getIEVer() {
    const userAgent = navigator.userAgent;
    const rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
    const ua = userAgent.toLowerCase();
    const match = rMsie.exec(ua);
    let res = null;
    if (match != null) {
        res = {
            browser: 'IE',
            version: match[2] || '0'
        };
    } else {
        res = {
            browser: '',
            version: '0'
        };
    }
    return res;
}
/**
 * 重置treeTable的头部宽度
 * @param {String} tableId 需要重置的treeTable body的id
 * @param {String} tableTitleId 需要重置的treeTable title的id
 */
function resetTableWidth(tableId, tableTitleId) {
    if ($('#' + tableId + ' tr').length > 0) {
        $('#' + tableTitleId + ' tr th').each(function (index) {
            const width = $('#' + tableId + ' tr').eq(0).children('td').eq(index).css('width');
            $('#' + tableTitleId + ' tr th').eq(index).css('width', width);
        });
    }
}

/**
 * 获取一个拥有title提示的html内容
 * @param {String} value 必传，需要进行拼接的value值
 * @returns {String} res 已经拼接好的html内容
 */
function getTitleHtml(value) {
    let res = '';
    if (value) {
        res = '<span>' + value + '</span>';
    }
    return res;
}
/**
 * 获取浏览器中不包含滚动条的大小
 */
function getViewSizeWithoutScrollbar() { // 不包含滚动条
    return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    };
}

/**
 * @Params {string} cookie名称
 * @Params {string} cookie值
 * @Params {Object} cookie其他参数
 * @returns {string}
 */
jQuery.cookie = function (name, value, options) {
    if (typeof value !== 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
            let date;
            if (typeof options.expires === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        const path = options.path ? '; path=' + (options.path) : '';
        const domain = options.domain ? '; domain=' + (options.domain) : '';
        const secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/**
 * 保证layui.form.render之后，禁用的可搜索下拉框不可编辑，隐藏的单选框和复选框不显示
 * @param {String} filter 需要渲染的layui-form节点的lay-filter属性值
 */
function keepRenderRight(filter) {
    let filterSelect = '';
    if (filter) {
        filterSelect = '[lay-filter="' + filter + '"] ';
    }
    $(filterSelect + 'select:disabled').siblings().find('.layui-input').prop('disabled', true);
    $(filterSelect + 'input[type="checkbox"].layui-hide, ' + filterSelect + 'input[type="radio"].layui-hide').siblings().remove();
}

/**
 * 自动渲染select2下拉框
 * @param {String} parentContainer 父容器选择器 如 [lay-filter="dialogForm"]
 * @param {String} currentId 当前下拉框id选择器
 * @param {Object} paramObj 渲染方法配置参数 如 {data:['data']}
 */
function renderSelect2(parentContainer, currentId, paramObj) {
    if (parentContainer === undefined) {
        parentContainer = '';
    }
    let isClear = true;
    if (paramObj === undefined) {
        paramObj = {};
    } else {
        if (paramObj.hasOwnProperty('isClear')) {
            isClear = paramObj.isClear;
        }
    }
    if (currentId === undefined) {
        currentId = '';
    } else {
        currentId = '#' + currentId;
    }
    const currSelector = parentContainer + ' .select2' + currentId;
    if ($(currSelector).length > 0) {
        if ($(currSelector).select2 instanceof Function) {
            if (paramObj.hasOwnProperty('data') && $(currSelector).data('select2') && isClear) {
                $(currSelector).select2('destroy').empty();
            }
            let selectOption = {
                selectOnClose: true,
                minimumResultsForSearch: Infinity
            };
            const checkEditable = $(currSelector + '[editable]').length > 0;
            const checkMultiple = $(currSelector + '[multiple]').length > 0;
            const checkSearch = $(currSelector + '[search]').length > 0;
            const editableSetting = {
                tags: true
            };
            const multipleSetting = {
                multiple: true
                // allowClear: true
            };
            const searchSetting = {
                minimumResultsForSearch: 0
            };
            selectOption = $.extend(selectOption, paramObj);
            $(currSelector).select2(selectOption);
            if (checkEditable) {
                let tempSelectOption = $.extend({}, selectOption, editableSetting);
                if (checkMultiple) {
                    tempSelectOption = $.extend(tempSelectOption, multipleSetting);
                }
                if (checkSearch) {
                    tempSelectOption = $.extend(tempSelectOption, searchSetting);
                }
                $(currSelector + '[editable]').select2(tempSelectOption);
            }
            if (checkMultiple) {
                let tempSelectOption = $.extend({}, selectOption, multipleSetting);
                if (checkSearch) {
                    tempSelectOption = $.extend(tempSelectOption, searchSetting);
                }
                if (checkSearch) {
                    tempSelectOption = $.extend(tempSelectOption, editableSetting);
                }
                $(currSelector + '[multiple]').select2(tempSelectOption);
            }
            if (checkSearch) {
                let tempSelectOption = $.extend({}, selectOption, searchSetting);
                if (checkMultiple) {
                    tempSelectOption = $.extend(tempSelectOption, multipleSetting);
                }
                if (checkEditable) {
                    tempSelectOption = $.extend(tempSelectOption, editableSetting);
                }
                $(currSelector + '[search]').select2(tempSelectOption);
            }
        }
    }
}
// 格式化
function format(sVal) {
    if (sVal === null || String(sVal) === 'null' || typeof (sVal) === 'undefined') {
        return '';
    } else {
        return String(sVal);
    }
}

function setCookie(name, value, options) {
    if (typeof value !== 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        let expires = '';
        if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
            let date;
            if (typeof options.expires === 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        const path = options.path ? '; path=' + (options.path) : '';
        const domain = options.domain ? '; domain=' + (options.domain) : '';
        const secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    }
}

/**
 * @Params {string} cookie名称
 * @Params {string} cookie值
 * @Params {Object} cookie其他参数
 * @returns {string}
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * 存储数值
 * @param {String} name  该存储的标识名，请注意唯一性
 * @param {String,JSON} value  该存储的具体值
 * @param {Boolean} type  该存储具体值的类型，设置为true则是说明具体值是非字符串格式，反正则不是
 * @returns 无返回值
 *
 */
function setItem(name, value, type) {
    if (supportStorage()) {
        if (type) {
            value = JSON.stringify(value);
        }
        window.localStorage.setItem(name, value);
    }
}

/**
 * 获取数值
 * @param {String} name  该存储的标识名，请注意唯一性
 * @param {Boolean} type  该存储具体值的类型，设置为true则是说明具体值是非字符串格式，反正则不是
 * @returns 无返回值
 *
 */
function getItem(name, type) {
    let value = '';
    if (supportStorage()) {
        value = window.localStorage.getItem(name);
        if (type && value !== null && value !== '') {
            value = JSON.parse(value);
        }
    }
    return value;
}

/**
 * 移除数值
 * @param {String} name  该存储的标识名，请注意唯一性
 * @returns 无返回值
 */
function removeItem(name) {
    if (supportStorage()) {
        window.localStorage.removeItem(name);
    }
}

/**
 * 对于存储在本地存储中的数据做一定检测保证取到的数据格式正确性
 * @param {String} key 存储的键名
 * @param {String} type 需要加载的数据类型
 */
function getCheckStorageData(key, type) {
    const ISRIGHT = false;
    const defaultTypeArr = ['string', 'array', 'object'];
    let res = null;
    switch (type) {
        case defaultTypeArr[0]:
        {
            res = getItem(key, ISRIGHT);
            break;
        }
        case defaultTypeArr[1]:
        {
            res = getItem(key, !ISRIGHT);
            if (!isArr(res) || res.length === 0) {
                res = [];
            }
            break;
        }
        case defaultTypeArr[2]:
        {
            res = getItem(key, !ISRIGHT);
            if (!res || $.isEmptyObject(res)) {
                res = {};
            }
            break;
        }
    }
    return res;
}

/**
 * 存储格式化的数组值
 * @param {Array} init 需要进行存储的数组数值
 *          举例  [{name: 'isLogin', value: 'true', type: false}]
 *          @key {String} name  该存储的标识名，请注意唯一性
 *          @key {String,JSON} value  该存储的具体值
 *          @key {Boolean} type  该存储具体值的类型，设置为true则是说明具体值是非字符串格式，反正则不是
 * @returns 无返回值
 */
function initData(init) {
    for (let i = 0; i < init.length; i++) {
        if (getItem(init[i].name) === null) {
            setItem(init[i].name, init[i].value, init[i].type);
        }
    }
}

/**
 * 用户认证信息
 * @returns {Object} getApiPojo 默认的请求中的认证信息
 */
function getApiPojo() {
    const apiPojo = {
        'gsver': 'ios1.0',
        'authck': window.localStorage.getItem('authck') || '',
        'lguser': window.localStorage.getItem('userId') || '',
        'method': 'frame',
        'cookie': window.localStorage.getItem('cookie') || $.cookie('cookie')
    };
    return apiPojo;
}

/**
 * 文件大小显示
 * @param {*} value
 */
function renderSize(value) {
    if (value === null || value === '') {
        return '0 Bytes';
    }
    const unitArr = new Array('Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
    let index = 0;
    const srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2); // 保留的小数位数
    return size + unitArr[index];
}
/**
 * 附件下载
 * @param {*} docBinid 附件绑定的id
 * @param {*} docName 附件名（无后缀）
 * @param {*} docExtname 附件后缀
 * @param {*} name 附件全名
 */
function downLoadAttach(docBinid, docName, docExtname, name) {
    const xhr = new XMLHttpRequest();
    let fileName = ''; // 文件名称
    if (name) {
        fileName = name;
    } else {
        fileName = docName + docExtname;
    }
    xhr.open('POST', getBaseUrl() + '/doc/attachment/download?binid=' +
        docBinid + translateJsonToParams(getApiPojo(), false), true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (this.status === 200) {
            const type = xhr.getResponseHeader('Content-Type');
            const blob = new Blob([this.response], {
                type: type
            });
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                const URL = window.URL || window.webkitURL;
                const objectUrl = URL.createObjectURL(blob);
                if (fileName) {
                    const a = document.createElement('a');
                    if (typeof a.download === 'undefined') {
                        window.location = objectUrl;
                    } else {
                        a.href = objectUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                } else {
                    window.location = objectUrl;
                }
            }
        }
    };
    xhr.send();
}

/**
 * 判断在最后一页全选勾选了并删除 界面刷新前(若pageNo>1 则页码需要减1;)
 */
function checkIsFinalPageAllDelete() {
    const isLastPage = $('.layui-laypage .layui-laypage-next').hasClass('layui-disabled');
    if (isLastPage) {
        const allChoose = $('input[lay-filter="layTableAllChoose"]').next();
        if (allChoose && allChoose.length > 0 && allChoose[0]) {
            return $(allChoose[0]).hasClass('layui-form-checked');
        }
    }
    return false;
}
/**
 * 数精度
 * @param {*} num 
 * @param {*} precision 
 */
function numberPrecision(num, precision) {
    // precision: 一般选12就能解决掉大部分0001和0009问题，而且大部分情况下也够用了，如果你需要更精确可以调高
    return +parseFloat(num.toPrecision(precision || 12));
}
