// requires CombinedEvents.js, CSS.js, Events.js, Nodes.js, RGBA.js, UIBox.js
function UISlider(oContainer, sWidth, sHeight, sButtonWidth) {
  var oThis = this;
  if (sWidth === undefined) sWidth = '100%';
  if (sHeight === undefined) sHeight = '100%';
  oThis.__oBackgroundUIBox = new UIBox(oContainer, sWidth, sHeight);
  oThis.oOuterElement = 
  oThis.oBackgroundOuterElement = oThis.__oBackgroundUIBox.oOuterElement;
  oThis.oBackgroundInnerElement = oThis.__oBackgroundUIBox.oInnerElement;
  oThis.__oHr = createNode({
    name: 'div', 
    attributes: {name: 'UISlider::oHr'},
    styles: { position: 'absolute', margin: 0, borderStyle: 'solid' },
  }, oThis.oBackgroundInnerElement);
  oThis.__oButtonUIBox = new UIBox(oThis.oBackgroundInnerElement, sButtonWidth, '100%');
  oThis.oButtonOuterElement = oThis.__oButtonUIBox.oOuterElement;
  oThis.oButtonInnerElement = 
  oThis.oInnerElement = oThis.__oButtonUIBox.oInnerElement;
  oThis.oButtonOuterElement.style.position = 'relative';
  oThis.__oButtonUIBox.setBorderStyle('outset', false);
  oThis.__oButtonUIBox.setBorderRadius(Math.max(0, oThis.__oBackgroundUIBox.getBorderRadiusPixelValue() - 1) + 'px', false);
  oThis.__oButtonUIBox.setBackgroundColor(oThis.__oButtonUIBox.getBorderColor(), false);
  oThis.__nValue = 0;
  oThis.__bManual = true;
  addEvents(oThis, [
      'changeValue', 
      'changeButtonBorderColor', 'changeButtonBackgroundColor', 
      'changeButtonBorderStyle', 'changeButtonBorderWidth', 'changeButtonBorderRadius', 
      'changeBackgroundBorderColor', 'changeBackgroundBackgroundColor', 
      'changeBackgroundBorderStyle', 'changeBackgroundBorderWidth', 'changeBackgroundBorderRadius']);
  function addMouseMoveEventListeners(iX0) {
    function getButtonRange() {
      var oInnerBoxSize = oThis.__oBackgroundUIBox.getInnerSize(),
          nBorderWidth = oThis.__oButtonUIBox.getBorderWidthPixelValue(),
          nBorderRadius = oThis.__oButtonUIBox.getBorderRadiusPixelValue(),
          nMinSize = Math.max(1, nBorderWidth * 2, nBorderRadius * 2),
          oButtonSize = oThis.__oButtonUIBox.getOuterSize(),
          nButtonRangeX = oInnerBoxSize.nWidth - oButtonSize.nWidth;
      return nButtonRangeX;
    }
    var nButtonRangeX = getButtonRange(),
        nButtonInnerX = nButtonRangeX * oThis.__nValue,
        nButtonOuterX = oThis.__oBackgroundUIBox.getBorderWidthPixelValue() + nButtonInnerX;
    iX0 -= nButtonOuterX;
    function mouseMoveHandler(oEvent) {
      oEvent.preventDefault();
      oEvent.stopPropagation();
//      console.log('mouse move');
      var nButtonRangeX = getButtonRange();
      var nValue = Math.max(0, Math.min(1, (oEvent.pageX - iX0) / nButtonRangeX));
      oThis.setValue(nValue);
      return false;
    }
    function mouseUpHandler(oEvent) {
      window.removeEventListener('mousemove', mouseMoveHandler, false);
      window.removeEventListener('mouseup', mouseUpHandler, false);
      oEvent.preventDefault();
      oEvent.stopPropagation();
//      console.log('mouse up');
      var nButtonRangeX = getButtonRange();
      var nValue = Math.max(0, Math.min(1, (oEvent.pageX - iX0) / nButtonRangeX));
      oThis.setValue(nValue);
      return false;
    }
    window.addEventListener('mousemove', mouseMoveHandler, false);
    window.addEventListener('mouseup', mouseUpHandler, false);
  }
  addBubbleTargetEventListener(oThis.oButtonOuterElement, 'mousedown', function (oEvent) {
    if (oThis.__bManual) {
      oEvent.preventDefault();
      oEvent.stopPropagation();
//      console.log('button mouse down');
      addMouseMoveEventListeners(oEvent.pageX);
      return false;
    }
  });
  addBubbleTargetEventListener(oThis.oBackgroundOuterElement, 'mousedown', function (oEvent) {
    if (oThis.__bManual) {
      oEvent.preventDefault();
      oEvent.stopPropagation();
//      console.log('background mouse down');
      var oInnerBoxSize = oThis.__oBackgroundUIBox.getInnerSize(),
          nBorderWidth = oThis.__oButtonUIBox.getBorderWidthPixelValue(),
          nBorderRadius = oThis.__oButtonUIBox.getBorderRadiusPixelValue(),
          nMinSize = Math.max(1, nBorderWidth * 2, nBorderRadius * 2),
          nButtonWidth = Math.max(nMinSize, Math.min(oInnerBoxSize.nHeight, oInnerBoxSize.nWidth / 10)),
          nButtonRangeX = oInnerBoxSize.nWidth - nButtonWidth,
          iX = oEvent.pageX - oThis.__oBackgroundUIBox.getBorderWidthPixelValue() - nButtonWidth / 2;
          oElement = oThis.oBackgroundInnerElement;
      do {
        iX -= oElement.offsetLeft;
      } while (oElement = oElement.offsetParent);
      var nX = Math.max(0, Math.min(1, iX / nButtonRangeX));
      oThis.setValue(nX);
      addMouseMoveEventListeners(oEvent.pageX);
      return false;
    }
  });
  oThis.refresh();
}

