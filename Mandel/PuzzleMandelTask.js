var goPuzzleMandelTaskImageData = null;
function PuzzleMandelTask(oMandelRenderer) {
  var oThis = this;
  if (goPuzzleMandelTaskImageData == null) throw new Error('goPuzzleMandelTaskImageData not initialized');
  oThis.sDescription = 'Puzzle pieces mapped using escape time and number of rotations';
  oThis.oMandelRenderer = oMandelRenderer;
  oThis.nWidth = 1 / oMandelRenderer.nZoom;
  oThis.nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.progress = 0;
  oThis.iIndex = 0;
  oThis.iY = 0;
  oThis.nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.iX = 0;
}
PuzzleMandelTask.prototype.run = function () {
  var oThis = this;
  oThis.nEscape = Math.pow(2, 12);
  oThis.setPixel();
  oThis.iX++;
  if (oThis.iX == oThis.oMandelRenderer.oImageData.width) {
    oThis.iX = 0;
    oThis.iY++;
    oThis.nY = oThis.oMandelRenderer.oCenter.y + (oThis.iY / oThis.oMandelRenderer.oImageData.height - 0.5) * oThis.nHeight;
    oThis.progress = oThis.iY / oThis.oMandelRenderer.oImageData.height;
  }
}
PuzzleMandelTask.prototype.setPixel = function() {
  var oThis = this,
      iIterations = 0,
      nCI = oThis.nY,
      nCR = oThis.oMandelRenderer.oCenter.x + (oThis.iX / oThis.oMandelRenderer.oImageData.width - 0.5) * oThis.nWidth,
      nZI = nCI,
      nZR = nCR,
      nI2 = nZI * nZI, 
      nR2 = nZR * nZR,
      d = nI2 + nR2;
  // http://en.wikipedia.org/wiki/Mandelbrot_set#Optimizations
  var tx = (nCR - .25), ty2 = oThis.nY * oThis.nY, q = tx * tx + ty2;
  if (q * (q + tx) < .25 * ty2) {
    iIterations = oThis.oMandelRenderer.iMaxIterations;
  }
  var bPuzzelPieceOdd = false, bParentPuzzelPieceOdd = false;
  while ((d = (nI2 = nZI * nZI) + (nR2 = nZR * nZR)) < oThis.nEscape) {
    if (++iIterations > oThis.oMandelRenderer.iMaxIterations) {
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 0;
      oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
      return;
    }
    bParentPuzzelPieceOdd = bPuzzelPieceOdd;
    bPuzzelPieceOdd = nZI <= 0;
    nZI = nZR * nZI * 2 + nCI; nZR = nR2 - nI2 + nCR;
  }
  var bIterationsOdd = iIterations & 1 == 1;
  var nValue1 = Math.atan2(nZI, nZR) + Math.PI;
  var nX = 1.5 - nValue1 / Math.PI / 2;
  var nY = Math.log(Math.log(Math.sqrt(d)) / Math.log(Math.sqrt(oThis.nEscape))) / Math.log(2);
  var iX = Math.floor(nX * goPuzzleMandelTaskImageData.width) % goPuzzleMandelTaskImageData.width;
  var iY = Math.min(Math.floor(nY * goPuzzleMandelTaskImageData.height), goPuzzleMandelTaskImageData.height - 1);
  var iIndex = (iY * goPuzzleMandelTaskImageData.width + iX) * 4;
  // Puzzle pieces are arranged in bands that follow complex paths going around the center (0,0). The outermost
  // (first) band contains points that "escape" in one itteration and is almost circular. It has only one puzzle
  // piece which is very distorted. The next (second) band is immediately adjacent to this band towards the center
  // and contains points that take two itterations to escape. This band has two less distorted puzzle pieces. The
  // third band contains points that take three itterations to escape and has four puzzle pieces. The fourth contains
  // points that take four itterations and has eight pieces, etc... Each consecutive band contains points one that
  // require one additional itteration to escape compared to the previous and has twice as many puzzle pieces. There
  // is an infinite number of bands but it would take an infinite number of itterations to calculate them all. 
  // Each puzzle pieces is adjacent to two "sibling" puzzle pieces in the same band, except the puzzle pieces in the
  // first and second band: the puzzle piece in the first band has no siblings and the two pieces in the second band
  // have only one sibling.
  // Each puzzle pieces is also adjacent to two "children" puzzle pieces in the next band towards the center and one
  // "parent" in the previous band away from the center, except the puzzle piece in the first band, which has no
  // parent.
  // If we consider the puzzle piece in the outermost band the first piece and the two pieces in the second band the
  // second and third, etc... we can assign a unique number to each puzzle piece. However, we will have to define
  // which puzzle piece is the first in each new band. 
  // The red channel encodes the current puzzle piece.
  // The green channel encodes the sibling puzzle piece in a clockwise going around the circle.
  var oColor = new RGB(0,0,0);
  if (iIterations == oThis.oMandelRenderer.iMaxIterations) {
    iIndex += 2;
  } else {
    var nProgressToInfinity = 1 - (iIterations - 0.5) / oThis.oMandelRenderer.iMaxIterations;
    var nValue = 3 + Math.log(1 + (Math.E - 1) / (1 - nProgressToInfinity));
    nValue *= oThis.oMandelRenderer.nColorSpeed / 5;
    var oColor1 = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
    oColor1.__HSL2RGB();
/*    if (bIterationsOdd) {
      oColor1.lighten(.05);
    } else {
      oColor1.darken(.05);
    }
*/    var oColor2 = oColor1.copy();
/*    if (bPuzzelPieceOdd) {
      oColor1.lighten(.05);
      oColor2.darken(.05);
    } else {
      oColor1.darken(.05);
      oColor2.lighten(.05);
    }
*/    oColor1.applyOpacity(goPuzzleMandelTaskImageData.data[iIndex++] / 255);
    oColor2.applyOpacity(goPuzzleMandelTaskImageData.data[iIndex++] / 255);
    oColor.overlay(oColor2);
    oColor.overlay(oColor1);
  }
  // The blue channel encodes the next puzzle piece away from the center in the next radial.
  if (iIterations <= 1) {
    iIndex++;
  } else {
    var nProgressToInfinity = 1 - (iIterations - 1.5) / oThis.oMandelRenderer.iMaxIterations;
    var nValue = 3 + Math.log(1 + (Math.E - 1) / (1 - nProgressToInfinity));
    nValue *= oThis.oMandelRenderer.nColorSpeed / 5;
    var oColor3 = oThis.oMandelRenderer.oColorGradient.getColor(nValue + oThis.oMandelRenderer.nColorBase);
    oColor3.applyOpacity(goPuzzleMandelTaskImageData.data[iIndex++] / 255);
    if (bIterationsOdd) {
      oColor3.darken(.05);
    } else {
      oColor3.lighten(.05);
    }
    if (bParentPuzzelPieceOdd) {
      oColor3.lighten(.05);
    } else {
      oColor3.darken(.05);
    }
    oColor.overlay(oColor3);
  }
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.r255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.g255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = oColor.b255();
  oThis.oMandelRenderer.oImageData.data[oThis.iIndex++] = 255;
}