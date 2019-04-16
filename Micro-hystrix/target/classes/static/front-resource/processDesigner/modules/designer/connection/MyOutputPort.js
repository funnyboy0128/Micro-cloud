draw2d.MyOutputPort = function(_4aff) {
	draw2d.OutputPort.call(this, _4aff);
};
draw2d.MyOutputPort.prototype = new draw2d.OutputPort();
draw2d.MyOutputPort.prototype.type = "MyOutputPort";
draw2d.MyOutputPort.prototype.setWorkflow = function(workflow) {
	draw2d.OutputPort.prototype.setWorkflow.call(this, workflow);
};
draw2d.MyOutputPort.prototype.onDrop = function(port) {
	if (this.getMaxFanOut() <= this.getFanOut()) {
		return;
	}
	
	/*if (this.parentNode.id == port.parentNode.id) {
		return; // 当前节点自循环连线
	}*/
	
	// 新建连线检测连线是否重复（已有连线拖动后暂未找到方法检测）
	let lines = workflow.getLines();
	for (var i = 0; i < lines.getSize(); i++) {
		var tmpLine = lines.get(i);
		var tmpSource = tmpLine.getSource().getParent();
		var tmpTarget = tmpLine.getTarget().getParent();
		if (tmpSource.id == this.parentNode.id && tmpTarget.id == port.parentNode.id) {
			// 当前连线重复
			fnTip("当前节点间已经存在连线，请勿重复添加!", 2000);
			return;
		}
	}
	
	var _4b01 = new draw2d.CommandConnect(this.parentNode.workflow, this,
			port);
	var connection = new draw2d.DecoratedConnection();
	var id = "flow" + Sequence.create();
	connection.id = id;
	connection.lineId = id;
	// connection.lineName=id;
	// connection.setLabel(id);
	// connection.setId(id);
	_4b01.setConnection(connection);
	this.parentNode.workflow.getCommandStack().execute(_4b01);
};