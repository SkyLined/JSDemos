var gaoMandelTasks = [
    PuzzleMandelTask, BasicMandelTask, SmoothMandelTask, SmoothDistanceMandelTask, 
    FinalFeatherMandelTask, CombinedFeatherMandelTask, TestMandelTask];

function MandelCanvasRenderer(
    oInteractiveCanvas, nUpdateFrequency, iMandelTask, oColorGradient) {
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
  oThis.iMandelTask = iMandelTask;

  oThis.oColorGradient = oColorGradient;
  oThis.nColorSpeed = 1; oThis.nColorPower = 1; oThis.nColorBase = 0;
  oThis.oCenter = {x:-0.5, y:0}; oThis.nZoom = 1/8;
  oThis.iMaxIterations = 25;
  oThis.oImageData = null;
  oThis.oPageWorker = null;
  oThis.progress = 0;
  addEvents(oThis, ['updateCanvas', 'updateConfig']);
}
addEventsCode(MandelCanvasRenderer);

MandelCanvasRenderer.prototype.getConfig = function () {
  var oThis = this;
  return {
      cs: oThis.nColorSpeed, cp: oThis.nColorPower, cb: oThis.nColorBase,
      x: oThis.oCenter.x, y: oThis.oCenter.y, z: oThis.nZoom,
      i: oThis.iMaxIterations, t: oThis.iMandelTask,
  }
}
MandelCanvasRenderer.prototype.setConfig = function (oConfig) {
  var oThis = this;
  if (oThis.__bStarted) oThis.stop();
  oThis.nColorSpeed = oConfig.cs; oThis.nColorPower = oConfig.cp; oThis.nColorBase = oConfig.cb;
  oThis.oCenter = {x: oConfig.x, y: oConfig.y}; oThis.nZoom = oConfig.z;
  oThis.iMaxIterations = oConfig.i; oThis.iMandelTask = oConfig.t;
  if (oThis.__bStarted) oThis.start();
}

MandelCanvasRenderer.prototype.getStatusHTML = function() {
  var oThis = this;
  return 'Coloring = "' + oThis.oTask.sDescription + '"<br/>' +
    'Center point = (' + oThis.oCenter.x + ', ' + oThis.oCenter.y + ')<br/>' +
    'Zoom level = ' + oThis.nZoom + '<br/>' +
    'Maximum iterations = ' + oThis.iMaxIterations + '<br/>' +
    'Color speed = ' + oThis.nColorSpeed + 
        ', power = ' + oThis.nColorPower + 
        ', base = ' + oThis.nColorBase + '<br/>' +
    'Rendering progress = ' + (Math.floor(oThis.progress * 10000) / 100) + '% complete.<br/>';
};

MandelCanvasRenderer.prototype.stop = function() {
  var oThis = this;
  if (oThis.oPageWorker) {
    oThis.oPageWorker.cancel();
    oThis.oPageWorker = null;
  }
}
MandelCanvasRenderer.prototype.start = function() {
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
  oThis.oTask = new gaoMandelTasks[oThis.iMandelTask](oThis);
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