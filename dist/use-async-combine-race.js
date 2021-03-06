"use strict";

require("core-js/modules/es.array.every");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAsyncCombineRace = void 0;

require("regenerator-runtime/runtime");

var _react = require("react");

var _useAsyncTask = require("./use-async-task");

var _utils = require("./utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var useAsyncCombineRace = function useAsyncCombineRace() {
  for (var _len = arguments.length, asyncTasks = new Array(_len), _key = 0; _key < _len; _key++) {
    asyncTasks[_key] = arguments[_key];
  }

  var memoAsyncTasks = (0, _utils.useMemoList)(asyncTasks, function (a, b) {
    return a.start === b.start;
  });
  var task = (0, _useAsyncTask.useAsyncTask)((0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(abortController) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              abortController.signal.addEventListener('abort', function () {
                memoAsyncTasks.forEach(function (asyncTask) {
                  asyncTask.abort();
                });
              }); // start everything

              return _context.abrupt("return", Promise.all(memoAsyncTasks.map(function (asyncTask) {
                return asyncTask.start();
              })));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [memoAsyncTasks]));
  var finishedIndex = asyncTasks.findIndex(function (_ref2) {
    var pending = _ref2.pending;
    return !pending;
  });
  (0, _react.useEffect)(function () {
    // if there's one task finished, abort all the others
    if (finishedIndex >= 0) {
      asyncTasks.forEach(function (asyncTask, i) {
        if (i !== finishedIndex) {
          asyncTask.abort();
        }
      });
    }
  });
  var taskAborted = asyncTasks.every(function (_ref3) {
    var aborted = _ref3.aborted;
    return aborted;
  });
  var taskPending = asyncTasks.every(function (_ref4) {
    var pending = _ref4.pending;
    return pending;
  });
  var taskError = asyncTasks.find(function (_ref5) {
    var error = _ref5.error;
    return error;
  });
  var taskErrorAll = (0, _utils.useMemoList)(asyncTasks.map(function (_ref6) {
    var error = _ref6.error;
    return error;
  }));
  var taskResult = (0, _utils.useMemoList)(asyncTasks.map(function (_ref7) {
    var result = _ref7.result;
    return result;
  }));
  return (0, _react.useMemo)(function () {
    return {
      start: task.start,
      abort: task.abort,
      started: task.started,
      aborted: taskAborted,
      pending: taskPending,
      error: taskError,
      errorAll: taskErrorAll,
      result: taskPending ? null : taskResult
    };
  }, [task.start, task.abort, task.started, taskAborted, taskPending, taskError, taskErrorAll, taskResult]);
};

exports.useAsyncCombineRace = useAsyncCombineRace;