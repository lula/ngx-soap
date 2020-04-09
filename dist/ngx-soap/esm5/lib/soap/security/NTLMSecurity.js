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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTlRMTVNlY3VyaXR5LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9zZWN1cml0eS9OVExNU2VjdXJpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVksQ0FBQzs7QUFHYixPQUFPLEtBQUssQ0FBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFFNUIsTUFBTSxVQUFVLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXO0lBQ2xFLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUMzQjtTQUFNO1FBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRztZQUNkLElBQUksRUFBRSxJQUFJO1lBQ1YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsV0FBVztTQUN6QixDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBRUQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPO0lBQ25ELE9BQU8sQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO0lBQzdCLE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBRUYsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPO0lBQ25ELENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8vIHZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOVExNU2VjdXJpdHkodXNlcm5hbWUsIHBhc3N3b3JkLCBkb21haW4sIHdvcmtzdGF0aW9uKSB7XHJcbiAgaWYgKHR5cGVvZiB1c2VybmFtZSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgdGhpcy5kZWZhdWx0cyA9IHVzZXJuYW1lO1xyXG4gICAgdGhpcy5kZWZhdWx0cy5udGxtID0gdHJ1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcclxuICAgICAgbnRsbTogdHJ1ZSxcclxuICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxyXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQsXHJcbiAgICAgIGRvbWFpbjogZG9tYWluLFxyXG4gICAgICB3b3Jrc3RhdGlvbjogd29ya3N0YXRpb25cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5OVExNU2VjdXJpdHkucHJvdG90eXBlLmFkZEhlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xyXG4gIGhlYWRlcnMuQ29ubmVjdGlvbiA9ICdrZWVwLWFsaXZlJztcclxufTtcclxuXHJcbk5UTE1TZWN1cml0eS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuICcnO1xyXG59O1xyXG5cclxuTlRMTVNlY3VyaXR5LnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICBfLm1lcmdlKG9wdGlvbnMsIHRoaXMuZGVmYXVsdHMpO1xyXG59O1xyXG5cclxuLy8gbW9kdWxlLmV4cG9ydHMgPSBOVExNU2VjdXJpdHk7XHJcbiJdfQ==