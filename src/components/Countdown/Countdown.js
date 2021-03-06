"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeDifference = exports.zeroPad = undefined;

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

/**
 * Pads a given string or number with zeros.
 *
 * @param {any} value Value to zero-pad.
 * @param {number} [length=2] Amount of characters to pad.
 * @returns Left-padded number/string.
 */
var zeroPad = (exports.zeroPad = function zeroPad(value) {
  var length =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (length === 0) return value;
  var strValue = String(value);
  return strValue.length >= length
    ? strValue
    : ("0".repeat(length) + strValue).slice(length * -1);
});

/**
 * Calculates the time difference between a given end date and the current date.
 *
 * @param {Date|string|number} date Date or timestamp representation of the end date.
 * @param {Object} [{ now = Date.now, precision = 0, controlled = false }={}]
 *  {function} [date=Date.now] Alternative function for returning the current date.
 *  {number} [precision=0] The precision on a millisecond basis.
 *  {boolean} [controlled=false] Defines whether the calculated value is already provided as the time difference or not.
 * @param {number} [precision=0] The precision on a millisecond basis.
 * @param {boolean} [controlled=false] Defines whether the calculated value is already provided as the time difference or not.
 * @returns Object that includes details about the time difference.
 */
var getTimeDifference = (exports.getTimeDifference = function getTimeDifference(
  date
) {
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref$now = _ref.now,
    now = _ref$now === undefined ? Date.now : _ref$now,
    _ref$precision = _ref.precision,
    precision = _ref$precision === undefined ? 0 : _ref$precision,
    _ref$controlled = _ref.controlled,
    controlled = _ref$controlled === undefined ? false : _ref$controlled;

  var startDate = typeof date === "string" ? new Date(date) : date;
  var total = parseInt(
    (Math.max(0, controlled ? startDate : startDate - now()) / 1000).toFixed(
      Math.max(0, Math.min(20, precision))
    ) * 1000,
    10
  );

  var seconds = total / 1000;

  return {
    total: total,
    days: Math.floor(seconds / (3600 * 24)),
    hours: Math.floor((seconds / 3600) % 24),
    minutes: Math.floor((seconds / 60) % 60),
    seconds: Math.floor(seconds % 60),
    milliseconds: Number(((seconds % 1) * 1000).toFixed()),
    completed: total <= 0
  };
});

/**
 * A customizable countdown component for React.
 *
 * @export
 * @class Countdown
 * @extends {React.Component}
 */

var Countdown = (function(_React$Component) {
  _inherits(Countdown, _React$Component);

  function Countdown(props) {
    _classCallCheck(this, Countdown);

    var _this = _possibleConstructorReturn(
      this,
      (Countdown.__proto__ || Object.getPrototypeOf(Countdown)).call(
        this,
        props
      )
    );

    _initialiseProps.call(_this);

    var _this$props = _this.props,
      date = _this$props.date,
      now = _this$props.now,
      precision = _this$props.precision,
      controlled = _this$props.controlled;

    _this.mounted = false;
    _this.state = _extends(
      {},
      getTimeDifference(date, {
        now: now,
        precision: precision,
        controlled: controlled
      })
    );
    return _this;
  }

  _createClass(Countdown, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.mounted = true;

        if (!this.props.controlled) {
          this.interval = setInterval(this.tick, this.props.intervalDelay);
        }
      }
    },
    {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var date = nextProps.date,
          now = nextProps.now,
          precision = nextProps.precision,
          controlled = nextProps.controlled;

        this.setDeltaState(
          getTimeDifference(date, {
            now: now,
            precision: precision,
            controlled: controlled
          })
        );
      }
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mounted = false;
        this.clearInterval();
      }
    },
    {
      key: "setDeltaState",
      value: function setDeltaState(delta) {
        if (!this.state.completed && delta.completed) {
          this.clearInterval();

          if (this.props.onComplete) {
            this.props.onComplete(delta);
          }
        }

        if (this.mounted) {
          this.setState(_extends({}, delta));
        }
      }
    },
    {
      key: "getFormattedDelta",
      value: function getFormattedDelta() {
        var _state = this.state,
          days = _state.days,
          hours = _state.hours;
        var _state2 = this.state,
          minutes = _state2.minutes,
          seconds = _state2.seconds;
        var _props = this.props,
          daysInHours = _props.daysInHours,
          zeroPadLength = _props.zeroPadLength;

        if (daysInHours) {
          hours = zeroPad(hours + days * 24, zeroPadLength);
          days = null;
        } else {
          hours = zeroPad(hours, Math.min(2, zeroPadLength));
        }

        return {
          days: days,
          hours: hours,
          minutes: zeroPad(minutes, Math.min(2, zeroPadLength)),
          seconds: zeroPad(seconds, Math.min(2, zeroPadLength))
        };
      }
    },
    {
      key: "clearInterval",
      value: (function(_clearInterval) {
        function clearInterval() {
          return _clearInterval.apply(this, arguments);
        }

        clearInterval.toString = function() {
          return _clearInterval.toString();
        };

        return clearInterval;
      })(function() {
        clearInterval(this.interval);
        delete this.interval;
      })
    },
    {
      key: "render",
      value: function render() {
        var formattedDelta = this.getFormattedDelta();

        if (this.props.renderer) {
          return this.props.renderer(
            _extends({}, this.props, this.state, formattedDelta)
          );
        }

        if (this.state.completed && this.props.children) {
          var computedProps = _extends(
            {},
            this.props,
            this.state,
            formattedDelta
          );
          delete computedProps.children;
          return _react2.default.cloneElement(this.props.children, {
            countdown: computedProps
          });
        } else {
          var days = formattedDelta.days,
            hours = formattedDelta.hours,
            minutes = formattedDelta.minutes,
            seconds = formattedDelta.seconds;

          return _react2.default.createElement(
            "span",
            null,
            days,
            days != null ? ":" : "",
            hours,
            ":",
            minutes,
            ":",
            seconds
          );
        }
      }
    }
  ]);

  return Countdown;
})(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.tick = function() {
    var _props2 = _this2.props,
      date = _props2.date,
      now = _props2.now,
      precision = _props2.precision,
      controlled = _props2.controlled,
      onTick = _props2.onTick;

    var delta = getTimeDifference(date, {
      now: now,
      precision: precision,
      controlled: controlled
    });

    _this2.setDeltaState(_extends({}, delta));

    if (onTick && delta.total > 0) {
      onTick(delta);
    }
  };
};

exports.default = Countdown;

Countdown.propTypes = {
  date: _propTypes2.default.oneOfType([
    _propTypes2.default.instanceOf(Date),
    _propTypes2.default.string,
    _propTypes2.default.number
  ]).isRequired, // eslint-disable-line react/no-unused-prop-types
  daysInHours: _propTypes2.default.bool,
  zeroPadLength: _propTypes2.default.number,
  controlled: _propTypes2.default.bool,
  intervalDelay: _propTypes2.default.number,
  precision: _propTypes2.default.number,
  children: _propTypes2.default.any, // eslint-disable-line react/forbid-prop-types
  renderer: _propTypes2.default.func,
  now: _propTypes2.default.func, // eslint-disable-line react/no-unused-prop-types
  onTick: _propTypes2.default.func,
  onComplete: _propTypes2.default.func
};

Countdown.defaultProps = {
  daysInHours: false,
  zeroPadLength: 2,
  controlled: false,
  intervalDelay: 1000,
  precision: 0,
  children: null
};
