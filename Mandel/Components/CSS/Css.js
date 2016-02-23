function cssStringValue(xValue, sDefaultUnit) {
  return typeof(xValue) == 'string' ? xValue : parseFloat(xValue) + sDefaultUnit;
  
}
function cssPixelValue(oElement, sWidth1, sWidth2, sWidth3) {
  var oSpan = createNode({ name: 'span', styles: { display: 'block', width: sWidth1, borderStyle: 'solid' } }, oElement);
  if (sWidth2 !== undefined) oSpan.style.paddingLeft = sWidth2;
  if (sWidth3 !== undefined) oSpan.style.paddingRight = sWidth3;
  oSpan.offsetTop;
  var nWidth = oSpan.clientWidth;
  oElement.removeChild(oSpan);
  return nWidth;
}
cssAddUnitsAsPixels = cssPixelValue;