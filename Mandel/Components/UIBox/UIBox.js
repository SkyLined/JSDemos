// requires CombinedEvents.js, CSS.js, Events.js, Nodes.js, RGBA.js
var gsUIBoxBorderWidth = '2px', 
    gsUIBoxBorderRadius = '5px', 
    goUIBoxColor = new RGB(.8, .8, .8),
    gsUIBoxOpacity = 1;
function UIBox(oContainer, sWidth, sHeight, bAvoidCorners) {
  var oThis = this;
  // Setting RGBA on individual borders doesn't work. The solution is to create a separate border element, set RGB
  // and use "opacity" to set A.
  oThis.__doNodes = createNodes([
    { name: 'oOuter=span',
      attributes: {name: 'UIBox::oOuter'},
      styles: { display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'top' },
      targetEvents: {
        'resize': function(oEvent) {
          console.log('resize');
        }
      },
      children: [
        // To get the size right when setting either width or height or both, and get the borders to align to the edges
        // properly in each situation, it's easiest to create two elements; one that always fills the entire rect to
        // set the borders and background in and one that can fill less than that to put the content in:
        { name: 'oInner=span', 
          attributes: {name: 'UIBox::oInner'},
          styles: { display: 'block', overflow: 'hidden', borderStyle: 'solid', borderColor: 'transparent' }
        },
        { name: 'oBorder=span', 
          attributes: {name: 'UIBox::oBorder'},
          styles: { display: 'block', position: 'absolute', left: '0px', right: '0px', top: '0px', bottom: '0px', borderStyle: 'solid' },
        }
      ]
    }
  ], oContainer);
  oThis.__bWidthSet = sWidth !== undefined
  oThis.__bHeightSet = sHeight !== undefined

  oThis.oOuterElement = oThis.__doNodes.oOuter;
  oThis.__bAvoidCorners = bAvoidCorners;
  if (bAvoidCorners) {
    oThis.__doAvoidCornerNodes = createNodes([
      { name: 'oFloatTopLeft=span',
        attributes: {name: 'UIBox::oFloatTopLeft'},
        styles: { float: 'left' },
      },
      { name: 'oFloatTopRight=span',
        attributes: {name: 'UIBox::oFloatTopRight'},
        styles: { float: 'right' },
      },
      { name: 'oInnerAvoidCorners=span', 
        attributes: {name: 'UIBox::oInnerAvoidCorners'},
      },
      { name: 'oFloatBottomLeft=span',
        attributes: {name: 'UIBox::oFloatBottomLeft'},
        styles: { float: 'left', clear: 'right' },
      },
      { name: 'oFloatBottomRight=span',
        attributes: {name: 'UIBox::oFloatBottomRight'},
        styles: { clear: 'right', float: 'right' },
      }
    ], oThis.__doNodes.oInner);
    oThis.oInnerElement = oThis.__doAvoidCornerNodes.oInnerAvoidCorners;
  } else {
    oThis.oInnerElement = oThis.__doNodes.oInner;
  }

  if (oThis.__bWidthSet)  oThis.oOuterElement.style.width = cssStringValue(sWidth, 'px');
  if (oThis.__bHeightSet) oThis.oOuterElement.style.height = cssStringValue(sHeight, 'px');
  addEvents(oThis, ['changeSize', 'changeBorderColor', 'changeBorderStyle', 'changeBorderWidth', 'changeBorderRadius', 
      'changeBackgroundColor', 'changeOpacity']);
  oThis.__sBorderWidth = gsUIBoxBorderWidth;
  oThis.__sBorderRadius = gsUIBoxBorderRadius;
  oThis.__sBorderStyle = 'inset';
  oThis.__oBorderColor = goUIBoxColor.copy();
  oThis.__oBackgroundColor = goUIBoxColor.copy().setOpacity(0);
  oThis.__sOpacity = gsUIBoxOpacity;
  oThis.__bInRefresh = false;
  oThis.__bFloatRefreshQueued = false;
  oThis.refresh();
}
addEventsCode(UIBox);

var oPrototype = UIBox.prototype;
oPrototype.getOuterSize = function() {                      return { nWidth: this.oOuterElement.clientWidth,
                                                                     nHeight: this.oOuterElement.clientHeight}; }
