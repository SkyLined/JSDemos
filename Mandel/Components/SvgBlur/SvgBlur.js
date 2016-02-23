function SvgBlur(oContainer, iBlur, iZIndex, sFilterName) {
  var oThis = this;
  oThis.__oContainer = oContainer;
  oThis.__iBlur = iBlur;
  oThis.__sFilterName = sFilterName || 'SvgBlurBodyFilterName';
  oThis.__oNodes = createNodes([
    { name: 'svg=svg:svg', styles: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
      children: [
        { name: 'filter=svg:filter', attributes: { id: sFilterName},
          children: [
            { name: 'feGaussianBlur=svg:feGaussianBlur', attributes: { in: 'SourceGraphic', stdDeviation: iBlur} },
          ] },
        { name: 'g=svg:g', attributes: { style: 'filter:url(#' + sFilterName + ')' },
          children: [
            { name: 'foreignObject=svg:foreignObject', attributes: { x: 0, y: 0, width: '100%', height: '100%' },
              children: [
                { name: 'html=xhtml:html', styles: { display: 'inline-block', margin: 0, width: '100%', height: '100%' } },
              ] },
          ] },
      ] },
  ], oContainer);
  if (iZIndex) oThis.__oNodes.svg.style.zIndex = iZIndex;
  oThis.documentElement = oThis.__oNodes.html;
}

SvgBlur.prototype.redraw = function () {
  // To work around a bug in WebKit where content is not redrawn if a filter is applied, we remove the filter, then
  // trigger a redraw by accessing the offsetTop property and re-apply the filter:
  var oThis = this;
  oThis.__oNodes.filter.setAttribute('id', oThis.__sFilterName);
  oThis.__oNodes.g.style.filter = '';
  oThis.__oNodes.g.offsetTop;
  oThis.__oNodes.g.setAttribute('style', 'filter:url(#' + oThis.__sFilterName + ')');
  return oThis;
}
SvgBlur.prototype.setBlur = function (iBlur) {
  var oThis = this;
  oThis.__iBlur = iBlur;
  oThis.__oNodes.feGaussianBlur.setAttribute('stdDeviation', iBlur);
}