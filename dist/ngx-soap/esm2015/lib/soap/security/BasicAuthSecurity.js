/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as _ from 'lodash';
import { Buffer } from 'buffer';
/**
 * @param {?} username
 * @param {?} password
 * @param {?} defaults
 * @return {?}
 */
export function BasicAuthSecurity(username, password, defaults) {
    this._username = username;
    this._password = password;
    this.defaults = {};
    _.merge(this.defaults, defaults);
}
BasicAuthSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Authorization = 'Basic ' + new Buffer((this._username + ':' + this._password) || '').toString('base64');
});
BasicAuthSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
BasicAuthSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    _.merge(options, this.defaults);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNBdXRoU2VjdXJpdHkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc29hcC8iLCJzb3VyY2VzIjpbImxpYi9zb2FwL3NlY3VyaXR5L0Jhc2ljQXV0aFNlY3VyaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7Ozs7O0FBRWhDLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVE7SUFDNUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsVUFBVTs7OztBQUFHLFVBQVMsT0FBTztJQUN2RCxPQUFPLENBQUMsYUFBYSxHQUFHLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEgsQ0FBQyxDQUFBLENBQUM7QUFFRixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSzs7O0FBQUc7SUFDbEMsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDLENBQUEsQ0FBQztBQUVGLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxVQUFVOzs7O0FBQUcsVUFBUyxPQUFPO0lBQ3ZELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gJ2J1ZmZlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBCYXNpY0F1dGhTZWN1cml0eSh1c2VybmFtZSwgcGFzc3dvcmQsIGRlZmF1bHRzKSB7XG4gIHRoaXMuX3VzZXJuYW1lID0gdXNlcm5hbWU7XG4gIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG4gIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgXy5tZXJnZSh0aGlzLmRlZmF1bHRzLCBkZWZhdWx0cyk7XG59XG5cbkJhc2ljQXV0aFNlY3VyaXR5LnByb3RvdHlwZS5hZGRIZWFkZXJzID0gZnVuY3Rpb24oaGVhZGVycykge1xuICBoZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmFzaWMgJyArIG5ldyBCdWZmZXIoKHRoaXMuX3VzZXJuYW1lICsgJzonICsgdGhpcy5fcGFzc3dvcmQpIHx8ICcnKS50b1N0cmluZygnYmFzZTY0Jyk7XG59O1xuXG5CYXNpY0F1dGhTZWN1cml0eS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcnO1xufTtcblxuQmFzaWNBdXRoU2VjdXJpdHkucHJvdG90eXBlLmFkZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIF8ubWVyZ2Uob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XG59O1xuIl19