oPrototype.getInnerSize = function() {                      return { nWidth: this.__doNodes.oBorder.clientWidth,
                                                                     nHeight: this.__doNodes.oBorder.clientHeight}; }

oPrototype.setSize = function(sWidth, sHeight, bRefresh) {  this.oOuterElement.style.width = cssStringValue(sWidth, 'px');
                                                            this.oOuterElement.style.height = cssStringValue(sHeight, 'px');
                                                            this.__bWidthSet = true; this.__bHeightSet = true;
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeSize', this.getOuterSize());
                                                            return this; }
oPrototype.setMinSize = function(sWidth, sHeight, bRefresh) {
                                                            this.oOuterElement.style.minWidth = cssStringValue(sWidth, 'px');
                                                            this.oOuterElement.style.minHeight = cssStringValue(sHeight, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setMaxSize = function(sWidth, sHeight, bRefresh) {
                                                            this.oOuterElement.style.maxWidth = cssStringValue(sWidth, 'px');
                                                            this.oOuterElement.style.maxHeight = cssStringValue(sHeight, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setWidth = function(sWidth, bRefresh) {          this.oOuterElement.style.width = cssStringValue(sWidth, 'px');
                                                            this.__bWidthSet = true;
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeSize', this.getOuterSize());
                                                            return this; }
oPrototype.setMinWidth = function(sWidth, bRefresh) {       this.oOuterElement.style.minWidth = cssStringValue(sWidth, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setMaxWidth = function(sWidth, bRefresh) {       this.oOuterElement.style.maxWidth = cssStringValue(sWidth, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setHeight = function(sHeight, bRefresh) {        this.oOuterElement.style.height = cssStringValue(sHeight, 'px');
                                                            this.__bHeightSet = true;
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeSize', this.getOuterSize());
                                                            return this; }
oPrototype.setMinHeight = function(sHeight, bRefresh) {     this.oOuterElement.style.minHeight = cssStringValue(sHeight, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setMaxHeight = function(sHeight, bRefresh) {     this.oOuterElement.style.maxHeight = cssStringValue(sHeight, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            return this; }
oPrototype.setColor = function(oColor, bRefresh) {          this.__oBorderColor = oColor.copy();
                                                            this.__oBackgroundColor = oColor.copy();
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBorderColor', oColor);
                                                            return this; }
oPrototype.getBorderColor = function() {                    return this.__oBorderColor.copy(); }
oPrototype.setBorderColor = function(oColor, bRefresh) {    this.__oBorderColor = oColor.copy();
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBorderColor', oColor);
                                                            return this; }
oPrototype.getBorderWidth = function () {                   return this.__sBorderWidth; }
oPrototype.getBorderWidthPixelValue = function () {         return cssPixelValue(this.__doNodes.oBorder, this.__sBorderWidth); }
oPrototype.setBorderWidth = function (sWidth, bRefresh) {   this.__sBorderWidth = cssStringValue(sWidth, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBorderWidth', sWidth);
                                                            return this; }
oPrototype.getBorderRadius = function () {                  return this.__sBorderRadius; }
oPrototype.getBorderRadiusPixelValue = function () {        return cssPixelValue(this.__doNodes.oBorder, this.__sBorderRadius); }
oPrototype.setBorderRadius = function (sRadius, bRefresh) { this.__sBorderRadius = cssStringValue(sRadius, 'px');
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBorderRadius', sRadius);
                                                            return this; }
oPrototype.getBorderStyle = function () {                   return this.__sBorderStyle; }
oPrototype.setBorderStyle = function (sStyle, bRefresh) {   this.__sBorderStyle = sStyle;
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBorderStyle', sStyle);
                                                            return this; }
oPrototype.getBackgroundColor = function() {                return this.__oBackgroundColor.copy(); }
oPrototype.setBackgroundColor = function(oColor, bRefresh) {this.__oBackgroundColor = oColor.copy();
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeBackgroundColor', oColor);
                                                            return this; }
oPrototype.getOpacity = function () {                       return this.__sOpacity; }
oPrototype.setOpacity = function (sOpacity, bRefresh) {     this.__sOpacity = sOpacity;
                                                            if (bRefresh !== false) this.refresh();
                                                            this.fireEvent('changeOpacity', sOpacity);
                                                            return this; }

oPrototype.refresh = function () {
  var oThis = this;
  if (oThis.__bInRefresh) throw new Error('refresh() recursively triggers refresh()!');
  oThis.__bInRefresh = true;
  // Apply border styling
  __UI__applyBorderStyle(oThis.__doNodes.oBorder, 
      oThis.__sBorderStyle, oThis.__sBorderWidth, oThis.__sBorderRadius, oThis.__oBorderColor);
  // Apply box opacity
  oThis.oOuterElement.style.opacity = oThis.__sOpacity;

  var oInnerSize = oThis.getInnerSize();
  with (oThis.__doNodes.oInner.style) {
    borderWidth = oThis.__sBorderWidth;
    borderRadius = oThis.__sBorderRadius;
    if (oThis.__bWidthSet)  width = oInnerSize.nWidth + 'px';
    if (oThis.__bHeightSet) height = oInnerSize.nHeight + 'px';
    background = oThis.__oBackgroundColor.rgbaCss();
  }
  if (oThis.__bAvoidCorners) {
    if (!oThis.__bFloatRefreshQueued) {
      // To calculate the size of the floats, the corners need to be drawn first. I am unaware of a way to force this,
      // other than waiting for it to happen as soon as JavaScript stops executing. By setting a timeout with in 0
      // seconds, the below code gets run immediately after the current JavaScript stops executing and the page has been
      // refreshed:
      oThis.__bFloatRefreshQueued = true;
      oThis.__xFloatRefreshTimeout = setTimeout(function() {
        oThis.__bFloatRefreshQueued = false;
        oThis.__bInRefresh = true;
        var oInnerSize = oThis.getInnerSize(),
            nBorderRadius = oThis.getBorderRadiusPixelValue(),
            nBorderWidth = oThis.getBorderWidthPixelValue(),
            nCornerSize = Math.max(0, Math.min(oInnerSize.nWidth / 2, oInnerSize.nHeight / 2, nBorderRadius - nBorderWidth));
            nFloatSize = Math.sqrt(2 * nCornerSize * nCornerSize) - nCornerSize;
        oThis.__doAvoidCornerNodes.oFloatTopLeft.style.width = 
        oThis.__doAvoidCornerNodes.oFloatTopLeft.style.height = 
        oThis.__doAvoidCornerNodes.oFloatTopRight.style.width = 
        oThis.__doAvoidCornerNodes.oFloatTopRight.style.height = 
        oThis.__doAvoidCornerNodes.oFloatBottomLeft.style.width = 
        oThis.__doAvoidCornerNodes.oFloatBottomLeft.style.height = 
        oThis.__doAvoidCornerNodes.oFloatBottomRight.style.width = 
        oThis.__doAvoidCornerNodes.oFloatBottomRight.style.height = 
            nFloatSize + 'px';
        oThis.__bInRefresh = false;
      }, 0);
    }
  } else {
    if (oThis.__bFloatRefreshQueued) {
      // The corner clearing has been disabled before the floats have been refreshed. This queued refresh is no longer
      // needed, so cancel it:
      clearTimeout(oThis.__xFloatRefreshTimeout);
      oThis.__bFloatRefreshQueued = false;
    }
  }
  oThis.__bInRefresh = false;
}

function __UI__applyBorderStyle(oElement, sStyle, sWidth, sRadius, oColor) {
  var oLighter = oColor.copy().lighten(.25),
      oDarker = oColor.copy().darken(.25);
  switch (sStyle) {
    case 'solid': var aoColors =  [oColor,   oColor,   oColor,   oColor]; break;
    case 'inset': var aoColors =  [oDarker,  oLighter, oLighter, oDarker]; break;
    case 'outset': var aoColors = [oLighter, oDarker,  oDarker,  oLighter]; break;
    default: throw new Error('Unknown border style "' + sStyle + '"');
  }
  with (oElement.style) {
    borderWidth =       sWidth;
    borderRadius =      sRadius;
    borderTopColor =    aoColors[0].rgbaCss();
    borderRightColor =  aoColors[1].rgbaCss();
    borderBottomColor = aoColors[2].rgbaCss();
    borderLeftColor =   aoColors[3].rgbaCss();
  }
  return this;
}