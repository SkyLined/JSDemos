var gaoMandelRendererGetDataOptions = [
    BasicMandelGetData];

function MandelRenderer(oInteractiveCanvas, nUpdateFrequency, iGetDataOption, oColorGradient) {
  var oThis = this;
  oThis.__bStarted = false;
  oInteractiveCanvas.addEventListener('resize', function (oInteractiveCanvas, oDetails) {
    if (oThis.__bStarted) {
      oThis.stop();
      oThis.start();
    }
  });
  oInteractiveCanvas.addEventListener('click', function (oInteractiveCanvas, oDetails) {
    oThis.stop();
    var nWidth = 1 / oThis.nZoom, nHeight = 1 / oThis.nZoom / oInteractiveCanvas.nAspectRatio;
    oThis.oCenter.x += (oDetails.nX - 0.5) * nWidth, oThis.oCenter.y += (oDetails.nY - 0.5) * nHeight;
    oThis.fireEvent('updateConfig', oThis.getConfig());
    oThis.start();
  });
  oInteractiveCanvas.addEventListener('mousewheel', function (oInteractiveCanvas, oDetails) {
    var bScrollDown = oDetails.iWheelDelta < 0;
    if (!oDetails.bAlt && !oDetails.bCtrl && !oDetails.bShift) {
      oThis.stop();
      var iChange = 2;
      if (bScrollDown) {
        // scroll down = zoom out:
        oThis.nZoom /= iChange;
      } else {
        // scroll up = zoom in:
        oThis.nZoom *= iChange;
        // We also modify the center when we zoom in:
      };
      oThis.fireEvent('updateConfig', oThis.getConfig());
      oThis.start();
    } else if (oDetails.bAlt && !oDetails.bCtrl && !oDetails.bShift) {
      oThis.stop();
      var iChange = Math.ceil(oThis.iMaxIterations / 10);
      if (bScrollDown) {
        // alt + scroll down = less iterations:
        oThis.iMaxIterations = Math.max(1, oThis.iMaxIterations - iChange);
      } else {
        // alt + scroll up = ore iterations:
        oThis.iMaxIterations += iChange;
      }
      oThis.fireEvent('updateConfig', oThis.getConfig());
      oThis.start();
    } else if (!oDetails.bAlt && !oDetails.bCtrl && oDetails.bShift) {
      oThis.stop();
      var iChange = 1.01;
      if (bScrollDown) {
        // shift + scroll down = less color rotation:
        oThis.nColorSpeed /= iChange;
      } else {
        // shift + scroll up = ore iterations:
        oThis.nColorSpeed *= iChange;
      }
      oThis.fireEvent('updateConfig', oThis.getConfig());
      oThis.start();
    }
  });
  oThis.oInteractiveCanvas = oInteractiveCanvas;
  oThis.nUpdateFrequency = nUpdateFrequency;
  oThis.iGetDataOption = iGetDataOption;

  oThis.oMandelColor = new MandelColor(oColorGradient);
  oThis.oCenter = {x:-0.5, y:0}; oThis.nZoom = 1/8;
  oThis.iMaxIterations = 25;
  oThis.oImageData = null;
  oThis.oPageWorker = null;
  oThis.progress = 0;
  addEvents(oThis, ['updateCanvas', 'updateConfig']);
}
addEventsCode(MandelRenderer);

MandelRenderer.prototype.getConfig = function () {
  var oThis = this;
  return {
      x: oThis.oCenter.x, y: oThis.oCenter.y, z: oThis.nZoom,
      i: oThis.iMaxIterations, t: oThis.iGetDataOption,
      c: oThis.oMandelColor.serialize(),
  }
}
MandelRenderer.prototype.setConfig = function (oConfig) {
  var oThis = this;
  if (oThis.__bStarted) oThis.stop();
  oThis.oCenter = {x: oConfig.x, y: oConfig.y}; oThis.nZoom = oConfig.z;
  oThis.iMaxIterations = oConfig.i; oThis.iGetDataOption = oConfig.t;
  oThis.oMandelColor.deserialize(oConfig.c);
  if (oThis.__bStarted) oThis.start();
}

MandelRenderer.prototype.getStatusHTML = function() {
  var oThis = this;
  return 'Coloring = "' + gaoMandelRendererGetDataOptions[oThis.iGetDataOption].sDescription + '"<br/>' +
    'Center point = (' + oThis.oCenter.x + ', ' + oThis.oCenter.y + ')<br/>' +
    'Zoom level = ' + oThis.nZoom + '<br/>' +
    'Maximum iterations = ' + oThis.iMaxIterations + '<br/>' +
    'Color speed = ' + oThis.oMandelColor.nColorSpeed + 
        ', power = ' + oThis.oMandelColor.nColorPower + 
        ', base = ' + oThis.oMandelColor.nColorBase + '<br/>' +
    'Rendering progress = ' + (Math.floor(oThis.progress * 10000) / 100) + '% complete.<br/>';
};

