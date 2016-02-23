function UICanvasSlider(oContainer, oUIColorPicker, sValueProperty, sColorChangeMethod, sWidth, sHeight) {
  var oThis = this;
  oThis.oUIColorPicker = oUIColorPicker;
  oThis.oUISlider = new UISlider(oContainer, sWidth, sHeight).setValue(oUIColorPicker.__oColor[sValueProperty], false);
  oThis.oCanvas = createNode({
      name: 'canvas', 
      styles: {position: 'absolute', verticalAlign: 'top' }, 
      attributes: {height: 1}, 
  }, oThis.oUISlider.oBackgroundInnerElement.ownerDocument);
  oThis.oUISlider.oBackgroundInnerElement.insertBefore(
      oThis.oCanvas, oThis.oUISlider.oBackgroundInnerElement.firstChild);
  oThis.__sColorChangeMethod = sColorChangeMethod;
}
var oPrototype = UICanvasSlider.prototype;
oPrototype.setColor = function (oColor) {
  var oThis = this;
  oThis.oUISlider.setButtonColor(oColor);
  oThis.oCanvas.width = oThis.oUISlider.oBackgroundInnerElement.clientWidth;
  oThis.oCanvas.style.width = oThis.oUISlider.oBackgroundInnerElement.clientWidth + 'px';
  if (oThis.oCanvas.width == 0) return;
  oThis.oCanvas.style.width = oThis.oUISlider.oBackgroundInnerElement.clientWidth + 'px';
  oThis.oCanvas.style.height = oThis.oUISlider.oBackgroundInnerElement.clientHeight + 'px';
  var oContext2d = oThis.oCanvas.getContext('2d');
  var oImageData = oContext2d.getImageData(0, 0, oThis.oCanvas.width, 1);
  for (var i = 0; i < oThis.oCanvas.width; i++) {
    var nProgress = i / oThis.oCanvas.width;
    var oPixelColor = oThis.oUIColorPicker.__oColor.copy()[oThis.__sColorChangeMethod](nProgress);
    oImageData.data[i * 4]     = oPixelColor.r255();
    oImageData.data[i * 4 + 1] = oPixelColor.g255();
    oImageData.data[i * 4 + 2] = oPixelColor.b255();
    oImageData.data[i * 4 + 3] = oPixelColor.a255();
  }
  oContext2d.putImageData(oImageData, 0, 0);
}
function UIColorPicker(oContainer, oColor, sWidth, sHeight) {
  var oThis = this;
  
  oThis.__oColor = oColor || new RGB(1,1,1);
  oThis.__oCanvasSliderR = new UICanvasSlider(oContainer, oThis, 'nR', 'setRed',        '100%', '12.5%');
  oThis.__oCanvasSliderG = new UICanvasSlider(oContainer, oThis, 'nG', 'setGreen',      '100%', '12.5%');
  oThis.__oCanvasSliderB = new UICanvasSlider(oContainer, oThis, 'nB', 'setBlue',       '100%', '12.5%');
  oThis.__oCanvasSliderH = new UICanvasSlider(oContainer, oThis, 'nH', 'setHue',        '100%', '12.5%');
  oThis.__oCanvasSliderS = new UICanvasSlider(oContainer, oThis, 'nS', 'setSaturation', '100%', '12.5%');
  oThis.__oCanvasSliderL = new UICanvasSlider(oContainer, oThis, 'nL', 'setLuminosity', '100%', '12.5%');
  oThis.__oCanvasSliderA = new UICanvasSlider(oContainer, oThis, 'nA', 'setOpacity',    '100%', '12.5%');
  oThis.__enableUpdates();
  addEvents(oThis, [
      'changeColor', 'changeBackgroundColor', 'changeBackgroundBorderStyle', 'changeBackgroundBorderWidth', 'changeBackgroundBorderRadius']);
  this.refresh();
}

addEventsCode(UIColorPicker);

var oPrototype = UIColorPicker.prototype;
oPrototype.getColor = function() {                          return this.__oColor.copy(); }
oPrototype.setColor = function(oColor) {
  this.__oColor = oColor.copy();
  this.__updateSliders();
  this.refresh();
  this.fireEvent('changeColor', oColor.copy());
  return this;
}
oPrototype.getBackgroundColor = function() {                return this.__oCanvasSliderR.oUISlider.getBackgroundColor(); }
oPrototype.setBackgroundColor = function(oColor) {
  this.__oCanvasSliderR.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderG.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderB.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderH.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderS.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderL.oUISlider.setBackgroundColor(oColor);
  this.__oCanvasSliderA.oUISlider.setBackgroundColor(oColor);
  this.fireEvent('changeBackgroundColor', oColor.copy());
  return this;
}
oPrototype.getBackgroundBorderWidth = function () {         return this.__oCanvasSliderR.oUISlider.getBackgroundBorderWidth(); }
oPrototype.setBackgroundBorderWidth = function (sWidth) {
  this.__oCanvasSliderR.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderG.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderB.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderH.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderS.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderL.oUISlider.setBackgroundBorderWidth(sWidth);
  this.__oCanvasSliderA.oUISlider.setBackgroundBorderWidth(sWidth);
  this.fireEvent('changeBackgroundBorderWidth', sWidth);
  return this;
}
oPrototype.getBackgroundBorderRadius = function () {        return this.__oCanvasSliderR.oUISlider.getBackgroundBorderRadius(); }
oPrototype.setBackgroundBorderRadius = function (sRadius) {
  this.__oCanvasSliderR.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderG.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderB.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderH.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderS.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderL.oUISlider.setBackgroundBorderRadius(sRadius);
  this.__oCanvasSliderA.oUISlider.setBackgroundBorderRadius(sRadius);
  this.fireEvent('changeBackgroundBorderRadius', sRadius);
  return this;
}
oPrototype.getBackgroundBorderStyle = function () {         return this.getBackgroundBorderStyle(); }
oPrototype.setBackgroundBorderStyle = function (sNewStyle) {
  this.__oCanvasSliderR.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderG.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderB.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderH.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderS.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderL.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.__oCanvasSliderA.oUISlider.setBackgroundBorderStyle(sNewStyle);
  this.fireEvent('changeBackgroundBorderStyle', sNewStyle);
  return this;
}

