// requires UIBox.js, Nodes.js, CombinedEvents.js, Events.js, RGBA.js
var gsUITabHorizontalShadowSize = '.5em', gsUITabVerticalShadowSize = '1em', gnUITabShadowDarkness = .25;
function UITabs(oContainer, bVertical, sWidth, sHeight, sTabsMinWidth, sTabsSeparatorWidth) {
  var oThis = this;
  oThis.__bVertical = bVertical ? true : false;
  oThis.__oContainer = oContainer;
  if (oThis.__bVertical) {
    oThis.__doNodes = createNodes([
      { name: 'oOuter=table',
        styles: { emptyCells: 'show', borderCollapse: 'separate', borderSpacing: 0 },
        attributes: { cellspacing: 0, cellpadding: 0 },
        children: [
          { name: 'oTabs=tbody' }
        ]
      }
    ], oContainer);
  } else {
    oThis.__doNodes = createNodes([
      { name: 'oOuter=table',
        styles: { emptyCells: 'show', borderCollapse: 'separate', borderSpacing: 0 },
        attributes: { cellspacing: 0, cellpadding: 0 },
        children: [
          { name: 'tbody',
            children: [
              { name: 'oTabs=tr' },
              { name: 'oBodyTabSeparators=tr' },
              { name: 'oBodies=tr' }
            ]
          }
        ]
      }
    ], oContainer);
  }
  with (oThis.__doNodes.oOuter.style) {
    width = sWidth != undefined ? sWidth : '100%';
    height = sHeight != undefined ? sHeight : '100%';
  }
  oThis.__sTabsMinWidth = sTabsMinWidth != undefined ? sTabsMinWidth : '5em';
  oThis.__sTabsSeparatorWidth = sTabsSeparatorWidth != undefined ? sTabsSeparatorWidth : '.25em';
  addEvents(oThis, ['createTab', 'selectTab', 'removeTab',
      'changeSize', 'changeBorderColor', 'changeBorderStyle', 'changeBorderWidth', 'changeBorderRadius',
      'changeBackgroundColor', ]);
  oThis.aoTabs = [];
  oThis.__oSelectedTab = null;
  oThis.__aoSeparators = [];
  oThis.__sBorderWidth = gnUIBoxBorderWidth + 'px';
  oThis.__sBorderRadius = gnUIBoxBorderRadius + 'px';
  oThis.__sBorderStyle = 'outset';
  oThis.__oBorderColor = new RGBA(.8, .8, .8, .9);
  oThis.__oBackgroundColor = new RGBA(.8, .8, .8, .9);
  oThis.__sShadowSize = bVertical ? gsUITabVerticalShadowSize : gsUITabHorizontalShadowSize;
}
addEventsCode(UITabs);
function UITab(oUITabs, oNextObject) {
  var oThis = this;
  oThis.oUITabs = oUITabs;
  if (oUITabs.__bVertical) {
    oThis.__doNodes = createNodes([
      { name: 'oTabRow=tr',
        children: [
          { name: 'oTabsNode=td',
            styles: { whiteSpace: "nowrap", borderStyle: 'solid', verticalAlign: 'top' },
            attributes: { class: 'tab'},
            captureTargetEvents: {
              click: function () {
                oUITabs.selectTab(oThis);
              }
            } },
          { name: 'oTabBodySeparator=td',
            styles: { borderStyle: 'solid' } },
        ] },
      { name: 'oBody=td', 
        styles: { width: '100%', height: "100%", display: 'none', borderStyle: 'solid' }, 
        attributes: { class: 'contents'} },
    ], oUITabs.__oContainer.ownerDocument);
    oUITabs.__doNodes.oTabs.insertBefore(oThis.__doNodes.oTabRow, oNextObject.__doNodes.oTabRow);
    if (!oUITabs.__doNodes.oBodies)
      oUITabs.__doNodes.oBodies = oThis.__doNodes.oTabRow;
    oUITabs.__doNodes.oBodies.appendChild(oThis.__doNodes.oBody);
  } else {
    oThis.__doNodes = createNodes([
      { name: 'oTabsNode=td',
        styles: { whiteSpace: "nowrap", borderStyle: 'solid', verticalAlign: 'top' },
        attributes: { class: 'tab'},
        captureTargetEvents: {
          click: function () {
            oUITabs.selectTab(oThis);
          }
        } },
      { name: 'oTabBodySeparator=td',
        styles: { borderStyle: 'solid' } },
      { name: 'oBody=td', 
        styles: { width: '100%', height: "100%", display: 'none', borderStyle: 'solid' }, 
        attributes: { class: 'contents'} },
    ], oUITabs.__oContainer.ownerDocument);
    oUITabs.__doNodes.oTabs.insertBefore(oThis.__doNodes.oTabsNode, oNextObject.__doNodes.oTabsNode);
    oUITabs.__doNodes.oBodyTabSeparators.insertBefore(oThis.__doNodes.oTabBodySeparator, oNextObject.__doNodes.oTabBodySeparator);
    oUITabs.__doNodes.oBodies.appendChild(oThis.__doNodes.oBody);
  }
  if (oUITabs.__sTabsMinWidth !== undefined) {
    oThis.__doNodes.oTabsNode.style.minWidth = oUITabs.__sTabsMinWidth;
  }
  oThis.__oBorderColor = null;
  oThis.__oBackgroundColor = null;
  addEvents(oThis, ['selected', 'removed',
      'changeSize', 'changeBorderColor', 'changeBorderStyle', 'changeBorderWidth', 'changeBorderRadius',
      'changeBackgroundColor', ]);
}
addEventsCode(UITab);
var oPrototype = UITab.prototype;
oPrototype.remove = function () {                           this.oUITabs.removeTab(this);
                                                            return this; }