MandelRenderer.prototype.stop = function() {
  var oThis = this;
  if (oThis.oPageWorker) {
    oThis.oPageWorker.cancel();
    oThis.oPageWorker = null;
  }
}
MandelRenderer.prototype.start = function() {
  var oThis = this;
  oThis.__bStarted = true;
  if (oThis.oPageWorker) oThis.oPageWorker.cancel();
  oThis.progress = 0;
  oThis.oPageWorker = new PageWorker();
  var oContext = oThis.oInteractiveCanvas.getContext2d();
  oContext.fillStyle = 'rgba(127,127,127,0.5);';
  oContext.fillRect(0, 0, oThis.oInteractiveCanvas.width, oThis.oInteractiveCanvas.height);
  oThis.oImageData = oContext.getImageData(0, 0, oThis.oInteractiveCanvas.width, oThis.oInteractiveCanvas.height);
  var iLastShowTime = new Date().valueOf();
  oThis.oTask = new MandelRendererTask(oThis, oThis.oMandelColor, gaoMandelRendererGetDataOptions[oThis.iGetDataOption]);
  var oThis = this;
  oThis.oPageWorker.addEventListener('progress', function() {
    oThis.progress = oThis.oTask.progress;
    var iShowTime = new Date().valueOf();
    if (iShowTime >= iLastShowTime + 1000 / oThis.nUpdateFrequency) {
      oContext.putImageData(oThis.oImageData, 0, 0);
      oThis.fireEvent('updateCanvas');
      iLastShowTime = iShowTime;
    }
  });
  oThis.oPageWorker.addEventListener('finish', function() {
    oThis.progress = oThis.oTask.progress;
    oContext.putImageData(oThis.oImageData, 0, 0);
    oThis.oPageWorker = null;
    oThis.fireEvent('updateCanvas');
  });
  oThis.oPageWorker.addTask(oThis.oTask);
}

function MandelRendererTask(oMandelRenderer, oMandelColor, fGetData) {
  var oThis = this;
  oThis.__oMandelRenderer = oMandelRenderer;
  oThis.__oMandelColor = oMandelColor;
  oThis.__fGetData = fGetData;
  oThis.__nEscape = Math.pow(2, 12);
  oThis.__nWidth = 1 / oMandelRenderer.nZoom;
  oThis.__nHeight = oMandelRenderer.oImageData.height / (oMandelRenderer.nZoom * oMandelRenderer.oImageData.width);
  oThis.__iIndex = 0;
  oThis.__iX = 0; oThis.__iY = 0;
  oThis.__nY = oMandelRenderer.oCenter.y - oThis.nHeight / 2;
  oThis.progress = 0;
}
MandelRendererTask.prototype.run = function () {
  var oThis = this;
  var nX = oThis.__oMandelRenderer.oCenter.x + (oThis.__iX / oThis.__oMandelRenderer.oImageData.width - 0.5) * oThis.__nWidth;
  var nBackgroundGreyScale = 1 - ((Math.floor(oThis.__iX / 10) + Math.floor(oThis.__iY / 10)) % 2) / 8;
  var oData = oThis.__fGetData(nX, oThis.__nY, oThis.__oMandelRenderer.iMaxIterations, oThis.__oMandelRenderer);
  var oColor = new RGBA(nBackgroundGreyScale, nBackgroundGreyScale, nBackgroundGreyScale, 1);
  switch (oData.sValueType) {
    case 'none':
      break;
    case 'angle':
      oColor.overlay(oThis.__oMandelColor.getAngleColor(oData.nValue, oData.nOpacity));
      break;
    case 'distance':
      oColor.overlay(oThis.__oMandelColor.getDistanceColor(oData.nValue, oData.nOpacity));
      break;
    default:
      throw new Error('Unknown value type "' + oData.sValueType + '"');
  }
  oThis.__oMandelRenderer.oImageData.data[oThis.__iIndex++] = oColor.r255();
  oThis.__oMandelRenderer.oImageData.data[oThis.__iIndex++] = oColor.g255();
  oThis.__oMandelRenderer.oImageData.data[oThis.__iIndex++] = oColor.b255();
  oThis.__oMandelRenderer.oImageData.data[oThis.__iIndex++] = 255;

  oThis.__iX++;
  if (oThis.__iX == oThis.__oMandelRenderer.oImageData.width) {
    oThis.__iX = 0;
    oThis.__iY++;
    oThis.__nY = oThis.__oMandelRenderer.oCenter.y + (oThis.__iY / oThis.__oMandelRenderer.oImageData.height - 0.5) * oThis.__nHeight;
    oThis.progress = oThis.__iY / oThis.__oMandelRenderer.oImageData.height;
  }
}

function MandelColor(oColorGradient) {
  var oThis = this;
  oThis.__oColorGradient = oColorGradient;
  oThis.nColorSpeed = 1;
  oThis.nColorPower = 1;
  oThis.nColorBase = 0;
}

MandelColor.prototype.serialize = function() {
  var oThis = this;
  return oThis.nColorSpeed + ',' + oThis.nColorPower + ',' + oThis.nColorBase;
}
MandelColor.prototype.deserialize = function(sData) {
  var oThis = this;
  var asData = sData.split(',');
  if (asData.length != 3) throw new Error('Syntax error in serialized MandelColor: "' + sData + '"');
  var nColorSpeed = parseFloat(asData[0]), nColorPower = parseFloat(asData[1]), nColorBase = parseFloat(asData[2]);
  if (isNaN(nColorSpeed) || isNaN(nColorPower) || isNaN(nColorBase))
      throw new Error('Syntax error in serialized MandelColor: "' + sData + '"');
  oThis.nColorSpeed = nColorSpeed; oThis.nColorPower = nColorPower; oThis.nColorBase = nColorBase;
}
MandelColor.prototype.getAngleColor = function(nProgress, nOpacity) {
  var oThis = this;
  var oColor = oThis.__oColorGradient.getColor(Math.pow(nProgress, oThis.nColorPower) + oThis.nColorBase);
  oColor.nA *= nOpacity;
  return oColor;
}
MandelColor.prototype.getDistanceColor = function(nProgress, nOpacity) {
  var oThis = this;
  var oColor = oThis.__oColorGradient.getColor(nProgress * oThis.nColorSpeed + oThis.nColorBase);
  oColor.nA *= nOpacity;
  return oColor;
}

