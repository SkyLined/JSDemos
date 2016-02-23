var giPopupZIndex = 1, gnPopupFadeTime = .25;
function Popup(oContainer, sTitleHTML, sBodyHTML, oColor) {
  var oThis = this;
  oThis.bOpen = false;
  oThis.__oContainer = oContainer;
  oThis.__nVisibility = 0;
  oThis.__oVisibilityTransitionTimer == null;
  oThis.__oLocation = 'center';
  oThis.__oNodes = createNodes([
    { name: 'shadow=span', 
      styles: {
        zIndex: giPopupZIndex, visibility: 'hidden', position: 'absolute', display: 'inline-block',
        borderRadius: '2em 2em 2em 2em', borderWidth: '2em 1em 1em 1em', borderStyle: 'solid', borderColor: 'transparent',
        margin: '0em -1em -1em 0em', backgroundColor: 'black'
      }
    },
    { name: 'window=span',
      styles: {
        zIndex: giPopupZIndex, visibility: 'hidden', position: 'absolute', display: 'inline-block',
        borderRadius: '2em 2em 2em 2em', borderWidth: '2em 1em 1em 1em', borderStyle: 'solid',
        margin: '-1em -1em -1em -1em', padding: '1em 1em 1em 1em',
        minWidth: '20em', textAlign: 'left', color: 'black', textShadow: '0 0 .2em white'
      },
      captureTargetEvents: {
        'mouseover': function (event) {
          if (!oThis.bOpen) return;
          oThis.__transitionVisibilityTo(1);
        },
        'mouseout': function (event) {
          if (!oThis.bOpen) return;
          oThis.__transitionVisibilityTo(.7);
        }
      },
      children: [
        { name: 'title=span',
          html: sTitleHTML,
          styles: {
            position: 'absolute', display: 'inline-block', overflow: 'hidden', cursor: 'default',
            top: '-2em', left: '-1em', right: '-1em', lineHeight: '2em', paddingLeft: '2em', paddingRight: '2em',
            whiteSpace: 'nowrap', fontVariant: 'small-caps', fontWeight: '900', textOverflow: 'ellipsis'
          },
          captureTargetEvents: {
            'mousedown': function (oEvent) {
              var oStartEventLocation = {'iX': oEvent.pageX, 'iY': oEvent.pageY};
              var oStartWindowLocation = oThis.__getLocation();
              function mouseMoveHandler(oEvent) {
                oThis.setLocation(oStartWindowLocation.iX + oEvent.pageX - oStartEventLocation.iX,
                                  oStartWindowLocation.iY + oEvent.pageY - oStartEventLocation.iY);
                oEvent.preventDefault();
                oEvent.stopPropagation();
                return false;
              }
              function mouseUpHandler(oEvent) {
                oThis.setLocation(oStartWindowLocation.iX + oEvent.pageX - oStartEventLocation.iX,
                                  oStartWindowLocation.iY + oEvent.pageY - oStartEventLocation.iY);
                window.removeEventListener('mousemove', mouseMoveHandler, false);
                window.removeEventListener('mouseup', mouseUpHandler, false);
                oEvent.preventDefault();
                oEvent.stopPropagation();
                return false;
              }
              window.addEventListener('mousemove', mouseMoveHandler, false);
              window.addEventListener('mouseup', mouseUpHandler, false);
              oEvent.preventDefault();
              oEvent.stopPropagation();
              return false;
            }
          },
        },
        { name: 'closeButton=span',
          html: 'X',
          styles: {
            position: 'absolute', display: 'inline-block', overflow: 'hidden', cursor: 'default',
            top: '-2em', right: '1em', width: '2em', lineHeight: '2em',
            textAlign: 'center', fontFamily: 'Courier New, Courier, monospace',  fontWeight: '900' 
          },
          captureTargetEvents: {
            'mouseover': function (oEvent) {
              if (!oThis.bOpen) return;
              oEvent.srcElement.style.color = 'white';
              oEvent.srcElement.style.textShadow  = '0 0 .2em black';
            },
            'mouseout': function (oEvent) {
              if (!oThis.bOpen) return;
              oEvent.srcElement.style.color = 'black';
              oEvent.srcElement.style.textShadow  = '0 0 .2em white';
            },
            'click': function (oEvent) {
              if (!oThis.bOpen) return;
              oThis.close();
              oEvent.stopPropagation();
            }
          },
        },
        { name: 'body=span',
          html: sBodyHTML,
        },
      ]
    },
  ], oContainer);
  oContainer.addEventListener('resize', function(event) {
    oThis.__applyLocation();
  }, false);

  addEvents(oThis, ['open', 'close']);
  oThis.setColor(oColor || new RGBA(.8, .8, .8, .9));
  oThis.__applyLocation();
}

addEventsCode(Popup);

