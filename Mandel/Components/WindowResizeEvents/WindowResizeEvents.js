function redirectWindowResizeEvents(oElement) {
  var oWindow = oElement.ownerDocument.defaultView || oElement.ownerDocument.parentWindow;
  addTargetEventListener(oWindow, 'resize', function (oEvent) {
    var oRedirectedEvent = oElement.ownerDocument.createEvent('HTMLEvents');
    oRedirectedEvent.initEvent('resize', true, true);
    oElement.dispatchEvent(oRedirectedEvent);
    if (oRedirectedEvent.defaultPrevented) oEvent.preventDefault();
    if (oRedirectedEvent.cancelBubble) {
      oEvent.stopPropagation();
      oEvent.cancelBubble = true; // MS
    }
    return oRedirectedEvent.resultValue;
  }, true);
}