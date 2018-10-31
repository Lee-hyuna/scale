// EventDrivenStructure modules
(function(doc, exports) {
 "use strict";
 console.log('EventDrivenStructure modules');
 var EventDrivenStructure = function(presetState) {
   this.listeners = {};
   this.state = presetState || {};
 };
 EventDrivenStructure.prototype.on = function(type, callback) {
   if (!this.listeners[type]) {
     this.listeners[type] = callback;
   }
 };
 EventDrivenStructure.prototype.trigger = function(type) {
   if (!this.listeners[type]) {
     return;
   }
   this.listeners[type].call(this, type);
 };
 EventDrivenStructure.prototype.setState = function(type, newState) {
   Object.assign(this.state, newState);
   this.trigger(type);
   console.table(this.state);
 };
 EventDrivenStructure.prototype.renderedBy = function(type) {
   const self = this;
   return function() {
     var args = Array.prototype.slice.call(arguments);
     self.on(type, function() {
       args.forEach(function(fn) {
         fn();
       });
     });
   };
 };
 exports.M = exports.M || {};
 exports.M.EventDrivenStructure = EventDrivenStructure;
})(document, window);