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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NTZWN1cml0eS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc2VjdXJpdHkvV1NTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsWUFBWSxDQUFDOztBQUdiLE9BQU8sSUFBSSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xDLE9BQU8sTUFBTSxNQUFNLHNCQUFzQixDQUFDOztBQUcxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDOztJQUV0QyxrQkFBa0IsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQzs7Ozs7OztBQUUzRCxNQUFNLFVBQVUsVUFBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTztJQUNwRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUMxQixpS0FBaUs7SUFDakssSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ3hELE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDZDtTQUFNO1FBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDbkY7SUFFRCxJQUFJLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDekQsSUFBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUM7S0FDckM7SUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxP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LEdBQUcsS0FBSyxHQUFHLGVBQWUsQ0FBQztTQUN0SztLQUNGO1NBQU07UUFDTCxRQUFRLEdBQUcsNEhBQTRILEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLGtCQUFrQjtZQUMzTSw4SEFBOEgsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO0tBQzVKO0lBRUQsT0FBTyxpQkFBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25GLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxvTUFBb007UUFDcE0sWUFBWTtRQUNaLDhJQUE4SSxHQUFHLE9BQU8sR0FBRyxLQUFLO1FBQ2hLLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCO1FBQ3ZELFFBQVE7UUFDUixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNFLHVCQUF1QjtRQUN2QixrQkFBa0IsQ0FBQztBQUN2QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuLy8gdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuaW1wb3J0IHNoYTEgZnJvbSAnY3J5cHRvLWpzL3NoYTEnO1xuaW1wb3J0IEJhc2U2NCBmcm9tICdjcnlwdG8tanMvZW5jLWJhc2U2NCc7XG5cbi8vIHZhciBwYXNzd29yZERpZ2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzJykucGFzc3dvcmREaWdlc3Q7XG5pbXBvcnQgeyBwYXNzd29yZERpZ2VzdCB9IGZyb20gJy4uL3V0aWxzJztcblxudmFyIHZhbGlkUGFzc3dvcmRUeXBlcyA9IFsnUGFzc3dvcmREaWdlc3QnLCAnUGFzc3dvcmRUZXh0J107XG5cbmV4cG9ydCBmdW5jdGlvbiBXU1NlY3VyaXR5KHVzZXJuYW1lLCBwYXNzd29yZCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgdGhpcy5fdXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgdGhpcy5fcGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgLy9tdXN0IGFjY291bnQgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yIHBhc3N3b3JkVHlwZSBTdHJpbmcgcGFyYW0gYXMgd2VsbCBhcyBvYmplY3Qgb3B0aW9ucyBkZWZhdWx0czogcGFzc3dvcmRUeXBlID0gJ1Bhc3N3b3JkVGV4dCcsIGhhc1RpbWVTdGFtcCA9IHRydWUgICBcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9IG9wdGlvbnMgPyBvcHRpb25zIDogJ1Bhc3N3b3JkVGV4dCc7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9IG9wdGlvbnMucGFzc3dvcmRUeXBlID8gb3B0aW9ucy5wYXNzd29yZFR5cGUgOiAnUGFzc3dvcmRUZXh0JztcbiAgfVxuXG4gIGlmICh2YWxpZFBhc3N3b3JkVHlwZXMuaW5kZXhPZih0aGlzLl9wYXNzd29yZFR5cGUpID09PSAtMSkge1xuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9ICdQYXNzd29yZFRleHQnO1xuICB9XG5cbiAgdGhpcy5faGFzVGltZVN0YW1wID0gb3B0aW9ucy5oYXNUaW1lU3RhbXAgfHwgdHlwZW9mIG9wdGlvbnMuaGFzVGltZVN0YW1wID09PSAnYm9vbGVhbicgPyAhIW9wdGlvbnMuaGFzVGltZVN0YW1wIDogdHJ1ZTtcbiAgLypqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgaWYgKG9wdGlvbnMuaGFzTm9uY2UgIT0gbnVsbCkge1xuICAgIHRoaXMuX2hhc05vbmNlID0gISFvcHRpb25zLmhhc05vbmNlO1xuICB9XG4gIHRoaXMuX2hhc1Rva2VuQ3JlYXRlZCA9IG9wdGlvbnMuaGFzVG9rZW5DcmVhdGVkIHx8IHR5cGVvZiBvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCA9PT0gJ2Jvb2xlYW4nID8gISFvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCA6IHRydWU7XG4gIGlmIChvcHRpb25zLmFjdG9yICE9IG51bGwpIHtcbiAgICB0aGlzLl9hY3RvciA9IG9wdGlvbnMuYWN0b3I7XG4gIH1cbiAgaWYgKG9wdGlvbnMubXVzdFVuZGVyc3RhbmQgIT0gbnVsbCkge1xuICAgIHRoaXMuX211c3RVbmRlcnN0YW5kID0gISFvcHRpb25zLm11c3RVbmRlcnN0YW5kO1xuICB9XG59XG5cbldTU2VjdXJpdHkucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XG4gIC8vIGF2b2lkIGRlcGVuZGVuY3kgb24gZGF0ZSBmb3JtYXR0aW5nIGxpYnJhcmllc1xuICBmdW5jdGlvbiBnZXREYXRlKGQpIHtcbiAgICBmdW5jdGlvbiBwYWQobikge1xuICAgICAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4gOiBuO1xuICAgIH1cbiAgICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nXG4gICAgICArIHBhZChkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJ1xuICAgICAgKyBwYWQoZC5nZXRVVENEYXRlKCkpICsgJ1QnXG4gICAgICArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonXG4gICAgICArIHBhZChkLmdldFVUQ01pbnV0ZXMoKSkgKyAnOidcbiAgICAgICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArICdaJztcbiAgfVxuICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgdmFyIGNyZWF0ZWQgPSBnZXREYXRlKG5vdyk7XG4gIHZhciB0aW1lU3RhbXBYbWwgPSAnJztcbiAgaWYgKHRoaXMuX2hhc1RpbWVTdGFtcCkge1xuICAgIHZhciBleHBpcmVzID0gZ2V0RGF0ZSggbmV3IERhdGUobm93LmdldFRpbWUoKSArICgxMDAwICogNjAwKSkgKTtcbiAgICB0aW1lU3RhbXBYbWwgPSBcIjx3c3U6VGltZXN0YW1wIHdzdTpJZD1cXFwiVGltZXN0YW1wLVwiK2NyZWF0ZWQrXCJcXFwiPlwiICtcbiAgICAgIFwiPHdzdTpDcmVhdGVkPlwiK2NyZWF0ZWQrXCI8L3dzdTpDcmVhdGVkPlwiICtcbiAgICAgIFwiPHdzdTpFeHBpcmVzPlwiK2V4cGlyZXMrXCI8L3dzdTpFeHBpcmVzPlwiICtcbiAgICAgIFwiPC93c3U6VGltZXN0YW1wPlwiO1xuICB9XG5cbiAgdmFyIHBhc3N3b3JkLCBub25jZTtcbiAgaWYgKHRoaXMuX2hhc05vbmNlIHx8IHRoaXMuX3Bhc3N3b3JkVHlwZSAhPT0gJ1Bhc3N3b3JkVGV4dCcpIHtcbiAgICAvLyBub25jZSA9IGJhc2U2NCAoIHNoYTEgKCBjcmVhdGVkICsgcmFuZG9tICkgKVxuICAgIC8vIHZhciBuSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJyk7XG4gICAgLy8gbkhhc2gudXBkYXRlKGNyZWF0ZWQgKyBNYXRoLnJhbmRvbSgpKTtcbiAgICAvLyBub25jZSA9IG5IYXNoLmRpZ2VzdCgnYmFzZTY0Jyk7XG4gICAgbm9uY2UgPSBCYXNlNjQuc3RyaW5naWZ5KHNoYTEoY3JlYXRlZCArIE1hdGgucmFuZG9tKCksICcnKSk7XG4gIH1cbiAgaWYgKHRoaXMuX3Bhc3N3b3JkVHlwZSA9PT0gJ1Bhc3N3b3JkVGV4dCcpIHtcbiAgICBwYXNzd29yZCA9IFwiPHdzc2U6UGFzc3dvcmQgVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy11c2VybmFtZS10b2tlbi1wcm9maWxlLTEuMCNQYXNzd29yZFRleHRcXFwiPlwiICsgdGhpcy5fcGFzc3dvcmQgKyBcIjwvd3NzZTpQYXNzd29yZD5cIjtcbiAgICBpZiAobm9uY2UpIHtcbiAgICAgIHBhc3N3b3JkICs9IFwiPHdzc2U6Tm9uY2UgRW5jb2RpbmdUeXBlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXNvYXAtbWVzc2FnZS1zZWN1cml0eS0xLjAjQmFzZTY0QmluYXJ5XFxcIj5cIiArIG5vbmNlICsgXCI8L3dzc2U6Tm9uY2U+XCI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhc3N3b3JkID0gXCI8d3NzZTpQYXNzd29yZCBUeXBlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXVzZXJuYW1lLXRva2VuLXByb2ZpbGUtMS4wI1Bhc3N3b3JkRGlnZXN0XFxcIj5cIiArIHBhc3N3b3JkRGlnZXN0KG5vbmNlLCBjcmVhdGVkLCB0aGlzLl9wYXNzd29yZCkgKyBcIjwvd3NzZTpQYXNzd29yZD5cIiArXG4gICAgICBcIjx3c3NlOk5vbmNlIEVuY29kaW5nVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy1zb2FwLW1lc3NhZ2Utc2VjdXJpdHktMS4wI0Jhc2U2NEJpbmFyeVxcXCI+XCIgKyBub25jZSArIFwiPC93c3NlOk5vbmNlPlwiO1xuICB9XG5cbiAgcmV0dXJuIFwiPHdzc2U6U2VjdXJpdHkgXCIgKyAodGhpcy5fYWN0b3IgPyBcInNvYXA6YWN0b3I9XFxcIlwiICsgdGhpcy5fYWN0b3IgKyBcIlxcXCIgXCIgOiBcIlwiKSArXG4gICAgKHRoaXMuX211c3RVbmRlcnN0YW5kID8gXCJzb2FwOm11c3RVbmRlcnN0YW5kPVxcXCIxXFxcIiBcIiA6IFwiXCIpICtcbiAgICBcInhtbG5zOndzc2U9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtd3NzZWN1cml0eS1zZWNleHQtMS4wLnhzZFxcXCIgeG1sbnM6d3N1PVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktdXRpbGl0eS0xLjAueHNkXFxcIj5cIiArXG4gICAgdGltZVN0YW1wWG1sICtcbiAgICBcIjx3c3NlOlVzZXJuYW1lVG9rZW4geG1sbnM6d3N1PVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktdXRpbGl0eS0xLjAueHNkXFxcIiB3c3U6SWQ9XFxcIlNlY3VyaXR5VG9rZW4tXCIgKyBjcmVhdGVkICsgXCJcXFwiPlwiICtcbiAgICBcIjx3c3NlOlVzZXJuYW1lPlwiICsgdGhpcy5fdXNlcm5hbWUgKyBcIjwvd3NzZTpVc2VybmFtZT5cIiArXG4gICAgcGFzc3dvcmQgK1xuICAgICh0aGlzLl9oYXNUb2tlbkNyZWF0ZWQgPyBcIjx3c3U6Q3JlYXRlZD5cIiArIGNyZWF0ZWQgKyBcIjwvd3N1OkNyZWF0ZWQ+XCIgOiBcIlwiKSArXG4gICAgXCI8L3dzc2U6VXNlcm5hbWVUb2tlbj5cIiArXG4gICAgXCI8L3dzc2U6U2VjdXJpdHk+XCI7XG59O1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IFdTU2VjdXJpdHk7XG4iXX0=