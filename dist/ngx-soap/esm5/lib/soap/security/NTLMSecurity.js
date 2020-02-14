/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
// var _ = require('lodash');
import * as _ from 'lodash';
/**
 * @param {?} username
 * @param {?} password
 * @param {?} domain
 * @param {?} workstation
 * @return {?}
 */
export function NTLMSecurity(username, password, domain, workstation) {
    if (typeof username === "object") {
        this.defaults = username;
        this.defaults.ntlm = true;
    }
    else {
        this.defaults = {
            ntlm: true,
            username: username,
            password: password,
            domain: domain,
            workstation: workstation
        };
    }
}
NTLMSecurity.prototype.addHeaders = (/**
 * @param {?} headers
 * @return {?}
 */
function (headers) {
    headers.Connection = 'keep-alive';
});
NTLMSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    return '';
});
NTLMSecurity.prototype.addOptions = (/**
 * @param {?} options
 * @return {?}
 */
function (options) {
    _.merge(options, this.defaults);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlRMTVNlY3VyaXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9zZWN1cml0eS9OVExNU2VjdXJpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQzs7QUFHYixPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFFNUIsTUFBTSxVQUFVLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXO0lBQ2xFLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUMzQjtTQUFNO1FBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsV0FBVztTQUN6QixDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBRUQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVOzs7O0FBQUcsVUFBVSxPQUFPO0lBQ25ELE9BQU8sQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLENBQUMsQ0FBQSxDQUFDO0FBRUYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLOzs7QUFBRztJQUM3QixPQUFPLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQSxDQUFDO0FBRUYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVOzs7O0FBQUcsVUFBVSxPQUFPO0lBQ25ELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vLyB2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgZnVuY3Rpb24gTlRMTVNlY3VyaXR5KHVzZXJuYW1lLCBwYXNzd29yZCwgZG9tYWluLCB3b3Jrc3RhdGlvbikge1xuICBpZiAodHlwZW9mIHVzZXJuYW1lID09PSBcIm9iamVjdFwiKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHVzZXJuYW1lO1xuICAgIHRoaXMuZGVmYXVsdHMubnRsbSA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIG50bG06IHRydWUsXG4gICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICBkb21haW46IGRvbWFpbixcbiAgICAgIHdvcmtzdGF0aW9uOiB3b3Jrc3RhdGlvblxuICAgIH07XG4gIH1cbn1cblxuTlRMTVNlY3VyaXR5LnByb3RvdHlwZS5hZGRIZWFkZXJzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaGVhZGVycy5Db25uZWN0aW9uID0gJ2tlZXAtYWxpdmUnO1xufTtcblxuTlRMTVNlY3VyaXR5LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICcnO1xufTtcblxuTlRMTVNlY3VyaXR5LnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgXy5tZXJnZShvcHRpb25zLCB0aGlzLmRlZmF1bHRzKTtcbn07XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gTlRMTVNlY3VyaXR5O1xuIl19