addEventsCode(UISlider);

var oPrototype = UISlider.prototype;
oPrototype.getValue = function() {                          return this.__nValue; }
oPrototype.setValue = function(nValue, bRefresh) {          this.__nValue = Math.max(0, Math.min(1, nValue));
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeValue', this.__nValue);
                                                            return this; }
oPrototype.getManual = function() {                         return this.__bManual; }
oPrototype.setManual = function(bManual) {                  return this.__bManual = bManual;
                                                            return this; }

// set opacity
oPrototype.setOpacity = function(nOpacity, bRefresh) {      this.__oButtonUIBox.setOpacity(nOpacity, false); 
                                                            this.__oBackgroundUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonOpacity', nOpacity);
                                                            this.fireEvent('changeBackgroundOpacity', nOpacity);
                                                            return this; }
oPrototype.setButtonOpacity = function(nOpacity, bRefresh) {this.__oButtonUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonOpacity', nOpacity);
                                                            return this; }
oPrototype.setBackgroundOpacity = function(nOpacity, bRefresh) {
                                                            this.__oBackgroundUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundOpacity', nOpacity);
                                                            return this; }
// set color
oPrototype.setColor = function(oColor, bRefresh) {          this.__oButtonUIBox.setColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderColor', oColor.copy());
                                                            this.fireEvent('changeButtonBackgroundColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setButtonColor = function(oColor, bRefresh) {    this.__oButtonUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderColor', oColor.copy());
                                                            this.fireEvent('changeButtonBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundColor = function(oColor, bRefresh) {this.__oBackgroundUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
// get border color
oPrototype.getButtonBorderColor = function() {              return this.__oButtonUIBox.getBorderColor(); }
oPrototype.getBackgroundBorderColor = function() {          return this.__oBackgroundUIBox.getBorderColor(); }
// set border color
oPrototype.setBorderColor = function(oColor, bRefresh) {    this.__oButtonUIBox.setBorderColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setBorderColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            return this; }
oPrototype.setButtonBorderColor = function(oColor, bRefresh) {
                                                            this.__oButtonUIBox.setBorderColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundBorderColor = function(oColor, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            return this; }
// get background color
oPrototype.getButtonBackgroundColor = function() {          return this.__oButtonUIBox.getBackgroundColor(); }
oPrototype.getBackgroundBackgroundColor = function() {      return this.__oBackgroundUIBox.getBackgroundColor(); }
// set background color
oPrototype.setBackgroundColor = function(oColor, bRefresh) {this.__oButtonUIBox.setBackgroundColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setBackgroundColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBackgroundColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setButtonBackgroundColor = function(oColor, bRefresh) {
                                                            this.__oButtonUIBox.setBackgroundColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundBackgroundColor = function(oColor, bRefresh) {
                                                            this.__oBackgroundUIBox.setBackgroundColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
// get border width
oPrototype.getButtonBorderWidth = function () {             return this.__oButtonUIBox.getBorderWidth(); }
oPrototype.getBackgroundBorderWidth = function () {         return this.__oBackgroundUIBox.getBorderWidth(); }
// set border width
oPrototype.setBorderWidth = function (sWidth, bRefresh) {   this.__oButtonUIBox.setBorderWidth(sWidth, false);
                                                            this.__oBackgroundUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderWidth', sWidth);
                                                            this.fireEvent('changeBackgroundBorderWidth', sWidth);
                                                            return this; }
oPrototype.setButtonBorderWidth = function (sWidth, bRefresh) {
                                                            this.__oButtonUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderWidth', sWidth);
                                                            return this; }
oPrototype.setBackgroundBorderWidth = function (sWidth, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderWidth', sWidth);
                                                            return this; }
// get border radius
oPrototype.getButtonBorderRadius = function () {            return this.__oButtonUIBox.getBorderRadius(); }
oPrototype.getBackgroundBorderRadius = function () {        return this.__oBackgroundUIBox.getBorderRadius(); }
// set border radius
oPrototype.setBorderRadius = function (sRadius, bRefresh) { this.__oButtonUIBox.setBorderRadius(sRadius, false);
                                                            this.__oBackgroundUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderRadius', sRadius);
                                                            this.fireEvent('changeBackgroundBorderRadius', sRadius);
                                                            return this; }
oPrototype.setButtonBorderRadius = function (sRadius, bRefresh) {
                                                            this.__oButtonUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderRadius', sRadius);
                                                            return this; }
oPrototype.setBackgroundBorderRadius = function (sRadius, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderRadius', sRadius);
                                                            return this; }
// get border style
oPrototype.getButtonBorderStyle = function () {             return this.__oButtonUIBox.getBorderStyle(); }
oPrototype.getBackgroundBorderStyle = function () {         return this.__oBackgroundUIBox.getBorderStyle(); }
// set border style
oPrototype.setBorderStyle = function (sStyle, bRefresh) {   this.__oButtonUIBox.setBorderStyle(sStyle, false);
                                                            this.__oBackgroundUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderStyle', sStyle);
                                                            this.fireEvent('changeBackgroundBorderStyle', sStyle);
                                                            return this; }
oPrototype.setButtonBorderStyle = function (sStyle, bRefresh) {
                                                            this.__oButtonUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeButtonBorderStyle', sStyle);
                                                            return this; }
oPrototype.setBackgroundBorderStyle = function (sStyle, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderStyle', sStyle);
                                                            return this; }

oPrototype.refresh = function() {
  var oThis = this;
  __UI__applyBorderStyle(oThis.__oHr, 
      'inset', oThis.__oBackgroundUIBox.getBorderWidth(), 0 /*radius not applicable*/, oThis.__oBackgroundUIBox.getBorderColor());

  var oInnerBoxSize = oThis.__oBackgroundUIBox.getInnerSize(),
      nButtonBorderWidth = oThis.__oButtonUIBox.getBorderWidthPixelValue(),
      nButtonBorderRadius = oThis.__oButtonUIBox.getBorderRadiusPixelValue(),
      nButtonMinSize = Math.max(1, nButtonBorderWidth * 2, nButtonBorderRadius * 2);
  if (nButtonMinSize > oInnerBoxSize.nWidth) {
    throw new Error('The slider bar is ' + oInnerBoxSize.nWidth + 'px wide, which is too small to display a ' + nButtonMinSize + 'px button.');
  }
  if (nButtonMinSize > oInnerBoxSize.nHeight) {
    throw new Error('The slider bar is ' + oInnerBoxSize.nHeight + 'px high, which is too small to display a ' + nButtonMinSize + 'px button.');
  }
  var nButtonMinWidth = Math.max(nButtonMinSize, Math.min(oInnerBoxSize.nHeight, oInnerBoxSize.nWidth / 10)),
      nButtonHeight = oInnerBoxSize.nHeight;
  with (this.__oHr.style) {
    top = (nButtonHeight / 2) + 'px';
    left = (nButtonMinWidth / 2) + 'px';
    width = (oInnerBoxSize.nWidth - nButtonMinWidth) + 'px';
    height = '0px';
  }
  oThis.__oButtonUIBox.setMinWidth(nButtonMinWidth, false);
  oThis.__oButtonUIBox.setHeight(nButtonHeight);
  var oButtonSize = oThis.__oButtonUIBox.getOuterSize();
  var nButtonX = (oInnerBoxSize.nWidth - oButtonSize.nWidth) * oThis.__nValue;
  with (oThis.oButtonOuterElement.style) {
    left = nButtonX + 'px';
  }
  oThis.__oBackgroundUIBox.refresh();
  oThis.__oButtonUIBox.refresh();
  return this;
}