oPrototype.select = function () {                           this.oUITabs.selectTab(this);
                                                            return this; }
oPrototype.getTitleElement = function() {                   return this.__doNodes.oTabsNode; }
oPrototype.getBodyElement = function() {                    return this.__doNodes.oBody; }
oPrototype.getBorderColor = function() {                    return (this.__oBorderColor || this.oUITabs.__oBorderColor).copy(); }
oPrototype.setBorderColor = function(oColor) {              this.__oBorderColor = oColor.copy(); this.oUITabs.refresh();
                                                            return this; }
oPrototype.getBackgroundColor = function() {                return (this.__oBackgroundColor || this.oUITabs.__oBackgroundColor).copy(); }
oPrototype.setBackgroundColor = function(oColor) {          this.__oBackgroundColor = oColor.copy(); this.oUITabs.refresh();
                                                            return this; }

function UITabSeparator(oUITabs, oNextObject) {
  var oThis = this;
  if (oUITabs.__bVertical) {
    oThis.__doNodes = createNodes([
      { name: 'oTabRow=tr',
        children: [
          { name: 'oTabsNode=td', 
            attributes: { class: 'sep'} },
          { name: 'oTabBodySeparator=td',
            styles: { borderStyle: 'solid' } },
        ] },
    ], oUITabs.__oContainer.ownerDocument);
  } else {
    oThis.__doNodes = createNodes([
      { name: 'oTabsNode=td', 
        attributes: { class: 'sep'} },
      { name: 'oTabBodySeparator=td',
        styles: { borderStyle: 'solid' } },
    ], oUITabs.__oContainer.ownerDocument);
  }
  if (oNextObject == null) {
    // The first tab gets to create the last "separator" that fills up remaining space after tabs on the right:
    if (oUITabs.__bVertical) {
      oThis.__doNodes.oTabsNode.style.height = '100%';
      oUITabs.__doNodes.oTabs.appendChild(oThis.__doNodes.oTabRow);
    } else {
      oThis.__doNodes.oTabsNode.style.width = '100%';
      oUITabs.__doNodes.oTabs.appendChild(oThis.__doNodes.oTabsNode);
      oUITabs.__doNodes.oBodyTabSeparators.appendChild(oThis.__doNodes.oTabBodySeparator);
    }
  } else {
    // Other tabs gets to create a true tab separator that fills up space between tabs:
    if (oUITabs.__sTabsSeparatorWidth !== undefined) {
      if (oUITabs.__bVertical)
        oThis.__doNodes.oTabsNode.style.minHeight = oUITabs.__sTabsSeparatorWidth;
      else
        oThis.__doNodes.oTabsNode.style.minWidth = oUITabs.__sTabsSeparatorWidth;
    }
    if (oUITabs.__bVertical) {
      oUITabs.__doNodes.oTabs.insertBefore(oThis.__doNodes.oTabRow, oNextObject.__doNodes.oTabRow);
    } else {
      oUITabs.__doNodes.oTabs.insertBefore(oThis.__doNodes.oTabsNode, oNextObject.__doNodes.oTabsNode);
      oUITabs.__doNodes.oBodyTabSeparators.insertBefore(oThis.__doNodes.oTabBodySeparator, oNextObject.__doNodes.oTabBodySeparator);
    }
  }
}

