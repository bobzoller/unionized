// Generated by CoffeeScript 1.6.3
var Factory, Sweatshop, factories, parseArgs, _,
  __slice = [].slice;

_ = require('lodash');

factories = {};

parseArgs = function(args) {
  var attrs, callback;
  switch (args.length) {
    case 1:
      callback = args[0];
      break;
    case 2:
      attrs = args[0], callback = args[1];
  }
  return {
    attrs: attrs,
    callback: callback
  };
};

Factory = (function() {
  function Factory(model, factoryFn) {
    this.model = model != null ? model : Object;
    this.factoryFn = factoryFn;
  }

  Factory.prototype.json = function() {
    var args, attrs, callback, _ref,
      _this = this;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = parseArgs(args), attrs = _ref.attrs, callback = _ref.callback;
    attrs = _.clone(attrs != null ? attrs : {});
    return this.factoryFn.call(attrs, function(err) {
      var result;
      if (err != null) {
        return _.defer(callback, err);
      }
      result = _.merge({}, attrs);
      return _.defer(callback, null, result);
    });
  };

  Factory.prototype.build = function() {
    var args, attrs, callback, _ref,
      _this = this;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = parseArgs(args), attrs = _ref.attrs, callback = _ref.callback;
    return this.json(attrs, function(err, result) {
      if (err != null) {
        return _.defer(callback, err);
      }
      result = Sweatshop.createInstanceOf(_this.model, result);
      return _.defer(callback, null, result);
    });
  };

  Factory.prototype.create = function() {
    var args, attrs, callback, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _ref = parseArgs(args), attrs = _ref.attrs, callback = _ref.callback;
    return this.build(attrs, function(err, result) {
      if (err != null) {
        return _.defer(callback, err);
      }
      return Sweatshop.store(result, callback);
    });
  };

  return Factory;

})();

module.exports = Sweatshop = {
  define: function() {
    var args, factory, factoryFn, model, name;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (typeof args[0] === 'string') {
      name = args.shift();
    }
    switch (args.length) {
      case 1:
        factoryFn = args[0];
        break;
      case 2:
        model = args[0], factoryFn = args[1];
    }
    factory = new Factory(model, factoryFn);
    if (name != null) {
      factories[name] = factory;
    }
    return factory;
  },
  get: function(name) {
    return factories[name] || (function() {
      throw "Unknown factory `" + name + "`";
    })();
  },
  create: function() {
    var args, name, _ref;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = Sweatshop.get(name)).create.apply(_ref, args);
  },
  build: function() {
    var args, name, _ref;
    name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = Sweatshop.get(name)).build.apply(_ref, args);
  },
  createInstanceOf: function(model, attrs) {
    return new model(attrs);
  },
  store: function(model, callback) {
    if (_.isFunction(model.save)) {
      return model.save(callback);
    } else {
      return _.defer(callback, null, model);
    }
  }
};
