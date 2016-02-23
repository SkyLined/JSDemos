function FinalAngleMandelTask(oMandelRenderer) {
  var oThis = this;
  oThis.sDescription = 'Final angle';
  oThis.oMandelRenderer = oMandelRenderer;
  oThis.nWidth = 1 / oMandelRenderer.nZoom;
  oThis.nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.progress = 0;
  oThis.iIndex = 0;
  oThis.iY = 0;
  oThis.nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.iX = 0;
}
FinalAngleMandelTask.prototype.run = function () {
  var oThis = this;
  oThis.setPixel();
  oThis.iX++;
  if (oThis.iX == oThis.oMandelRenderer.oImageData.width) {
    oThis.iX = 0;
    oThis.iY++;
    oThis.nY = oThis.oMandelRenderer.oCenter.y + (oThis.iY / oThis.oMandelRenderer.oImageData.height - 0.5) * oThis.nHeight;
    oThis.progress = oThis.iY / oThis.oMandelRenderer.oImageData.height;
  }
}
FinalAngleMandelTask.prototype.setPixel = function() {
  var oThis = this,
      iIterations = 0,
      nCI = oThis.nY,
      nCR = oThis.oMandelRenderer.oCenter.x + (oThis.iX / oThis.oMandelRenderer.oImageData.width - 0.5) * oThis.nWidth,
      nZI = nCI,
      nZR = nCR;
  while(++iIterations <= oThis.oMandelRenderer.iMaxIterations) {
    var nI2 = nZI * nZI, nR2 = nZR * nZR;
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
  }
  var nDistance = Math.sqrt(nZI * nZI + nZR * nZR);
  var iCheckerBoard = 1 - ((Math.floor(oThis.iX / 10) + Math.floor(oThis.iY / 10)) % 2) / 8;
  var oColor = new RGB(iCheckerBoard, iCheckerBoard, iCheckerBoard);
  if (!isNaN(nDistance) && isFinite(nDistance)) {
    var nAngle = Math.atan2(nZI, nZR);
    var nValue = Math.pow(Math.abs(nAngle / Math.PI), oThis.oMandelRenderer.nColorPower) / 2;
    if (nAngle < 0) nValue = 1 - nValue;
    var nOrder = Math.log(nDistance) / 10;
    if (nOrder < 1) {
      nOpacity = 1;
    } else {
      nOpacity = 1 / nOrder;
    }
    var oMandelbrot = oThis.oMandelRenderer.oColorGradient.getColor((nValue + oThis.oMandelRenderer.nColorBase) % 1).applyOpacity(nOpacity);
    oColor.overlay(oMandelbrot);
  }
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}