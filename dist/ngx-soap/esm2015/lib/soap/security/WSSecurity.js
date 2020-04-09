/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
WSSecurity.prototype.toXML = function () {
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NTZWN1cml0eS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc2VjdXJpdHkvV1NTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsWUFBWSxDQUFDOztBQUdiLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sTUFBTSxNQUFNLHNCQUFzQixDQUFDOztBQUcxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDOztJQUV0QyxrQkFBa0IsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQzs7Ozs7OztBQUUzRCxNQUFNLFVBQVUsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUNwRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixpS0FBaUs7SUFDakssSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3hELE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDZDtTQUFNO1FBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDbkY7SUFFRCxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUM7S0FDckM7SUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxP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LEdBQUcsS0FBSyxHQUFHLGVBQWUsQ0FBQztTQUN0SztLQUNGO1NBQU07UUFDTCxRQUFRLEdBQUcsNEhBQTRILEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGtCQUFrQjtZQUMzTSw4SEFBOEgsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO0tBQzVKO0lBRUQsT0FBTyxpQkFBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25GLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxvTUFBb007UUFDcE0sWUFBWTtRQUNaLDhJQUE4SSxHQUFHLE9BQU8sR0FBRyxLQUFLO1FBQ2hLLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCO1FBQ3ZELFFBQVE7UUFDUixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLHVCQUF1QjtRQUN2QixrQkFBa0IsQ0FBQztBQUN2QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8vIHZhciBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxuaW1wb3J0IHNoYTEgZnJvbSAnY3J5cHRvLWpzL3NoYTEnO1xyXG5pbXBvcnQgQmFzZTY0IGZyb20gJ2NyeXB0by1qcy9lbmMtYmFzZTY0JztcclxuXHJcbi8vIHZhciBwYXNzd29yZERpZ2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucGFzc3dvcmREaWdlc3Q7XHJcbmltcG9ydCB7IHBhc3N3b3JkRGlnZXN0IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxudmFyIHZhbGlkUGFzc3dvcmRUeXBlcyA9IFsnUGFzc3dvcmREaWdlc3QnLCAnUGFzc3dvcmRUZXh0J107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV1NTZWN1cml0eSh1c2VybmFtZSwgcGFzc3dvcmQsIG9wdGlvbnMpIHtcclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICB0aGlzLl91c2VybmFtZSA9IHVzZXJuYW1lO1xyXG4gIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XHJcbiAgLy9tdXN0IGFjY291bnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yIHBhc3N3b3JkVHlwZSBTdHJpbmcgcGFyYW0gYXMgd2VsbCBhcyBvYmplY3Qgb3B0aW9ucyBkZWZhdWx0czogcGFzc3dvcmRUeXBlID0gJ1Bhc3N3b3JkVGV4dCcsIGhhc1RpbWVTdGFtcCA9IHRydWUgICBcclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICB0aGlzLl9wYXNzd29yZFR5cGUgPSBvcHRpb25zID8gb3B0aW9ucyA6ICdQYXNzd29yZFRleHQnO1xyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLl9wYXNzd29yZFR5cGUgPSBvcHRpb25zLnBhc3N3b3JkVHlwZSA/IG9wdGlvbnMucGFzc3dvcmRUeXBlIDogJ1Bhc3N3b3JkVGV4dCc7XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRQYXNzd29yZFR5cGVzLmluZGV4T2YodGhpcy5fcGFzc3dvcmRUeXBlKSA9PT0gLTEpIHtcclxuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9ICdQYXNzd29yZFRleHQnO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5faGFzVGltZVN0YW1wID0gb3B0aW9ucy5oYXNUaW1lU3RhbXAgfHwgdHlwZW9mIG9wdGlvbnMuaGFzVGltZVN0YW1wID09PSAnYm9vbGVhbicgPyAhIW9wdGlvbnMuaGFzVGltZVN0YW1wIDogdHJ1ZTtcclxuICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xyXG4gIGlmIChvcHRpb25zLmhhc05vbmNlICE9IG51bGwpIHtcclxuICAgIHRoaXMuX2hhc05vbmNlID0gISFvcHRpb25zLmhhc05vbmNlO1xyXG4gIH1cclxuICB0aGlzLl9oYXNUb2tlbkNyZWF0ZWQgPSBvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCB8fCB0eXBlb2Ygb3B0aW9ucy5oYXNUb2tlbkNyZWF0ZWQgPT09ICdib29sZWFuJyA/ICEhb3B0aW9ucy5oYXNUb2tlbkNyZWF0ZWQgOiB0cnVlO1xyXG4gIGlmIChvcHRpb25zLmFjdG9yICE9IG51bGwpIHtcclxuICAgIHRoaXMuX2FjdG9yID0gb3B0aW9ucy5hY3RvcjtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMubXVzdFVuZGVyc3RhbmQgIT0gbnVsbCkge1xyXG4gICAgdGhpcy5fbXVzdFVuZGVyc3RhbmQgPSAhIW9wdGlvbnMubXVzdFVuZGVyc3RhbmQ7XHJcbiAgfVxyXG59XHJcblxyXG5XU1NlY3VyaXR5LnByb3RvdHlwZS50b1hNTCA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGF2b2lkIGRlcGVuZGVuY3kgb24gZGF0ZSBmb3JtYXR0aW5nIGxpYnJhcmllc1xyXG4gIGZ1bmN0aW9uIGdldERhdGUoZCkge1xyXG4gICAgZnVuY3Rpb24gcGFkKG4pIHtcclxuICAgICAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4gOiBuO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGQuZ2V0VVRDRnVsbFllYXIoKSArICctJ1xyXG4gICAgICArIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJ1xyXG4gICAgICArIHBhZChkLmdldFVUQ0RhdGUoKSkgKyAnVCdcclxuICAgICAgKyBwYWQoZC5nZXRVVENIb3VycygpKSArICc6J1xyXG4gICAgICArIHBhZChkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOidcclxuICAgICAgKyBwYWQoZC5nZXRVVENTZWNvbmRzKCkpICsgJ1onO1xyXG4gIH1cclxuICB2YXIgbm93ID0gbmV3IERhdGUoKTtcclxuICB2YXIgY3JlYXRlZCA9IGdldERhdGUobm93KTtcclxuICB2YXIgdGltZVN0YW1wWG1sID0gJyc7XHJcbiAgaWYgKHRoaXMuX2hhc1RpbWVTdGFtcCkge1xyXG4gICAgdmFyIGV4cGlyZXMgPSBnZXREYXRlKCBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDEwMDAgKiA2MDApKSApO1xyXG4gICAgdGltZVN0YW1wWG1sID0gXCI8d3N1OlRpbWVzdGFtcCB3c3U6SWQ9XFxcIlRpbWVzdGFtcC1cIitjcmVhdGVkK1wiXFxcIj5cIiArXHJcbiAgICAgIFwiPHdzdTpDcmVhdGVkPlwiK2NyZWF0ZWQrXCI8L3dzdTpDcmVhdGVkPlwiICtcclxuICAgICAgXCI8d3N1OkV4cGlyZXM+XCIrZXhwaXJlcytcIjwvd3N1OkV4cGlyZXM+XCIgK1xyXG4gICAgICBcIjwvd3N1OlRpbWVzdGFtcD5cIjtcclxuICB9XHJcblxyXG4gIHZhciBwYXNzd29yZCwgbm9uY2U7XHJcbiAgaWYgKHRoaXMuX2hhc05vbmNlIHx8IHRoaXMuX3Bhc3N3b3JkVHlwZSAhPT0gJ1Bhc3N3b3JkVGV4dCcpIHtcclxuICAgIC8vIG5vbmNlID0gYmFzZTY0ICggc2hhMSAoIGNyZWF0ZWQgKyByYW5kb20gKSApXHJcbiAgICAvLyB2YXIgbkhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpO1xyXG4gICAgLy8gbkhhc2gudXBkYXRlKGNyZWF0ZWQgKyBNYXRoLnJhbmRvbSgpKTtcclxuICAgIC8vIG5vbmNlID0gbkhhc2guZGlnZXN0KCdiYXNlNjQnKTtcclxuICAgIG5vbmNlID0gQmFzZTY0LnN0cmluZ2lmeShzaGExKGNyZWF0ZWQgKyBNYXRoLnJhbmRvbSgpLCAnJykpO1xyXG4gIH1cclxuICBpZiAodGhpcy5fcGFzc3dvcmRUeXBlID09PSAnUGFzc3dvcmRUZXh0Jykge1xyXG4gICAgcGFzc3dvcmQgPSBcIjx3c3NlOlBhc3N3b3JkIFR5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3MtdXNlcm5hbWUtdG9rZW4tcHJvZmlsZS0xLjAjUGFzc3dvcmRUZXh0XFxcIj5cIiArIHRoaXMuX3Bhc3N3b3JkICsgXCI8L3dzc2U6UGFzc3dvcmQ+XCI7XHJcbiAgICBpZiAobm9uY2UpIHtcclxuICAgICAgcGFzc3dvcmQgKz0gXCI8d3NzZTpOb25jZSBFbmNvZGluZ1R5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtc29hcC1tZXNzYWdlLXNlY3VyaXR5LTEuMCNCYXNlNjRCaW5hcnlcXFwiPlwiICsgbm9uY2UgKyBcIjwvd3NzZTpOb25jZT5cIjtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgcGFzc3dvcmQgPSBcIjx3c3NlOlBhc3N3b3JkIFR5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3MtdXNlcm5hbWUtdG9rZW4tcHJvZmlsZS0xLjAjUGFzc3dvcmREaWdlc3RcXFwiPlwiICsgcGFzc3dvcmREaWdlc3Qobm9uY2UsIGNyZWF0ZWQsIHRoaXMuX3Bhc3N3b3JkKSArIFwiPC93c3NlOlBhc3N3b3JkPlwiICtcclxuICAgICAgXCI8d3NzZTpOb25jZSBFbmNvZGluZ1R5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtc29hcC1tZXNzYWdlLXNlY3VyaXR5LTEuMCNCYXNlNjRCaW5hcnlcXFwiPlwiICsgbm9uY2UgKyBcIjwvd3NzZTpOb25jZT5cIjtcclxuICB9XHJcblxyXG4gIHJldHVybiBcIjx3c3NlOlNlY3VyaXR5IFwiICsgKHRoaXMuX2FjdG9yID8gXCJzb2FwOmFjdG9yPVxcXCJcIiArIHRoaXMuX2FjdG9yICsgXCJcXFwiIFwiIDogXCJcIikgK1xyXG4gICAgKHRoaXMuX211c3RVbmRlcnN0YW5kID8gXCJzb2FwOm11c3RVbmRlcnN0YW5kPVxcXCIxXFxcIiBcIiA6IFwiXCIpICtcclxuICAgIFwieG1sbnM6d3NzZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy13c3NlY3VyaXR5LXNlY2V4dC0xLjAueHNkXFxcIiB4bWxuczp3c3U9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtd3NzZWN1cml0eS11dGlsaXR5LTEuMC54c2RcXFwiPlwiICtcclxuICAgIHRpbWVTdGFtcFhtbCArXHJcbiAgICBcIjx3c3NlOlVzZXJuYW1lVG9rZW4geG1sbnM6d3N1PVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktdXRpbGl0eS0xLjAueHNkXFxcIiB3c3U6SWQ9XFxcIlNlY3VyaXR5VG9rZW4tXCIgKyBjcmVhdGVkICsgXCJcXFwiPlwiICtcclxuICAgIFwiPHdzc2U6VXNlcm5hbWU+XCIgKyB0aGlzLl91c2VybmFtZSArIFwiPC93c3NlOlVzZXJuYW1lPlwiICtcclxuICAgIHBhc3N3b3JkICtcclxuICAgICh0aGlzLl9oYXNUb2tlbkNyZWF0ZWQgPyBcIjx3c3U6Q3JlYXRlZD5cIiArIGNyZWF0ZWQgKyBcIjwvd3N1OkNyZWF0ZWQ+XCIgOiBcIlwiKSArXHJcbiAgICBcIjwvd3NzZTpVc2VybmFtZVRva2VuPlwiICtcclxuICAgIFwiPC93c3NlOlNlY3VyaXR5PlwiO1xyXG59O1xyXG5cclxuLy8gbW9kdWxlLmV4cG9ydHMgPSBXU1NlY3VyaXR5O1xyXG4iXX0=