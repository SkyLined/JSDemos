/**
 * Create a PageWorker that can be used to run Tasks in the background using a
 * JavaScript interval. Each time the interval is executed, the PageWorker runs
 * tasks with progress < 1 for a maximum of 10ms before returning. This should
 * give the foreground thread time to run often enough to prevent noticable jank
 * or slowdown of the page.
 */
function PageWorker() {
  var oThis = this;
  oThis.__iTaskRunTime = 10; // ms per interval
  oThis.aoTasks = [];
  oThis.__iInterval = null;
  addEvents(oThis, ['progress', 'finish']);
}
addEventsCode(PageWorker);

/**
 * Add a Task to the PageWorker. If the PageWorker interval was not running, it
 * is started. The interval will continue to run until all tasks reach progress
 * == 1, at which point it is terminated. Adding a new task will start a new
 * interval.
 */
PageWorker.prototype.addTask = function(oTask) {
  var oThis = this;
  oThis.aoTasks.push(oTask);
  if (oThis.__iInterval == null) {
    var oThis = this;
    oThis.__iInterval = setInterval(function () {
      var iStartTime = new Date().valueOf();
      var iTask = 0;
      var oTask = oThis.aoTasks[iTask];
      while (new Date().valueOf() < iStartTime + oThis.__iTaskRunTime) {
        if (oTask.progress < 1) {
          oTask.run(oThis);
        } else if (++iTask == oThis.aoTasks.length) {
          clearInterval(oThis.__iInterval);
          oThis.fireEvent('finish');
          return;
        } else {
          oTask = oThis.aoTasks[iTask];
        }
      }
      oThis.fireEvent('progress');
    }, 0);
  }
};
PageWorker.prototype.cancel = function() {
  var oThis = this;
  if (oThis.__iInterval != null)
      clearInterval(oThis.__iInterval);
};
/**
 * Create a Task with the specified run method. The run method should update
 * the progress property such that it goes smoothly from 0 to 1, reaching the
 * later when the task is completed.
 */
function Task(fRunMethod) {
  var oThis = this;
  oThis.progress = 0;
  oThis.run = fRunMethod;
}