var oPrototype = UITabs.prototype;
oPrototype.createTab = function (iIndex) {
  var oThis = this;
  iIndex = parseInt(iIndex);
  iIndex = isNaN(iIndex) || iIndex > oThis.aoTabs.length ? oThis.aoTabs.length : iIndex;
  if (oThis.aoTabs.length != 0) {
    // Tabs already exist, so a separator is needed. If the tab is inserted at the left, the separator will be inserted
    // before the leftmost tab. Otherwise, it will be inserted before the separator to the right of the tab on the left
    // of the new tab.
    var oNextObject = iIndex == 0 ? oThis.aoTabs[0] : oThis.__aoSeparators[iIndex - 1];
    var oTabSeparator = new UITabSeparator(oThis, oNextObject);
    oThis.__aoSeparators.splice(oThis.__aoSeparators.length - 1, 0, oTabSeparator);
    // The tab will now be inserted to the right of the separator.
  } else {
    // No tabs exist, so no separator is needed. An end "separator" that fills the unused space on the right of the tab
    // will be created. The tab will be inserted to the left of the end "separator".
    var oTabSeparator = new UITabSeparator(oThis, null);
    var oNextObject = oTabSeparator
    oThis.__aoSeparators = [oTabSeparator];
  }
  var oTab = new UITab(oThis, oNextObject);
  oThis.aoTabs.splice(iIndex, 0, oTab);
  if (oThis.__oSelectedTab == null) oThis.__oSelectedTab = oTab;
  oThis.refresh();
  this.fireEvent('createTab', oTab);
  return oTab;
}
oPrototype.removeTab = function (oTab) {
  /* TODO */ 
  throw new Error('Unimplemented');
  this.fireEvent('removeTab', oTab);
  oTab.fireEvent('removed', oTab);
  return oTab;
}
oPrototype.selectTab = function (oTab) {                    this.__oSelectedTab = oTab; this.refresh();
                                                            this.fireEvent('selectTab', oTab);
                                                            oTab.fireEvent('selected', oTab);
                                                            return this; }
oPrototype.getOuterElement = function() {                   return this.__doNodes.oOuter; }
oPrototype.getOuterSize = function() {                      return { nWidth: this.__doNodes.oOuter.clientWidth,
                                                                     nHeight: this.__doNodes.oOuter.clientHeight}; }
oPrototype.setSize = function(sWidth, sHeight) {            this.__doNodes.oOuter.style.width = sWidth;
                                                            this.__doNodes.oOuter.style.height = sHeight; this.refresh();
                                                            this.fireEvent('changeSize', this.getOuterSize());
                                                            return this; }
oPrototype.getBorderColor = function() {                    return this.__oBorderColor.copy(); }
oPrototype.setBorderColor = function(oColor) {              this.__oBorderColor = oColor.copy(); this.refresh();
                                                            this.fireEvent('changeBorderColor', oColor);
                                                            return this; }
oPrototype.getBackgroundColor = function() {                return this.__oBackgroundColor.copy(); }
oPrototype.setBackgroundColor = function(oColor) {          this.__oBackgroundColor = oColor.copy(); this.refresh();
                                                            this.fireEvent('changeBackgroundColor', oColor);
                                                            return this; }
oPrototype.getBorderWidth = function () {                   return this.__sBorderWidth; }
oPrototype.setBorderWidth = function (sWidth) {             this.__sBorderWidth = sWidth; this.refresh();
                                                            this.fireEvent('changeBorderWidth', sWidth);
                                                            return this; }
oPrototype.getBorderRadius = function () {                  return this.__sBorderRadius; }
oPrototype.setBorderRadius = function (sRadius) {           this.__sBorderRadius = sRadius; this.refresh();
                                                            this.fireEvent('changeBorderRadius', sRadius);
                                                            return this; }
oPrototype.getBorderStyle = function () {                   return this.__sBorderStyle; }
oPrototype.setBorderStyle = function (sNewStyle) {          this.__sBorderStyle = sNewStyle; this.refresh();
                                                            this.fireEvent('changeBorderStyle', sNewStyle);
                                                            return this; }
