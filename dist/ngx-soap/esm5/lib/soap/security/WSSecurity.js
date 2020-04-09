"use strict";
// var crypto = require('crypto');
import sha1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';
// var passwordDigest = require('../utils').passwordDigest;
import { passwordDigest } from '../utils';
var validPasswordTypes = ['PasswordDigest', 'PasswordText'];
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
    function getDate(d) {
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
    var now = new Date();
    var created = getDate(now);
    var timeStampXml = '';
    if (this._hasTimeStamp) {
        var expires = getDate(new Date(now.getTime() + (1000 * 600)));
        timeStampXml = "<wsu:Timestamp wsu:Id=\"Timestamp-" + created + "\">" +
            "<wsu:Created>" + created + "</wsu:Created>" +
            "<wsu:Expires>" + expires + "</wsu:Expires>" +
            "</wsu:Timestamp>";
    }
    var password, nonce;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NTZWN1cml0eS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc2VjdXJpdHkvV1NTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixrQ0FBa0M7QUFDbEMsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxNQUFNLE1BQU0sc0JBQXNCLENBQUM7QUFFMUMsMkRBQTJEO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUMsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRTVELE1BQU0sVUFBVSxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPO0lBQ3BELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzFCLGlLQUFpSztJQUNqSyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDeEQsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNkO1NBQU07UUFDTCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztLQUNuRjtJQUVELElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN6RCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQztLQUNyQztJQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FB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SSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUM1SyxJQUFJLEtBQUssRUFBRTtZQUNULFFBQVEsSUFBSSw4SEFBOEgsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO1NBQ3RLO0tBQ0Y7U0FBTTtRQUNMLFFBQVEsR0FBRyw0SEFBNEgsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsa0JBQWtCO1lBQzNNLDhIQUE4SCxHQUFHLEtBQUssR0FBRyxlQUFlLENBQUM7S0FDNUo7SUFFRCxPQUFPLGlCQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkYsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELG9NQUFvTTtRQUNwTSxZQUFZO1FBQ1osOElBQThJLEdBQUcsT0FBTyxHQUFHLEtBQUs7UUFDaEssaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxrQkFBa0I7UUFDdkQsUUFBUTtRQUNSLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsT0FBTyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsdUJBQXVCO1FBQ3ZCLGtCQUFrQixDQUFDO0FBQ3ZCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLy8gdmFyIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5pbXBvcnQgc2hhMSBmcm9tICdjcnlwdG8tanMvc2hhMSc7XHJcbmltcG9ydCBCYXNlNjQgZnJvbSAnY3J5cHRvLWpzL2VuYy1iYXNlNjQnO1xyXG5cclxuLy8gdmFyIHBhc3N3b3JkRGlnZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5wYXNzd29yZERpZ2VzdDtcclxuaW1wb3J0IHsgcGFzc3dvcmREaWdlc3QgfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG52YXIgdmFsaWRQYXNzd29yZFR5cGVzID0gWydQYXNzd29yZERpZ2VzdCcsICdQYXNzd29yZFRleHQnXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXU1NlY3VyaXR5KHVzZXJuYW1lLCBwYXNzd29yZCwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIHRoaXMuX3VzZXJuYW1lID0gdXNlcm5hbWU7XHJcbiAgdGhpcy5fcGFzc3dvcmQgPSBwYXNzd29yZDtcclxuICAvL211c3QgYWNjb3VudCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3IgcGFzc3dvcmRUeXBlIFN0cmluZyBwYXJhbSBhcyB3ZWxsIGFzIG9iamVjdCBvcHRpb25zIGRlZmF1bHRzOiBwYXNzd29yZFR5cGUgPSAnUGFzc3dvcmRUZXh0JywgaGFzVGltZVN0YW1wID0gdHJ1ZSAgIFxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9IG9wdGlvbnMgPyBvcHRpb25zIDogJ1Bhc3N3b3JkVGV4dCc7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuX3Bhc3N3b3JkVHlwZSA9IG9wdGlvbnMucGFzc3dvcmRUeXBlID8gb3B0aW9ucy5wYXNzd29yZFR5cGUgOiAnUGFzc3dvcmRUZXh0JztcclxuICB9XHJcblxyXG4gIGlmICh2YWxpZFBhc3N3b3JkVHlwZXMuaW5kZXhPZih0aGlzLl9wYXNzd29yZFR5cGUpID09PSAtMSkge1xyXG4gICAgdGhpcy5fcGFzc3dvcmRUeXBlID0gJ1Bhc3N3b3JkVGV4dCc7XHJcbiAgfVxyXG5cclxuICB0aGlzLl9oYXNUaW1lU3RhbXAgPSBvcHRpb25zLmhhc1RpbWVTdGFtcCB8fCB0eXBlb2Ygb3B0aW9ucy5oYXNUaW1lU3RhbXAgPT09ICdib29sZWFuJyA/ICEhb3B0aW9ucy5oYXNUaW1lU3RhbXAgOiB0cnVlO1xyXG4gIC8qanNoaW50IGVxbnVsbDp0cnVlICovXHJcbiAgaWYgKG9wdGlvbnMuaGFzTm9uY2UgIT0gbnVsbCkge1xyXG4gICAgdGhpcy5faGFzTm9uY2UgPSAhIW9wdGlvbnMuaGFzTm9uY2U7XHJcbiAgfVxyXG4gIHRoaXMuX2hhc1Rva2VuQ3JlYXRlZCA9IG9wdGlvbnMuaGFzVG9rZW5DcmVhdGVkIHx8IHR5cGVvZiBvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCA9PT0gJ2Jvb2xlYW4nID8gISFvcHRpb25zLmhhc1Rva2VuQ3JlYXRlZCA6IHRydWU7XHJcbiAgaWYgKG9wdGlvbnMuYWN0b3IgIT0gbnVsbCkge1xyXG4gICAgdGhpcy5fYWN0b3IgPSBvcHRpb25zLmFjdG9yO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy5tdXN0VW5kZXJzdGFuZCAhPSBudWxsKSB7XHJcbiAgICB0aGlzLl9tdXN0VW5kZXJzdGFuZCA9ICEhb3B0aW9ucy5tdXN0VW5kZXJzdGFuZDtcclxuICB9XHJcbn1cclxuXHJcbldTU2VjdXJpdHkucHJvdG90eXBlLnRvWE1MID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gYXZvaWQgZGVwZW5kZW5jeSBvbiBkYXRlIGZvcm1hdHRpbmcgbGlicmFyaWVzXHJcbiAgZnVuY3Rpb24gZ2V0RGF0ZShkKSB7XHJcbiAgICBmdW5jdGlvbiBwYWQobikge1xyXG4gICAgICByZXR1cm4gbiA8IDEwID8gJzAnICsgbiA6IG47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nXHJcbiAgICAgICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nXHJcbiAgICAgICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArICdUJ1xyXG4gICAgICArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonXHJcbiAgICAgICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6J1xyXG4gICAgICArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgKyAnWic7XHJcbiAgfVxyXG4gIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gIHZhciBjcmVhdGVkID0gZ2V0RGF0ZShub3cpO1xyXG4gIHZhciB0aW1lU3RhbXBYbWwgPSAnJztcclxuICBpZiAodGhpcy5faGFzVGltZVN0YW1wKSB7XHJcbiAgICB2YXIgZXhwaXJlcyA9IGdldERhdGUoIG5ldyBEYXRlKG5vdy5nZXRUaW1lKCkgKyAoMTAwMCAqIDYwMCkpICk7XHJcbiAgICB0aW1lU3RhbXBYbWwgPSBcIjx3c3U6VGltZXN0YW1wIHdzdTpJZD1cXFwiVGltZXN0YW1wLVwiK2NyZWF0ZWQrXCJcXFwiPlwiICtcclxuICAgICAgXCI8d3N1OkNyZWF0ZWQ+XCIrY3JlYXRlZCtcIjwvd3N1OkNyZWF0ZWQ+XCIgK1xyXG4gICAgICBcIjx3c3U6RXhwaXJlcz5cIitleHBpcmVzK1wiPC93c3U6RXhwaXJlcz5cIiArXHJcbiAgICAgIFwiPC93c3U6VGltZXN0YW1wPlwiO1xyXG4gIH1cclxuXHJcbiAgdmFyIHBhc3N3b3JkLCBub25jZTtcclxuICBpZiAodGhpcy5faGFzTm9uY2UgfHwgdGhpcy5fcGFzc3dvcmRUeXBlICE9PSAnUGFzc3dvcmRUZXh0Jykge1xyXG4gICAgLy8gbm9uY2UgPSBiYXNlNjQgKCBzaGExICggY3JlYXRlZCArIHJhbmRvbSApIClcclxuICAgIC8vIHZhciBuSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJyk7XHJcbiAgICAvLyBuSGFzaC51cGRhdGUoY3JlYXRlZCArIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgLy8gbm9uY2UgPSBuSGFzaC5kaWdlc3QoJ2Jhc2U2NCcpO1xyXG4gICAgbm9uY2UgPSBCYXNlNjQuc3RyaW5naWZ5KHNoYTEoY3JlYXRlZCArIE1hdGgucmFuZG9tKCksICcnKSk7XHJcbiAgfVxyXG4gIGlmICh0aGlzLl9wYXNzd29yZFR5cGUgPT09ICdQYXNzd29yZFRleHQnKSB7XHJcbiAgICBwYXNzd29yZCA9IFwiPHdzc2U6UGFzc3dvcmQgVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy11c2VybmFtZS10b2tlbi1wcm9maWxlLTEuMCNQYXNzd29yZFRleHRcXFwiPlwiICsgdGhpcy5fcGFzc3dvcmQgKyBcIjwvd3NzZTpQYXNzd29yZD5cIjtcclxuICAgIGlmIChub25jZSkge1xyXG4gICAgICBwYXNzd29yZCArPSBcIjx3c3NlOk5vbmNlIEVuY29kaW5nVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy1zb2FwLW1lc3NhZ2Utc2VjdXJpdHktMS4wI0Jhc2U2NEJpbmFyeVxcXCI+XCIgKyBub25jZSArIFwiPC93c3NlOk5vbmNlPlwiO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBwYXNzd29yZCA9IFwiPHdzc2U6UGFzc3dvcmQgVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy11c2VybmFtZS10b2tlbi1wcm9maWxlLTEuMCNQYXNzd29yZERpZ2VzdFxcXCI+XCIgKyBwYXNzd29yZERpZ2VzdChub25jZSwgY3JlYXRlZCwgdGhpcy5fcGFzc3dvcmQpICsgXCI8L3dzc2U6UGFzc3dvcmQ+XCIgK1xyXG4gICAgICBcIjx3c3NlOk5vbmNlIEVuY29kaW5nVHlwZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy1zb2FwLW1lc3NhZ2Utc2VjdXJpdHktMS4wI0Jhc2U2NEJpbmFyeVxcXCI+XCIgKyBub25jZSArIFwiPC93c3NlOk5vbmNlPlwiO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFwiPHdzc2U6U2VjdXJpdHkgXCIgKyAodGhpcy5fYWN0b3IgPyBcInNvYXA6YWN0b3I9XFxcIlwiICsgdGhpcy5fYWN0b3IgKyBcIlxcXCIgXCIgOiBcIlwiKSArXHJcbiAgICAodGhpcy5fbXVzdFVuZGVyc3RhbmQgPyBcInNvYXA6bXVzdFVuZGVyc3RhbmQ9XFxcIjFcXFwiIFwiIDogXCJcIikgK1xyXG4gICAgXCJ4bWxuczp3c3NlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXdzc2VjdXJpdHktc2VjZXh0LTEuMC54c2RcXFwiIHhtbG5zOndzdT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy13c3NlY3VyaXR5LXV0aWxpdHktMS4wLnhzZFxcXCI+XCIgK1xyXG4gICAgdGltZVN0YW1wWG1sICtcclxuICAgIFwiPHdzc2U6VXNlcm5hbWVUb2tlbiB4bWxuczp3c3U9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtd3NzZWN1cml0eS11dGlsaXR5LTEuMC54c2RcXFwiIHdzdTpJZD1cXFwiU2VjdXJpdHlUb2tlbi1cIiArIGNyZWF0ZWQgKyBcIlxcXCI+XCIgK1xyXG4gICAgXCI8d3NzZTpVc2VybmFtZT5cIiArIHRoaXMuX3VzZXJuYW1lICsgXCI8L3dzc2U6VXNlcm5hbWU+XCIgK1xyXG4gICAgcGFzc3dvcmQgK1xyXG4gICAgKHRoaXMuX2hhc1Rva2VuQ3JlYXRlZCA/IFwiPHdzdTpDcmVhdGVkPlwiICsgY3JlYXRlZCArIFwiPC93c3U6Q3JlYXRlZD5cIiA6IFwiXCIpICtcclxuICAgIFwiPC93c3NlOlVzZXJuYW1lVG9rZW4+XCIgK1xyXG4gICAgXCI8L3dzc2U6U2VjdXJpdHk+XCI7XHJcbn07XHJcblxyXG4vLyBtb2R1bGUuZXhwb3J0cyA9IFdTU2VjdXJpdHk7XHJcbiJdfQ==