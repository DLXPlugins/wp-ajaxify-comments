/*! For license information please see wpac-frontend-idle-timer.js.LICENSE.txt */
(()=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}var t;(t=jQuery).idleTimer=function(i,n){var r;"object"===e(i)?(r=i,i=null):"number"==typeof i&&(r={timeout:i},i=null),n=n||document,r=t.extend({idle:!1,timeout:3e4,events:"mousemove keydown wheel DOMMouseScroll mousewheel mousedown touchstart touchmove MSPointerDown MSPointerMove"},r);var l=t(n),a=l.data("idleTimerObj")||{},o=function(e){var i=t.data(n,"idleTimerObj")||{};i.idle=!i.idle,i.olddate=+new Date;var r=t.Event((i.idle?"idle":"active")+".idleTimer");t(n).trigger(r,[n,t.extend({},i),e])},d=function(e){var i=t.data(n,"idleTimerObj")||{};if(("storage"!==e.type||e.originalEvent.key===i.timerSyncId)&&null==i.remaining){if("mousemove"===e.type){if(e.pageX===i.pageX&&e.pageY===i.pageY)return;if(void 0===e.pageX&&void 0===e.pageY)return;if(+new Date-i.olddate<200)return}clearTimeout(i.tId),i.idle&&o(e),i.lastActive=+new Date,i.pageX=e.pageX,i.pageY=e.pageY,"storage"!==e.type&&i.timerSyncId&&"undefined"!=typeof localStorage&&localStorage.setItem(i.timerSyncId,i.lastActive),i.tId=setTimeout(o,i.timeout)}},u=function(){var e=t.data(n,"idleTimerObj")||{};e.idle=e.idleBackup,e.olddate=+new Date,e.lastActive=e.olddate,e.remaining=null,clearTimeout(e.tId),e.idle||(e.tId=setTimeout(o,e.timeout))};if(null===i&&void 0!==a.idle)return u(),l;if(null===i);else{if(null!==i&&void 0===a.idle)return!1;if("destroy"===i)return function(){var e=t.data(n,"idleTimerObj")||{};clearTimeout(e.tId),l.removeData("idleTimerObj"),l.off("._idleTimer")}(),l;if("pause"===i)return function(){var e=t.data(n,"idleTimerObj")||{};null==e.remaining&&(e.remaining=e.timeout-(+new Date-e.olddate),clearTimeout(e.tId))}(),l;if("resume"===i)return function(){var e=t.data(n,"idleTimerObj")||{};null!=e.remaining&&(e.idle||(e.tId=setTimeout(o,e.remaining)),e.remaining=null)}(),l;if("reset"===i)return u(),l;if("getRemainingTime"===i)return function(){var e=t.data(n,"idleTimerObj")||{};if(e.idle)return 0;if(null!=e.remaining)return e.remaining;var i=e.timeout-(+new Date-e.lastActive);return i<0&&(i=0),i}();if("getElapsedTime"===i)return+new Date-a.olddate;if("getLastActiveTime"===i)return a.lastActive;if("isIdle"===i)return a.idle}return l.on((r.events+" ").split(" ").join("._idleTimer ").trim(),(function(e){d(e)})),r.timerSyncId&&t(window).on("storage",d),(a=t.extend({},{olddate:+new Date,lastActive:+new Date,idle:r.idle,idleBackup:r.idle,timeout:r.timeout,remaining:null,timerSyncId:r.timerSyncId,tId:null,pageX:null,pageY:null})).idle||(a.tId=setTimeout(o,a.timeout)),t.data(n,"idleTimerObj",a),l},t.fn.idleTimer=function(e){return this[0]?t.idleTimer(e,this[0]):this}})();