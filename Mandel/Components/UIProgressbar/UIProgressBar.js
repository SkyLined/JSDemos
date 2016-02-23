// requires CombinedEvents.js, CSS.js, Events.js, Nodes.js, RGBA.js, UIBox.js
function UIProgressBar(oContainer, sWidth, sHeight) {
  var oThis = this;
  oThis.__oBackgroundUIBox = new UIBox(oContainer, sWidth, sHeight);
  oThis.oOuterElement = 
  oThis.oBackgroundOuterElement = oThis.__oBackgroundUIBox.oOuterElement;
  oThis.oBackgroundInnerElement = oThis.__oBackgroundUIBox.oInnerElement;
  oThis.__oBarUIBox = new UIBox(oThis.oBackgroundInnerElement);
  oThis.__oBarUIBox.setBorderStyle('outset', false);
  oThis.__oBarUIBox.setBorderRadius(Math.max(0, oThis.__oBackgroundUIBox.getBorderRadiusPixelValue() - 1) + 'px', false);
  oThis.__oBarUIBox.setBackgroundColor(oThis.__oBarUIBox.getBorderColor(), false);

  oThis.__nValue = 0;
  addEvents(oThis, [
      'changeValue', 
      'changeBarBorderColor', 'changeBarBackgroundColor',
      'changeBarBorderStyle', 'changeBarBorderWidth', 'changeBarBorderRadius', 
      'changeBackgroundBorderColor', 'changeBackgroundBackgroundColor', 
      'changeBackgroundBorderStyle', 'changeBackgroundBorderWidth', 'changeBackgroundBorderRadius']);
  oThis.refresh();
}

addEventsCode(UIProgressBar);

var oPrototype = UIProgressBar.prototype;
oPrototype.getValue = function() {                          return this.__nValue; }
oPrototype.setValue = function(nValue, bRefresh) {          this.__nValue = Math.max(0, Math.min(1, nValue));
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeValue', this.__nValue);
                                                            return this; }
// set opacity
oPrototype.setOpacity = function(nOpacity, bRefresh) {      this.__oBarUIBox.setOpacity(nOpacity, false); 
                                                            this.__oBackgroundUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarOpacity', nOpacity);
                                                            this.fireEvent('changeBackgroundOpacity', nOpacity);
                                                            return this; }
oPrototype.setBarOpacity = function(nOpacity, bRefresh) {   this.__oBarUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarOpacity', nOpacity);
                                                            return this; }
