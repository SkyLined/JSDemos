function ProgressBar(oContainer) {
  var oThis = this;
  oThis.__oContainer = oContainer;
  oThis.__nValue = 0;
  var sWidth = oContainer.clientWidth + 'px',
      sHeight = oContainer.clientHeight + 'px';
  oThis.__doNodes = createNodes([
    { name: 'container=div',
      styles: { position: 'relative', width: sWidth, height: sHeight, padding: 0, margin: 0 },
      children: [
        { name: 'button=button', 
          styles: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 0, margin: 0, padding: 0},
        },
      ]
    }
  ], oContainer);
  addEvents(oThis, ['change']);
}

addEventsCode(ProgressBar);

ProgressBar.prototype.setValue = function(nValue) {
  var oThis = this;
  oThis.__nValue = Math.max(0, Math.min(1, nValue));
  var oButton = oThis.__doNodes.button;
  var iSliderWidth = oThis.__oContainer.clientWidth;
  oThis.__doNodes.button.style.width = (iSliderWidth * oThis.__nValue) + 'px';
  oThis.fireEvent('change', {nValue: oThis.__nValue});
}

ProgressBar.prototype.getValue = function() {
  var oThis = this;
  return oThis.__nValue;
}