oPrototype.refresh = function () {
  var oThis = this;
  var iColumns = oThis.aoTabs.length + oThis.__aoSeparators.length;
  var oSelectedTabBorderColor = oThis.__oSelectedTab.__oBorderColor || oThis.__oBorderColor,
      oSelectedTabBackgroundColor = oThis.__oSelectedTab.__oBackgroundColor || oThis.__oBackgroundColor,
      sStyle = oThis.__sBorderStyle;
  switch (sStyle) {
    case 'solid':   oSelectedTabTopBorderColor = oSelectedTabBorderColor; break;
    case 'inset':   oSelectedTabTopBorderColor = oSelectedTabBorderColor.copy().darken(.25); break;
    case 'outset':  oSelectedTabTopBorderColor = oSelectedTabBorderColor.copy().lighten(.25); break;
    default: throw new Error('Unknown border style "' + sStyle + '"');
  }
  for (var i = 0; i < oThis.__aoSeparators.length; i++) {
    with (oThis.__aoSeparators[i].__doNodes.oTabBodySeparator.style) {
      if (oThis.__bVertical) {
        borderRightWidth = oThis.__sBorderWidth;
        borderRightColor = oSelectedTabTopBorderColor.rgbaCss();
      } else {
        borderBottomWidth = oThis.__sBorderWidth;
        borderBottomColor = oSelectedTabTopBorderColor.rgbaCss();
      }
    }
  }
  for (var i = 0; i < oThis.aoTabs.length; i++) {
    var bSelected = oThis.__oSelectedTab == oThis.aoTabs[i];
    var oBorderColor = oThis.aoTabs[i].__oBorderColor || oThis.__oBorderColor,
        oBackgroundColor = oThis.aoTabs[i].__oBackgroundColor || oThis.__oBackgroundColor;
    __applyBorderStyle(oThis.aoTabs[i].__doNodes.oTabsNode, sStyle, oThis.__sBorderWidth, oThis.__sBorderRadius, oBorderColor);
    with (oThis.aoTabs[i].__doNodes.oTabsNode.style) {
      if (oThis.__bVertical) {
        borderRightWidth = borderTopRightRadius = borderBottomRightRadius = 0;
      } else {
        borderBottomWidth = borderBottomLeftRadius = borderBottomRightRadius = 0;
      }
      backgroundColor = oBackgroundColor.rgbaCss();
      if (bSelected) {
        backgroundImage = 'none';
      } else {
        var sBackgroundShadow = oBackgroundColor.copy().darken(gnUITabShadowDarkness).rgbaCss();
        console.log(backgroundImage = '-webkit-linear-gradient(' + 
            (oThis.__bVertical ? 'right' : 'bottom') + ', ' + 
            sBackgroundShadow + ', ' + 
            backgroundColor + ' ' + oThis.__sShadowSize + ')');
      }
    }
    __applyBorderStyle(oThis.aoTabs[i].__doNodes.oTabBodySeparator, sStyle, oThis.__sBorderWidth, 0, oSelectedTabBorderColor);
    with (oThis.aoTabs[i].__doNodes.oTabBodySeparator.style) {
      if (bSelected) {
        if (oThis.__bVertical) {
          borderLeftWidth = borderRightWidth = 0;
          paddingRight = oThis.__sBorderWidth;
        } else {
          borderTopWidth = borderBottomWidth = 0;
          paddingBottom = oThis.__sBorderWidth;
        }
        backgroundColor = oSelectedTabBackgroundColor.rgbaCss();
      } else {
        if (oThis.__bVertical) {
          borderTopWidth = borderRightWidth = borderBottomWidth = 0;
          paddingRight = 0;
        } else {
          borderLeftWidth = borderRightWidth = borderBottomWidth = 0;
          paddingBottom = 0;
        }
      }
    }
    if (bSelected) {
      __applyBorderStyle(oThis.aoTabs[i].__doNodes.oBody, sStyle, oThis.__sBorderWidth, oThis.__sBorderRadius, oSelectedTabBorderColor);
      with (oThis.aoTabs[i].__doNodes.oBody.style) {
        display = 'table-cell';
        if (oThis.__bVertical) {
          borderLeftWidth = borderTopLeftRadius = borderBottomLeftRadius = 0;
        } else {
          borderTopWidth = borderTopLeftRadius = borderTopRightRadius = 0;
        }
        backgroundColor = oSelectedTabBackgroundColor.rgbaCss();
      }
    } else {
      oThis.aoTabs[i].__doNodes.oBody.style.display = 'none';
    }
    if (oThis.__bVertical) {
      oThis.aoTabs[i].__doNodes.oBody.setAttribute('rowspan', iColumns);
    } else {
      oThis.aoTabs[i].__doNodes.oBody.setAttribute('colspan', iColumns);
    }
  }
}

function __applyBorderStyle(oElement, sStyle, sBorderWidth, sBorderRadius, oColor) {
  var oLighter = oColor.copy().lighten(.25),
      oDarker = oColor.copy().darken(.25);
  switch (sStyle) {
    case 'solid':   var aoColors = [oColor,   oColor,   oColor,   oColor]; break;
    case 'inset':   var aoColors = [oDarker,  oLighter, oLighter, oDarker]; break;
    case 'outset':  var aoColors = [oLighter, oDarker,  oDarker,  oLighter]; break;
    default: throw new Error('Unknown border style "' + sStyle + '"');
  }
  with (oElement.style) {
    borderWidth =       sBorderWidth;
    borderRadius =      sBorderRadius;
    borderTopColor =    aoColors[0].rgbaCss();
    borderRightColor =  aoColors[1].rgbaCss();
    borderBottomColor = aoColors[2].rgbaCss();
    borderLeftColor =   aoColors[3].rgbaCss();
  }
  return this;
}