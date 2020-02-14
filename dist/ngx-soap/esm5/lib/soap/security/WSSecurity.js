/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
"use strict";
// var crypto = require('crypto');
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
// var passwordDigest = require('../utils').passwordDigest;
import { passwordDigest } from '../utils';
/** @type {?} */
var validPasswordTypes = ['PasswordDigest', 'PasswordText'];
/**
 * @param {?} username
 * @param {?} password
 * @param {?} options
 * @return {?}
 */
export function WSSecurity(username, password, options) {
    options = options || {};
    this._username = username;
    this._password = password;
    //must account for backward compatibility for passwordType String param as well as object options defaults: passwordType = 'PasswordText', hasTimeStamp = true   
    if (typeof options === 'string') {
        this._passwordType = options ? options : 'PasswordText';
        options = {};
    }
    else {
        this._passwordType = options.passwordType ? options.passwordType : 'PasswordText';
    }
    if (validPasswordTypes.indexOf(this._passwordType) === -1) {
        this._passwordType = 'PasswordText';
    }
    this._hasTimeStamp = options.hasTimeStamp || typeof options.hasTimeStamp === 'boolean' ? !!options.hasTimeStamp : true;
    /*jshint eqnull:true */
    if (options.hasNonce != null) {
        this._hasNonce = !!options.hasNonce;
    }
    this._hasTokenCreated = options.hasTokenCreated || typeof options.hasTokenCreated === 'boolean' ? !!options.hasTokenCreated : true;
    if (options.actor != null) {
        this._actor = options.actor;
    }
    if (options.mustUnderstand != null) {
        this._mustUnderstand = !!options.mustUnderstand;
    }
}
WSSecurity.prototype.toXML = (/**
 * @return {?}
 */
function () {
    // avoid dependency on date formatting libraries
    /**
     * @param {?} d
     * @return {?}
     */
    function getDate(d) {
        /**
         * @param {?} n
         * @return {?}
         */
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate()) + 'T'
            + pad(d.getUTCHours()) + ':'
            + pad(d.getUTCMinutes()) + ':'
            + pad(d.getUTCSeconds()) + 'Z';
    }
    /** @type {?} */
    var now = new Date();
    /** @type {?} */
    var created = getDate(now);
    /** @type {?} */
    var timeStampXml = '';
    if (this._hasTimeStamp) {
        /** @type {?} */
        var expires = getDate(new Date(now.getTime() + (1000 * 600)));
        timeStampXml = "<wsu:Timestamp wsu:Id=\"Timestamp-" + created + "\">" +
            "<wsu:Created>" + created + "</wsu:Created>" +
            "<wsu:Expires>" + expires + "</wsu:Expires>" +
            "</wsu:Timestamp>";
    }
    /** @type {?} */
    var password;
    /** @type {?} */
    var nonce;
    if (this._hasNonce || this._passwordType !== 'PasswordText') {
        // nonce = base64 ( sha1 ( created + random ) )
        // var nHash = crypto.createHash('sha1');
        // nHash.update(created + Math.random());
        // nonce = nHash.digest('base64');
        nonce = Base64.stringify(sha1(created + Math.random(), ''));
    }
    if (this._passwordType === 'PasswordText') {
        password = "<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">" + this._password + "</wsse:Password>";
        if (nonce) {
            password += "<wsse:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">" + nonce + "</wsse:Nonce>";
        }
    }
    else {
        password = "<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">" + passwordDigest(nonce, created, this._password) + "</wsse:Password>" +
            "<wsse:Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">" + nonce + "</wsse:Nonce>";
    }
    return "<wsse:Security " + (this._actor ? "soap:actor=\"" + this._actor + "\" " : "") +
        (this._mustUnderstand ? "soap:mustUnderstand=\"1\" " : "") +
        "xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" +
        timeStampXml +
        "<wsse:UsernameToken xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\" wsu:Id=\"SecurityToken-" + created + "\">" +
        "<wsse:Username>" + this._username + "</wsse:Username>" +
        password +
        (this._hasTokenCreated ? "<wsu:Created>" + created + "</wsu:Created>" : "") +
        "</wsse:UsernameToken>" +
        "</wsse:Security>";
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NTZWN1cml0eS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc2VjdXJpdHkvV1NTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsWUFBWSxDQUFDOztBQUdiLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sTUFBTSxNQUFNLHNCQUFzQixDQUFDOztBQUcxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDOztJQUV0QyxrQkFBa0IsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQzs7Ozs7OztBQUUzRCxNQUFNLFVBQVUsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUNwRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixpS0FBaUs7SUFDakssSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3hELE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDZDtTQUFNO1FBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDbkY7SUFFRCxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUM7S0FDckM7SUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxP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OEgsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO1NBQ3RLO0tBQ0Y7U0FBTTtRQUNMLFFBQVEsR0FBRyw0SEFBNEgsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsa0JBQWtCO1lBQzNNLDhIQUE4SCxHQUFHLEtBQUssR0FBRyxlQUFlLENBQUM7S0FDNUo7SUFFRCxPQUFPLGlCQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkYsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELG9NQUFvTTtRQUNwTSxZQUFZO1FBQ1osOElBQThJLEdBQUcsT0FBTyxHQUFHLEtBQUs7UUFDaEssaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxrQkFBa0I7UUFDdkQsUUFBUTtRQUNSLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsT0FBTyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsdUJBQXVCO1FBQ3ZCLGtCQUFrQixDQUFDO0FBQ3ZCLENBQUMsQ0FBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbmltcG9ydCBzaGExIGZyb20gJ2NyeXB0by1qcy9zaGExJztcbmltcG9ydCBCYXNlNjQgZnJvbSAnY3J5cHRvLWpzL2VuYy1iYXNlNjQnO1xuXG4vLyB2YXIgcGFzc3dvcmREaWdlc3QgPSByZXF1aXJlKCcuLi91dGlscycpLnBhc3N3b3JkRGlnZXN0O1xuaW1wb3J0IHsgcGFzc3dvcmREaWdlc3QgfSBmcm9tICcuLi91dGlscyc7XG5cbnZhciB2YWxpZFBhc3N3b3JkVHlwZXMgPSBbJ1Bhc3N3b3JkRGlnZXN0JywgJ1Bhc3N3b3JkVGV4dCddO1xuXG5leHBvcnQgZnVuY3Rpb24gV1NTZWN1cml0eSh1c2VybmFtZSwgcGFzc3dvcmQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHRoaXMuX3VzZXJuYW1lID0gdXNlcm5hbWU7XG4gIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG4gIC8vbXVzdCBhY2NvdW50IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IGZvciBwYXNzd29yZFR5cGUgU3RyaW5nIHBhcmFtIGFzIHdlbGwgYXMgb2JqZWN0IG9wdGlvbnMgZGVmYXVsdHM6IHBhc3N3b3JkVHlwZSA9ICdQYXNzd29yZFRleHQnLCBoYXNUaW1lU3RhbXAgPSB0cnVlICAgXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICB0aGlzLl9wYXNzd29yZFR5cGUgPSBvcHRpb25zID8gb3B0aW9ucyA6ICdQYXNzd29yZFRleHQnO1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9wYXNzd29yZFR5cGUgPSBvcHRpb25zLnBhc3N3b3JkVHlwZSA/IG9wdGlvbnMucGFzc3dvcmRUeXBlIDogJ1Bhc3N3b3JkVGV4dCc7XG4gIH1cblxuICBpZiAodmFsaWRQYXNzd29yZFR5cGVzLmluZGV4T2YodGhpcy5fcGFzc3dvcmRUeXBlKSA9PT0gLTEpIHtcbiAgICB0aGlzLl9wYXNzd29yZFR5cGUgPSAnUGFzc3dvcmRUZXh0JztcbiAgfVxuXG4gIHRoaXMuX2hhc1RpbWVTdGFtcCA9IG9wdGlvbnMuaGFzVGltZVN0YW1wIHx8IHR5cGVvZiBvcHRpb25zLmhhc1RpbWVTdGFtcCA9PT0gJ2Jvb2xlYW4nID8gISFvcHRpb25zLmhhc1RpbWVTdGFtcCA6IHRydWU7XG4gIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gIGlmIChvcHRpb25zLmhhc05vbmNlICE9IG51bGwpIHtcbiAgICB0aGlzLl9oYXNOb25jZSA9ICEhb3B0aW9ucy5oYXNOb25jZTtcbiAgfVxuICB0aGlzLl9oYXNUb2tlbkNyZWF0ZWQgPSBvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCB8fCB0eXBlb2Ygb3B0aW9ucy5oYXNUb2tlbkNyZWF0ZWQgPT09ICdib29sZWFuJyA/ICEhb3B0aW9ucy5oYXNUb2tlbkNyZWF0ZWQgOiB0cnVlO1xuICBpZiAob3B0aW9ucy5hY3RvciAhPSBudWxsKSB7XG4gICAgdGhpcy5fYWN0b3IgPSBvcHRpb25zLmFjdG9yO1xuICB9XG4gIGlmIChvcHRpb25zLm11c3RVbmRlcnN0YW5kICE9IG51bGwpIHtcbiAgICB0aGlzLl9tdXN0VW5kZXJzdGFuZCA9ICEhb3B0aW9ucy5tdXN0VW5kZXJzdGFuZDtcbiAgfVxufVxuXG5XU1NlY3VyaXR5LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uKCkge1xuICAvLyBhdm9pZCBkZXBlbmRlbmN5IG9uIGRhdGUgZm9ybWF0dGluZyBsaWJyYXJpZXNcbiAgZnVuY3Rpb24gZ2V0RGF0ZShkKSB7XG4gICAgZnVuY3Rpb24gcGFkKG4pIHtcbiAgICAgIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuIDogbjtcbiAgICB9XG4gICAgcmV0dXJuIGQuZ2V0VVRDRnVsbFllYXIoKSArICctJ1xuICAgICAgKyBwYWQoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLSdcbiAgICAgICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArICdUJ1xuICAgICAgKyBwYWQoZC5nZXRVVENIb3VycygpKSArICc6J1xuICAgICAgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonXG4gICAgICArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgKyAnWic7XG4gIH1cbiAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gIHZhciBjcmVhdGVkID0gZ2V0RGF0ZShub3cpO1xuICB2YXIgdGltZVN0YW1wWG1sID0gJyc7XG4gIGlmICh0aGlzLl9oYXNUaW1lU3RhbXApIHtcbiAgICB2YXIgZXhwaXJlcyA9IGdldERhdGUoIG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTAwMCAqIDYwMCkpICk7XG4gICAgdGltZVN0YW1wWG1sID0gXCI8d3N1OlRpbWVzdGFtcCB3c3U6SWQ9XFxcIlRpbWVzdGFtcC1cIitjcmVhdGVkK1wiXFxcIj5cIiArXG4gICAgICBcIjx3c3U6Q3JlYXRlZD5cIitjcmVhdGVkK1wiPC93c3U6Q3JlYXRlZD5cIiArXG4gICAgICBcIjx3c3U6RXhwaXJlcz5cIitleHBpcmVzK1wiPC93c3U6RXhwaXJlcz5cIiArXG4gICAgICBcIjwvd3N1OlRpbWVzdGFtcD5cIjtcbiAgfVxuXG4gIHZhciBwYXNzd29yZCwgbm9uY2U7XG4gIGlmICh0aGlzLl9oYXNOb25jZSB8fCB0aGlzLl9wYXNzd29yZFR5cGUgIT09ICdQYXNzd29yZFRleHQnKSB7XG4gICAgLy8gbm9uY2UgPSBiYXNlNjQgKCBzaGExICggY3JlYXRlZCArIHJhbmRvbSApIClcbiAgICAvLyB2YXIgbkhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpO1xuICAgIC8vIG5IYXNoLnVwZGF0ZShjcmVhdGVkICsgTWF0aC5yYW5kb20oKSk7XG4gICAgLy8gbm9uY2UgPSBuSGFzaC5kaWdlc3QoJ2Jhc2U2NCcpO1xuICAgIG5vbmNlID0gQmFzZTY0LnN0cmluZ2lmeShzaGExKGNyZWF0ZWQgKyBNYXRoLnJhbmRvbSgpLCAnJykpO1xuICB9XG4gIGlmICh0aGlzLl9wYXNzd29yZFR5cGUgPT09ICdQYXNzd29yZFRleHQnKSB7XG4gICAgcGFzc3dvcmQgPSBcIjx3c3NlOlBhc3N3b3JkIFR5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3MtdXNlcm5hbWUtdG9rZW4tcHJvZmlsZS0xLjAjUGFzc3dvcmRUZXh0XFxcIj5cIiArIHRoaXMuX3Bhc3N3b3JkICsgXCI8L3dzc2U6UGFzc3dvcmQ+XCI7XG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICBwYXNzd29yZCArPSBcIjx3c3NlOk5vbmNlIEVuY29kaW5nVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy1zb2FwLW1lc3NhZ2Utc2VjdXJpdHktMS4wI0Jhc2U2NEJpbmFyeVxcXCI+XCIgKyBub25jZSArIFwiPC93c3NlOk5vbmNlPlwiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXNzd29yZCA9IFwiPHdzc2U6UGFzc3dvcmQgVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy11c2VybmFtZS10b2tlbi1wcm9maWxlLTEuMCNQYXNzd29yZERpZ2VzdFxcXCI+XCIgKyBwYXNzd29yZERpZ2VzdChub25jZSwgY3JlYXRlZCwgdGhpcy5fcGFzc3dvcmQpICsgXCI8L3dzc2U6UGFzc3dvcmQ+XCIgK1xuICAgICAgXCI8d3NzZTpOb25jZSBFbmNvZGluZ1R5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtc29hcC1tZXNzYWdlLXNlY3VyaXR5LTEuMCNCYXNlNjRCaW5hcnlcXFwiPlwiICsgbm9uY2UgKyBcIjwvd3NzZTpOb25jZT5cIjtcbiAgfVxuXG4gIHJldHVybiBcIjx3c3NlOlNlY3VyaXR5IFwiICsgKHRoaXMuX2FjdG9yID8gXCJzb2FwOmFjdG9yPVxcXCJcIiArIHRoaXMuX2FjdG9yICsgXCJcXFwiIFwiIDogXCJcIikgK1xuICAgICh0aGlzLl9tdXN0VW5kZXJzdGFuZCA/IFwic29hcDptdXN0VW5kZXJzdGFuZD1cXFwiMVxcXCIgXCIgOiBcIlwiKSArXG4gICAgXCJ4bWxuczp3c3NlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktc2VjZXh0LTEuMC54c2RcXFwiIHhtbG5zOndzdT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy13c3NlY3VyaXR5LXV0aWxpdHktMS4wLnhzZFxcXCI+XCIgK1xuICAgIHRpbWVTdGFtcFhtbCArXG4gICAgXCI8d3NzZTpVc2VybmFtZVRva2VuIHhtbG5zOndzdT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy13c3NlY3VyaXR5LXV0aWxpdHktMS4wLnhzZFxcXCIgd3N1OklkPVxcXCJTZWN1cml0eVRva2VuLVwiICsgY3JlYXRlZCArIFwiXFxcIj5cIiArXG4gICAgXCI8d3NzZTpVc2VybmFtZT5cIiArIHRoaXMuX3VzZXJuYW1lICsgXCI8L3dzc2U6VXNlcm5hbWU+XCIgK1xuICAgIHBhc3N3b3JkICtcbiAgICAodGhpcy5faGFzVG9rZW5DcmVhdGVkID8gXCI8d3N1OkNyZWF0ZWQ+XCIgKyBjcmVhdGVkICsgXCI8L3dzdTpDcmVhdGVkPlwiIDogXCJcIikgK1xuICAgIFwiPC93c3NlOlVzZXJuYW1lVG9rZW4+XCIgK1xuICAgIFwiPC93c3NlOlNlY3VyaXR5PlwiO1xufTtcblxuLy8gbW9kdWxlLmV4cG9ydHMgPSBXU1NlY3VyaXR5O1xuIl19