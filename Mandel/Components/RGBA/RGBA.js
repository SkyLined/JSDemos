function RGBA(nR, nG, nB, nA) {
  if (nR.constructor == String) {
    var oMatch = nR.match(/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?$/i);
    if (!oMatch) throw new Error("Expected \"#RRGGBB[AA]\" as argument");
    nR = parseInt(oMatch[1], 16) / 255;
    nG = parseInt(oMatch[2], 16) / 255;
    nB = parseInt(oMatch[3], 16) / 255;
    nA = oMatch[4] && (parseInt(oMatch[4], 16) / 255);
  }
  this.nR = Math.max(0, Math.min(1, parseFloat(nR)));
  this.nG = Math.max(0, Math.min(1, parseFloat(nG)));
  this.nB = Math.max(0, Math.min(1, parseFloat(nB)));
  this.nA = nA == undefined ? 1 : Math.max(0, Math.min(1, parseFloat(nA)));
  this.__RGB2HSL();
}
RGB = RGBA;
function HSLA(nH, nS, nL, nA) {
  this.nH = parseFloat(nH);
  this.nS = Math.max(0, Math.min(1, parseFloat(nS)));
  this.nL = Math.max(0, Math.min(1, parseFloat(nL)));
  this.nA = nA == undefined ? 1 : Math.max(0, Math.min(1, parseFloat(nA)));
  this.__HSL2RGB();
}
HSL = HSLA;
HSLA.prototype = RGBA.prototype;
var oPrototype = RGBA.prototype;

oPrototype.copy = function() {                    return new RGBA(this.nR, this.nG, this.nB, this.nA); }
oPrototype.__255 = function (nValue) {            return Math.min(255, Math.max(0, Math.floor(nValue * 256))); }
oPrototype.__FF  = function (nValue) {            var iValue = this.__255(nValue);
                                                  return (iValue < 0x10 ? '0': '') + iValue.toString(0x10); }
oPrototype.r255 = function () {                   return this.__255(this.nR); }
oPrototype.g255 = function () {                   return this.__255(this.nG); }
oPrototype.b255 = function () {                   return this.__255(this.nB); }
oPrototype.a255 = function () {                   return this.__255(this.nA); }
oPrototype.rFF = function () {                    return this.__FF(this.nR); }
oPrototype.gFF = function () {                    return this.__FF(this.nG); }
oPrototype.bFF = function () {                    return this.__FF(this.nB); }
oPrototype.aFF = function () {                    return this.__FF(this.nA); }
oPrototype.hexRgbCss = function() {               return '#' + this.rFF() + this.gFF() + this.bFF(); }
oPrototype.hexRgbaCss = function(nA) {            return '#' + this.rFF() + this.gFF() + this.bFF() + this.aFF(); }
oPrototype.rgbCss = function() {                  return 'rgb(' + this.r255()+ ',' + this.g255() + ',' + this.b255() + ')'; }
oPrototype.rgbaCss = function(nA) {               nA = Math.min(1, Math.max(0, nA == undefined ? this.nA : nA));
                                                  return 'rgba(' + this.r255()+ ',' + this.g255() + ',' + this.b255() + ',' + nA + ')'; }
oPrototype.setRed = function(nR) {                this.nR = Math.max(0, Math.min(1, parseFloat(nR)));
                                                  this.__RGB2HSL(); return this; }
oPrototype.setGreen = function(nG) {              this.nG = Math.max(0, Math.min(1, parseFloat(nG)));
                                                  this.__RGB2HSL(); return this; }
oPrototype.setBlue = function(nB) {               this.nB = Math.max(0, Math.min(1, parseFloat(nB)));
                                                  this.__RGB2HSL(); return this; }
oPrototype.setHue = function(nH) {                this.nH = parseFloat(nH);
                                                  this.__HSL2RGB(); return this; }
oPrototype.setSaturation = function(nS) {         this.nS = Math.max(0, Math.min(1, parseFloat(nS)));
                                                  this.__HSL2RGB(); return this; }
oPrototype.setLuminosity = function(nL) {         this.nL = Math.max(0, Math.min(1, parseFloat(nL)));
                                                  this.__HSL2RGB(); return this; }
oPrototype.setOpacity = function(nA) {            this.nA = Math.max(0, Math.min(1, parseFloat(nA)));
                                                  return this; }
oPrototype.lighten = function(nAmount) {          this.nL += (1 - this.nL) * Math.max(0, Math.min(1, parseFloat(nAmount)));
                                                  this.__HSL2RGB(); return this; }
oPrototype.darken = function(nAmount) {           this.nL -= this.nL * Math.max(0, Math.min(1, parseFloat(nAmount)));
                                                  this.__HSL2RGB(); return this; }
oPrototype.toString = function() {                return 'RGBA(#' + this.hexRgbaCss() + '/HSL:' + this.nH + ',' + this.nS + ',' + this.nL + ')'; }

oPrototype.overlay = function(oRGBA2) {
  var nA1 = 1 - oRGBA2.nA, nA2 = oRGBA2.nA;
  this.nR += (oRGBA2.nR - this.nR) * nA2;
  this.nG += (oRGBA2.nG - this.nG) * nA2;
  this.nB += (oRGBA2.nB - this.nB) * nA2;
  this.nA = Math.max(0, Math.min(1, this.nA + nA1 * nA2));
  this.__RGB2HSL();
  return this;
}
oPrototype.mixRGB = function(oRGBA2, nAmount) {
  var nAmount = Math.max(0, Math.min(1, parseFloat(nAmount)));
  this.nR += (oRGBA2.nR - this.nR) * nAmount;
  this.nG += (oRGBA2.nG - this.nG) * nAmount;
  this.nB += (oRGBA2.nB - this.nB) * nAmount;
  this.__RGB2HSL();
  return this;
}

