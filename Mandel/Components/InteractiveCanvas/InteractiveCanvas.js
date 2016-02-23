function InteractiveCanvas(oContainer) {
  var oThis = this;

  var oCanvas = oThis.__oCanvas = createNode({
      name: 'canvas', 
      styles: {position: 'relative', width: '100%', height: '100%'}, 
      attributes: { width: oThis.width, height: oThis.height},
  }, oContainer);
  function applySize() {
    oThis.width = oCanvas.width = oContainer.clientWidth;
    oThis.height = oCanvas.height = oContainer.clientHeight;
    oThis.nAspectRatio = oThis.width / oThis.height;
  }
  applySize();

  addTargetEventListener(oContainer, 'resize', function (oEvent) {
    applySize();
    oThis.fireEvent('resize', {width: oThis.width, height: oThis.height});
  });
  function getEventDetails(oEvent) {
    var iX = oEvent.pageX, iY = oEvent.pageY;
    var oElement = oCanvas;
    do {
      iX -= oElement.offsetLeft;
      iY -= oElement.offsetTop;
    } while (oElement = oElement.offsetParent);
    return {nX: iX == 0 ? 0 : iX / (oThis.width - 1), 
            nY: iY == 0 ? 0 : iY / (oThis.height - 1), 
            iWheelDelta: oEvent.wheelDelta, 
            bAlt: oEvent.altKey, bCtrl: oEvent.ctrlKey, bShift: oEvent.shiftKey};
  }
  addTargetEventListener(oCanvas, 'click', function (oEvent) {
    oEvent.stopPropagation();
    oEvent.preventDefault();
    oThis.fireEvent('click', getEventDetails(oEvent));
  });
  addTargetEventListener(oCanvas, 'mousewheel', function handleMouseWheelEvent(oEvent) {
    oEvent.stopPropagation();
    oEvent.preventDefault();
    oThis.fireEvent('mousewheel', getEventDetails(oEvent));
  });
  addTargetEventListener(oCanvas, 'DOMMouseScroll', function (oEvent) { // Firefox specific
    oEvent.wheelDelta = -oEvent.detail;
    oEvent.stopPropagation();
    oEvent.preventDefault();
    oThis.fireEvent('mousewheel', getEventDetails(oEvent));
  });

  addEvents(oThis, ['resize', 'click', 'mousewheel']);
}

addEventsCode(InteractiveCanvas);

InteractiveCanvas.prototype.getContext2d = function() {
  var oThis = this;
  return oThis.__oCanvas.getContext('2d');
}