Popup.prototype.__applyOpacity = function () {
  var oThis = this;
  oThis.__oNodes.window.style.opacity = oThis.__nVisibility * oThis.__oColor.nA;
  oThis.__oNodes.shadow.style.opacity = oThis.__nVisibility * oThis.__oColor.nA * .05;
  if (oThis.__nVisibility == 0) {
    oThis.__oNodes.window.style.visibility = 
    oThis.__oNodes.shadow.style.visibility = 'hidden';
  } else {
    oThis.__oNodes.window.style.visibility = 
    oThis.__oNodes.shadow.style.visibility = 'visible';
  }
}
Popup.prototype.__getLocation = function() {
  var oThis = this;
  switch (oThis.__oLocation) {
    case 'center':
      return {'iX': (oThis.__oContainer.clientWidth - oThis.__oNodes.window.offsetWidth) / 2,
              'iY': (oThis.__oContainer.clientHeight - oThis.__oNodes.window.offsetHeight) / 2};
    case 'topleft':
      return {'iX': 0,
              'iY': 0};
    case 'topright':
      return {'iX': (oThis.__oContainer.clientWidth - oThis.__oNodes.window.offsetWidth),
              'iY': 0};
    case 'bottomleft':
      return {'iX': 0,
              'iY': (oThis.__oContainer.clientHeight - oThis.__oNodes.window.offsetHeight)};
    case 'bottomright':
      return {'iX': (oThis.__oContainer.clientWidth - oThis.__oNodes.window.offsetWidth),
              'iY': (oThis.__oContainer.clientHeight - oThis.__oNodes.window.offsetHeight)};
    default:
      return oThis.__oLocation;
  }
}
Popup.prototype.__applyLocation = function() {
  var oThis = this,
      oLocation = oThis.__getLocation();
  with (oThis.__oNodes.window.style) {
    left = oLocation.iX + 'px';
    top = oLocation.iY + 'px';
  }
  with (oThis.__oNodes.shadow.style) {
    left = oLocation.iX + 'px';
    top = oLocation.iY + 'px';
    width = oThis.__oNodes.window.clientWidth + 'px';
    height = oThis.__oNodes.window.clientHeight + 'px';
  }
}
Popup.prototype.__transitionVisibilityTo = function (nTargetVisibility) {
  var oThis = this,
      nStartVisibility = oThis.__nVisibility, 
      nVisiblityChange = nTargetVisibility - nStartVisibility;
  if (oThis.__oVisibilityTransitionTimer != null) {
    oThis.__oVisibilityTransitionTimer.cancel();
  }
  var oThis = this, nFadeDuration = gnPopupFadeTime * Math.abs(nVisiblityChange);
  oThis.__oVisibilityTransitionTimer = new TransitionTimer(nFadeDuration, 60, function (nProgress) {
    oThis.__nVisibility = nStartVisibility + nProgress * nVisiblityChange;
    oThis.__applyOpacity();
  });
  oThis.__oVisibilityTransitionTimer.start();
}
Popup.prototype.setTitleHTML = function (sTitleHTML) {
  var oThis = this,
      iOldWidth = oThis.__oNodes.window.offsetWidth;
  oThis.__oNodes.title.innerHTML = sTitleHTML;
  if (oThis.__oNodes.window.offsetWidth < iOldWidth) {
    oThis.__oNodes.window.style.width = iOldWidth + 'px';
  }
  oThis.__applyLocation();
}
Popup.prototype.setBodyHTML = function (sBodyHTML) {
  var oThis = this,
      iOldWidth = oThis.__oNodes.window.offsetWidth;
  oThis.__oNodes.body.innerHTML = sBodyHTML;
  if (oThis.__oNodes.window.offsetWidth < iOldWidth) {
    oThis.__oNodes.window.style.width = iOldWidth + 'px';
  }
  oThis.__applyLocation();
}
Popup.prototype.getBodyContainer = function () {
  var oThis = this;
  return oThis.__oNodes.body;
}
Popup.prototype.refresh = function() {
  var oThis = this;
  oThis.__applyLocation();
}
Popup.prototype.getColor = function () {
  var oThis = this;
  return oThis.__oColor;
}
Popup.prototype.setColor = function (oColor) {
  var oThis = this;
  oThis.__oColor = oColor;
  with(oThis.__oNodes.window.style) {
    backgroundColor = oThis.__oColor.copy().darken(.05).hexRgbCss();
    borderColor = oThis.__oColor.copy().lighten(.05).hexRgbCss();
  };
  oThis.__applyOpacity();
}
Popup.prototype.close = function () {
  var oThis = this;
  if (oThis.bOpen) {
    oThis.__transitionVisibilityTo(0);
    oThis.bOpen = false;
    oThis.fireEvent('close');
  }
}
Popup.prototype.open = function () {
  var oThis = this;
  if (!oThis.bOpen) {
    oThis.__transitionVisibilityTo(1);
    oThis.bOpen = true;
    oThis.fireEvent('open');
  }
}
Popup.prototype.setLocation = function(iX, iY) {
  var oThis = this;
  if (typeof(iX) == 'string') {
    oThis.__oLocation = iX; // should be 'center', 'topleft', 'topright', 'bottomleft' or 'bottomright'.
  } else {
    oThis.__oLocation = {'iX': parseInt(iX), 'iY': parseInt(iY)};
  }
  oThis.__applyLocation();
}