oPrototype.mixRGBA = function(oRGBA2, nAmount) {
  var nAmount = Math.max(0, Math.min(1, parseFloat(nAmount)));
  this.nR += (oRGBA2.nR - this.nR) * nAmount;
  this.nG += (oRGBA2.nG - this.nG) * nAmount;
  this.nB += (oRGBA2.nB - this.nB) * nAmount;
  this.nA += (oRGBA2.nA - this.nA) * nAmount;
  this.__RGB2HSL();
  return this;
}

oPrototype.mixHSL = function(oRGBA2, nAmount) {
  nAmount = Math.max(0, Math.min(1, parseFloat(nAmount)));
  var nAlpha1 = (this.nH * 2 - 1) * Math.PI,
      nAlpha2 = (oRGBA2.nH * 2 - 1) * Math.PI,
      nX1 = Math.cos(nAlpha1) * this.nS, 
      nY1 = Math.sin(nAlpha1) * this.nS,
      nX2 = Math.cos(nAlpha2) * oRGBA2.nS, 
      nY2 = Math.sin(nAlpha2) * oRGBA2.nS,
      nXd = nX2 - nX1,
      nYd = nY2 - nY1,
      nX = nX1 + nXd * nAmount,
      nY = nY1 + nYd * nAmount,
      nLd = oRGBA2.nL - this.nL;
  this.nH = (Math.atan2(nY, nX) / Math.PI + 1) / 2;
  this.nS = Math.sqrt(nX * nX + nY* nY);
  this.nL += nLd * nAmount;
  this.__HSL2RGB();
  return this;
}
oPrototype.mixHSLA = function(oRGBA2, nAmount) {
  nAmount = Math.max(0, Math.min(1, parseFloat(nAmount)));
  var nAd = oRGBA2.nA - this.nA;
  this.nA += (oRGBA2.nA - this.nA) * nAmount;
  return this.mixHSL(oRGBA2, nAmount);
}
oPrototype.mixH = function(oRGBA2, nAmount) {
  nAmount = Math.max(0, Math.min(1, parseFloat(nAmount)));
  var nAlpha1 = (this.nH * 2 - 1) * Math.PI,
      nAlpha2 = (oRGBA2.nH * 2 - 1) * Math.PI,
      nX1 = Math.cos(nAlpha1) * this.nS, 
      nY1 = Math.sin(nAlpha1) * this.nS,
      nX2 = Math.cos(nAlpha2) * oRGBA2.nS, 
      nY2 = Math.sin(nAlpha2) * oRGBA2.nS,
      nXd = nX2 - nX1,
      nYd = nY2 - nY1,
      nX = nX1 + nXd * nAmount,
      nY = nY1 + nYd * nAmount,
      nLd = oRGBA2.nL - this.nL;
  this.nH = (Math.atan2(nY, nX) / Math.PI + 1) / 2;
  this.__HSL2RGB();
  return this;
}
RGBA.fromRGBCircle = function(nAlpha, nR, nG, nB, nA) {
  return new RGBA(
      (1 + Math.sin(nAlpha + nR)) / 2,
      (1 + Math.sin(nAlpha + nG)) / 2,
      (1 + Math.sin(nAlpha + nB)) / 2,
      nA == undefined ? 1 : nA);
}

oPrototype.__RGB2HSL = function() {
  var nMin = Math.min(this.nR, this.nG, this.nB), nMax = Math.max(this.nR, this.nG, this.nB), nC = nMax - nMin;
  this.nL = (nMax + nMin) / 2;
  if (nC == 0) {
//    this.nH = 0; // Keep old value if there was one.
    this.nS = 0;
  } else {
    if (this.nL < 0.5) {
      this.nS = nC / (nMax + nMin);
    } else {
      this.nS = nC / (2 - nMax - nMin);
    }
    if (this.nR == nMax) {
      this.nH = (this.nG - this.nB) / nC;
    } else if (this.nG == nMax) {
      this.nH = (this.nB - this.nR) / nC + 2;
    } else {
      this.nH = (this.nR - this.nG) / nC + 4;
    }
    this.nH = ((this.nH / 6) % 1 + 1) % 1;
  }
}
oPrototype.__HSL2RGB = function() {
  if(this.nL==0) {
    this.nR = this.nG = this.nB = 0;
  } else if(this.nS == 0) {
    this.nR = this.nG = this.nB = this.nL;
  } else {
    var nT2 = this.nL < 0.5 ? this.nL * (1 + this.nS) : this.nL + this.nS - this.nL * this.nS;
    var nT1 = 2 * this.nL - nT2;
    function hueToColor(nT3) {
      nT3 = (nT3 % 1 + 1) % 1;
      if (6 * nT3 < 1) return nT1 + (nT2 - nT1) * nT3 * 6;
      if (2 * nT3 < 1) return nT2;
      if (3 * nT3 < 2) return nT1 + (nT2 - nT1) * (2/3 - nT3) * 6;
                       return nT1;
    }
    this.nR = hueToColor(this.nH + 1/3);
    this.nG = hueToColor(this.nH);
    this.nB = hueToColor(this.nH - 1/3);
  }
}