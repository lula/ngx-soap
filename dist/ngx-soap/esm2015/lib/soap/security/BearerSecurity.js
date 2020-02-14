/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
// var _ = require('lodash');
import * as _ from 'lodash';
/**
 * @param {?} token
 * @param {?} defaults
 * @return {?}
 */
export function BearerSecurity(token, defaults) {
    this._token = token;
    this.defaults = {};
    _.merge(this.defaults, defaults);
}
BearerSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Authorization = "Bearer " + this._token;
});
BearerSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
BearerSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    _.merge(options, this.defaults);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmVhcmVyU2VjdXJpdHkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NlY3VyaXR5L0JlYXJlclNlY3VyaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxZQUFZLENBQUM7O0FBR2IsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7OztBQUU1QixNQUFNLFVBQVUsY0FBYyxDQUFDLEtBQUssRUFBRSxRQUFRO0lBQzdDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxVQUFVOzs7O0FBQUcsVUFBUyxPQUFPO0lBQ3JELE9BQU8sQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDakQsQ0FBQyxDQUFBLENBQUM7QUFFRixjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUs7OztBQUFHO0lBQ2hDLE9BQU8sRUFBRSxDQUFDO0FBQ1gsQ0FBQyxDQUFBLENBQUM7QUFFRixjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVU7Ozs7QUFBRyxVQUFTLE9BQU87SUFDcEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBCZWFyZXJTZWN1cml0eSh0b2tlbiwgZGVmYXVsdHMpIHtcblx0dGhpcy5fdG9rZW4gPSB0b2tlbjtcblx0dGhpcy5kZWZhdWx0cyA9IHt9O1xuXHRfLm1lcmdlKHRoaXMuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbn1cblxuQmVhcmVyU2VjdXJpdHkucHJvdG90eXBlLmFkZEhlYWRlcnMgPSBmdW5jdGlvbihoZWFkZXJzKSB7XG5cdGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IFwiQmVhcmVyIFwiICsgdGhpcy5fdG9rZW47XG59O1xuXG5CZWFyZXJTZWN1cml0eS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICcnO1xufTtcblxuQmVhcmVyU2VjdXJpdHkucHJvdG90eXBlLmFkZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIF8ubWVyZ2Uob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XG59O1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IEJlYXJlclNlY3VyaXR5O1xuIl19