oPrototype.__enableUpdates = function () {
  var oThis = this;
  oThis.__listener  = function () {
    oThis.__updateSliders();
    oThis.refresh();
    oThis.fireEvent('changeColor', oThis.__oColor.copy());
  }
  oThis.__listenerR = function (oSlider, nValue) {          oThis.__oColor.setRed(nValue);        oThis.__listener(); }
  oThis.__listenerG = function (oSlider, nValue) {          oThis.__oColor.setGreen(nValue);      oThis.__listener(); }
  oThis.__listenerB = function (oSlider, nValue) {          oThis.__oColor.setBlue(nValue);       oThis.__listener(); }
  oThis.__listenerH = function (oSlider, nValue) {          oThis.__oColor.setHue(nValue);        oThis.__listener(); }
  oThis.__listenerS = function (oSlider, nValue) {          oThis.__oColor.setSaturation(nValue); oThis.__listener(); }
  oThis.__listenerL = function (oSlider, nValue) {          oThis.__oColor.setLuminosity(nValue); oThis.__listener(); }
  oThis.__listenerA = function (oSlider, nValue) {          oThis.__oColor.setOpacity(nValue);    oThis.__listener(); }
  oThis.__oCanvasSliderR.oUISlider.addEventListener('changeValue', oThis.__listenerR);
  oThis.__oCanvasSliderG.oUISlider.addEventListener('changeValue', oThis.__listenerG);
  oThis.__oCanvasSliderB.oUISlider.addEventListener('changeValue', oThis.__listenerB);
  oThis.__oCanvasSliderH.oUISlider.addEventListener('changeValue', oThis.__listenerH);
  oThis.__oCanvasSliderS.oUISlider.addEventListener('changeValue', oThis.__listenerS);
  oThis.__oCanvasSliderL.oUISlider.addEventListener('changeValue', oThis.__listenerL);
  oThis.__oCanvasSliderA.oUISlider.addEventListener('changeValue', oThis.__listenerA);
}
oPrototype.__disableUpdates = function () {
  var oThis = this;
  oThis.__oCanvasSliderR.oUISlider.removeEventListener('changeValue', oThis.__listenerR);
  oThis.__oCanvasSliderG.oUISlider.removeEventListener('changeValue', oThis.__listenerG);
  oThis.__oCanvasSliderB.oUISlider.removeEventListener('changeValue', oThis.__listenerB);
  oThis.__oCanvasSliderH.oUISlider.removeEventListener('changeValue', oThis.__listenerH);
  oThis.__oCanvasSliderS.oUISlider.removeEventListener('changeValue', oThis.__listenerS);
  oThis.__oCanvasSliderL.oUISlider.removeEventListener('changeValue', oThis.__listenerL);
  oThis.__oCanvasSliderA.oUISlider.removeEventListener('changeValue', oThis.__listenerA);
}

oPrototype.__updateSliders = function() {
  var oThis = this;
  oThis.__disableUpdates(); // To prevent an event loop where setting values triggers us to update colors
  oThis.__oCanvasSliderR.oUISlider.setValue(oThis.__oColor.nR, false);
  oThis.__oCanvasSliderG.oUISlider.setValue(oThis.__oColor.nG, false);
  oThis.__oCanvasSliderB.oUISlider.setValue(oThis.__oColor.nB, false);
  oThis.__oCanvasSliderH.oUISlider.setValue(oThis.__oColor.nH, false);
  oThis.__oCanvasSliderS.oUISlider.setValue(oThis.__oColor.nS, false);
  oThis.__oCanvasSliderL.oUISlider.setValue(oThis.__oColor.nL, false);
  oThis.__oCanvasSliderA.oUISlider.setValue(oThis.__oColor.nA, false);
  oThis.__enableUpdates();
  return this;
}
oPrototype.refresh = function() {
  var oThis = this;

  oThis.__oCanvasSliderR.setColor(new RGB(oThis.__oColor.nR, 0, 0));
  oThis.__oCanvasSliderG.setColor(new RGB(0, oThis.__oColor.nG, 0));
  oThis.__oCanvasSliderB.setColor(new RGB(0, 0, oThis.__oColor.nB));
  oThis.__oCanvasSliderH.setColor(new HSL(oThis.__oColor.nH, 1, .5));
  oThis.__oCanvasSliderS.setColor(new HSL(oThis.__oColor.nH, oThis.__oColor.nS, .5));
  oThis.__oCanvasSliderL.setColor(new HSL(oThis.__oColor.nH, 1, oThis.__oColor.nL));
  oThis.__oCanvasSliderA.setColor(oThis.__oColor);
  return this;
}
