/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
NTLMSecurity.prototype.addHeaders = function (headers) {
    headers.Connection = 'keep-alive';
};
NTLMSecurity.prototype.toXML = function () {
    return '';
};
NTLMSecurity.prototype.addOptions = function (options) {
    _.merge(options, this.defaults);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlRMTVNlY3VyaXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9zZWN1cml0eS9OVExNU2VjdXJpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQzs7QUFHYixPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFFNUIsTUFBTSxVQUFVLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXO0lBQ2xFLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUMzQjtTQUFNO1FBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsV0FBVztTQUN6QixDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBRUQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPO0lBQ25ELE9BQU8sQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO0lBQzdCLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPO0lBQ25ELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLy8gdmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGZ1bmN0aW9uIE5UTE1TZWN1cml0eSh1c2VybmFtZSwgcGFzc3dvcmQsIGRvbWFpbiwgd29ya3N0YXRpb24pIHtcbiAgaWYgKHR5cGVvZiB1c2VybmFtZSA9PT0gXCJvYmplY3RcIikge1xuICAgIHRoaXMuZGVmYXVsdHMgPSB1c2VybmFtZTtcbiAgICB0aGlzLmRlZmF1bHRzLm50bG0gPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICBudGxtOiB0cnVlLFxuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICB3b3Jrc3RhdGlvbjogd29ya3N0YXRpb25cbiAgICB9O1xuICB9XG59XG5cbk5UTE1TZWN1cml0eS5wcm90b3R5cGUuYWRkSGVhZGVycyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gIGhlYWRlcnMuQ29ubmVjdGlvbiA9ICdrZWVwLWFsaXZlJztcbn07XG5cbk5UTE1TZWN1cml0eS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnJztcbn07XG5cbk5UTE1TZWN1cml0eS5wcm90b3R5cGUuYWRkT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIF8ubWVyZ2Uob3B0aW9ucywgdGhpcy5kZWZhdWx0cyk7XG59O1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IE5UTE1TZWN1cml0eTtcbiJdfQ==