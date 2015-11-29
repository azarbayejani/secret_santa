'use strict';

var _ = require('underscore');
  
var filterExceptions = function (exceptions) {
  var ret = {};
  if (typeof exceptions !== "object") {
    return ret; 
  }
  return _.object(_.map(exceptions, function(val, key) {
    if (Array.isArray(val)) {
      return [key, val];
    } else {
      return [key, new Array(val)];
    }
  }));
}

class SecretSanta {
  constructor(people, opts) {
    opts = opts || {};
    this.people = people;
    this.exceptions = filterExceptions(opts.exceptions);
  }

  isValidAssignment(l1,l2) {
    var self = this;
    return _.every(_.zip(l1,l2), function(el) {
      var [a,b] = el;
      return self.exceptions[a] !== b
             && !_.contains(self.exceptions[a],b)
             && a !== b;
    });
  }
  
  assign() {
    var givers = this.people.slice(); 
    var receivers = _.shuffle(this.people);
    while (!this.isValidAssignment(givers,receivers)) {
      receivers = _.shuffle(this.people);
    }
    return _.map(_.zip(givers,receivers), function(el) {
      var [from, to] = el;
      return { from, to };
    });
  }
}

module.exports = SecretSanta;