oPrototype.setBackgroundOpacity = function(nOpacity, bRefresh) {
                                                            this.__oBackgroundUIBox.setOpacity(nOpacity, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundOpacity', nOpacity);
                                                            return this; }

// set color
oPrototype.setColor = function(oColor, bRefresh) {          this.__oBarUIBox.setColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderColor', oColor.copy());
                                                            this.fireEvent('changeBarBackgroundColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBarColor = function(oColor, bRefresh) {       this.__oBarUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderColor', oColor.copy());
                                                            this.fireEvent('changeBarBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundColor = function(oColor, bRefresh) {this.__oBackgroundUIBox.setColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
// get border color
oPrototype.getBarBorderColor = function() {                 return this.__oBarUIBox.getBorderColor(); }
oPrototype.getBackgroundBorderColor = function() {          return this.__oBackgroundUIBox.getBorderColor(); }
// set border color
oPrototype.setBorderColor = function(oColor, bRefresh) {    this.__oBarUIBox.setBorderColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setBorderColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            return this; }
oPrototype.setBarBorderColor = function(oColor, bRefresh) { this.__oBarUIBox.setBorderColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundBorderColor = function(oColor, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderColor', oColor.copy());
                                                            return this; }
// get background color
oPrototype.getBarBackgroundColor = function() {             return this.__oBarUIBox.getBackgroundColor(); }
oPrototype.getBackgroundBackgroundColor = function() {      return this.__oBackgroundUIBox.getBackgroundColor(); }
// set background color
oPrototype.setBackgroundColor = function(oColor, bRefresh) {this.__oBarUIBox.setBackgroundColor(oColor, false); 
                                                            this.__oBackgroundUIBox.setBackgroundColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBackgroundColor', oColor.copy());
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBarBackgroundColor = function(oColor, bRefresh) {
                                                            this.__oBarUIBox.setBackgroundColor(oColor, false); 
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBackgroundColor', oColor.copy());
                                                            return this; }
oPrototype.setBackgroundBackgroundColor = function(oColor, bRefresh) {
                                                            this.__oBackgroundUIBox.setBackgroundColor(oColor, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBackgroundColor', oColor.copy());
                                                            return this; }
// get border width
oPrototype.getBarBorderWidth = function () {                return this.__oBarUIBox.getBorderWidth(); }
oPrototype.getBackgroundBorderWidth = function () {         return this.__oBackgroundUIBox.getBorderWidth(); }
// set border width
oPrototype.setBorderWidth = function (sWidth, bRefresh) {   this.__oBarUIBox.setBorderWidth(sWidth, false);
                                                            this.__oBackgroundUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderWidth', sWidth);
                                                            this.fireEvent('changeBackgroundBorderWidth', sWidth);
                                                            return this; }
oPrototype.setBarBorderWidth = function (sWidth, bRefresh) {this.__oBarUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderWidth', sWidth);
                                                            return this; }
oPrototype.setBackgroundBorderWidth = function (sWidth, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderWidth(sWidth, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderWidth', sWidth);
                                                            return this; }
// get border radius
oPrototype.getBarBorderRadius = function () {               return this.__oBarUIBox.getBorderRadius(); }
oPrototype.getBackgroundBorderRadius = function () {        return this.__oBackgroundUIBox.getBorderRadius(); }
// set border radius
oPrototype.setBorderRadius = function (sRadius, bRefresh) { this.__oBarUIBox.setBorderRadius(sRadius, false);
                                                            this.__oBackgroundUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderRadius', sRadius);
                                                            this.fireEvent('changeBackgroundBorderRadius', sRadius);
                                                            return this; }
oPrototype.setBarBorderRadius = function (sRadius, bRefresh) {
                                                            this.__oBarUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderRadius', sRadius);
                                                            return this; }
oPrototype.setBackgroundBorderRadius = function (sRadius, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderRadius(sRadius, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderRadius', sRadius);
                                                            return this; }
// get border style
oPrototype.getBarBorderStyle = function () {                return this.__oBarUIBox.getBorderStyle(); }
oPrototype.getBackgroundBorderStyle = function () {         return this.__oBackgroundUIBox.getBorderStyle(); }
// set border style
oPrototype.setBorderStyle = function (sStyle, bRefresh) {   this.__oBarUIBox.setBorderStyle(sStyle, false);
                                                            this.__oBackgroundUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderStyle', sStyle);
                                                            this.fireEvent('changeBackgroundBorderStyle', sStyle);
                                                            return this; }
oPrototype.setBarBorderStyle = function (sStyle, bRefresh) {this.__oBarUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBarBorderStyle', sStyle);
                                                            return this; }
oPrototype.setBackgroundBorderStyle = function (sStyle, bRefresh) {
                                                            this.__oBackgroundUIBox.setBorderStyle(sStyle, false);
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundBorderStyle', sStyle);
                                                            return this; }

oPrototype.refresh = function() {
  var oThis = this;
  var oInnerBoxSize = oThis.__oBackgroundUIBox.getInnerSize(),
      nBarBorderWidth = oThis.__oBarUIBox.getBorderWidthPixelValue(),
      nBarBorderRadius = oThis.__oBarUIBox.getBorderRadiusPixelValue(),
      nMinSize = Math.max(1, nBarBorderWidth * 2, nBarBorderRadius * 2);
  if (nMinSize > oInnerBoxSize.nWidth)
      throw new Error('The progress bar is ' + oInnerBoxSize.nWidth + 'px wide, which is too small to display a ' + nMinSize + 'px bar.');
  if (nMinSize > oInnerBoxSize.nHeight)
      throw new Error('The progress bar is ' + oInnerBoxSize.nHeight + 'px high, which is too small to display a ' + nMinSize + 'px bar.');
  var oSize = { nWidth: nMinSize + (oInnerBoxSize.nWidth - nMinSize) * oThis.__nValue,
                nHeight: Math.max(nMinSize, oInnerBoxSize.nHeight) };
  oThis.__oBarUIBox.setSize(oSize.nWidth, oSize.nHeight);
  this.__oBackgroundUIBox.refresh();
  this.__oBarUIBox.refresh();
  return this;
}
