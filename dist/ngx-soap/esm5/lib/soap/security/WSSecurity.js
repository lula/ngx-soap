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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV1NTZWN1cml0eS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1zb2FwLyIsInNvdXJjZXMiOlsibGliL3NvYXAvc2VjdXJpdHkvV1NTZWN1cml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixrQ0FBa0M7QUFDbEMsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxNQUFNLE1BQU0sc0JBQXNCLENBQUM7QUFFMUMsMkRBQTJEO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUMsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBRTVELE1BQU0sVUFBVSxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPO0lBQ3BELE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzFCLGlLQUFpSztJQUNqSyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7UUFDeEQsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNkO1NBQU07UUFDTCxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztLQUNuRjtJQUVELElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN6RCxJQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsQ0FBQztLQUNyQztJQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FB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SSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQztRQUM1SyxJQUFJLEtBQUssRUFBRTtZQUNULFFBQVEsSUFBSSw4SEFBOEgsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO1NBQ3RLO0tBQ0Y7U0FBTTtRQUNMLFFBQVEsR0FBRyw0SEFBNEgsR0FBRyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsa0JBQWtCO1lBQzNNLDhIQUE4SCxHQUFHLEtBQUssR0FBRyxlQUFlLENBQUM7S0FDNUo7SUFFRCxPQUFPLGlCQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbkYsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELG9NQUFvTTtRQUNwTSxZQUFZO1FBQ1osOElBQThJLEdBQUcsT0FBTyxHQUFHLEtBQUs7UUFDaEssaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxrQkFBa0I7UUFDdkQsUUFBUTtRQUNSLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsT0FBTyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsdUJBQXVCO1FBQ3ZCLGtCQUFrQixDQUFDO0FBQ3ZCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vLyB2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5pbXBvcnQgc2hhMSBmcm9tICdjcnlwdG8tanMvc2hhMSc7XG5pbXBvcnQgQmFzZTY0IGZyb20gJ2NyeXB0by1qcy9lbmMtYmFzZTY0JztcblxuLy8gdmFyIHBhc3N3b3JkRGlnZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMnKS5wYXNzd29yZERpZ2VzdDtcbmltcG9ydCB7IHBhc3N3b3JkRGlnZXN0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG52YXIgdmFsaWRQYXNzd29yZFR5cGVzID0gWydQYXNzd29yZERpZ2VzdCcsICdQYXNzd29yZFRleHQnXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFdTU2VjdXJpdHkodXNlcm5hbWUsIHBhc3N3b3JkLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB0aGlzLl91c2VybmFtZSA9IHVzZXJuYW1lO1xuICB0aGlzLl9wYXNzd29yZCA9IHBhc3N3b3JkO1xuICAvL211c3QgYWNjb3VudCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3IgcGFzc3dvcmRUeXBlIFN0cmluZyBwYXJhbSBhcyB3ZWxsIGFzIG9iamVjdCBvcHRpb25zIGRlZmF1bHRzOiBwYXNzd29yZFR5cGUgPSAnUGFzc3dvcmRUZXh0JywgaGFzVGltZVN0YW1wID0gdHJ1ZSAgIFxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhpcy5fcGFzc3dvcmRUeXBlID0gb3B0aW9ucyA/IG9wdGlvbnMgOiAnUGFzc3dvcmRUZXh0JztcbiAgICBvcHRpb25zID0ge307XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fcGFzc3dvcmRUeXBlID0gb3B0aW9ucy5wYXNzd29yZFR5cGUgPyBvcHRpb25zLnBhc3N3b3JkVHlwZSA6ICdQYXNzd29yZFRleHQnO1xuICB9XG5cbiAgaWYgKHZhbGlkUGFzc3dvcmRUeXBlcy5pbmRleE9mKHRoaXMuX3Bhc3N3b3JkVHlwZSkgPT09IC0xKSB7XG4gICAgdGhpcy5fcGFzc3dvcmRUeXBlID0gJ1Bhc3N3b3JkVGV4dCc7XG4gIH1cblxuICB0aGlzLl9oYXNUaW1lU3RhbXAgPSBvcHRpb25zLmhhc1RpbWVTdGFtcCB8fCB0eXBlb2Ygb3B0aW9ucy5oYXNUaW1lU3RhbXAgPT09ICdib29sZWFuJyA/ICEhb3B0aW9ucy5oYXNUaW1lU3RhbXAgOiB0cnVlO1xuICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICBpZiAob3B0aW9ucy5oYXNOb25jZSAhPSBudWxsKSB7XG4gICAgdGhpcy5faGFzTm9uY2UgPSAhIW9wdGlvbnMuaGFzTm9uY2U7XG4gIH1cbiAgdGhpcy5faGFzVG9rZW5DcmVhdGVkID0gb3B0aW9ucy5oYXNUb2tlbkNyZWF0ZWQgfHwgdHlwZW9mIG9wdGlvbnMuaGFzVG9rZW5DcmVhdGVkID09PSAnYm9vbGVhbicgPyAhIW9wdGlvbnMuaGFzVG9rZW5DcmVhdGVkIDogdHJ1ZTtcbiAgaWYgKG9wdGlvbnMuYWN0b3IgIT0gbnVsbCkge1xuICAgIHRoaXMuX2FjdG9yID0gb3B0aW9ucy5hY3RvcjtcbiAgfVxuICBpZiAob3B0aW9ucy5tdXN0VW5kZXJzdGFuZCAhPSBudWxsKSB7XG4gICAgdGhpcy5fbXVzdFVuZGVyc3RhbmQgPSAhIW9wdGlvbnMubXVzdFVuZGVyc3RhbmQ7XG4gIH1cbn1cblxuV1NTZWN1cml0eS5wcm90b3R5cGUudG9YTUwgPSBmdW5jdGlvbigpIHtcbiAgLy8gYXZvaWQgZGVwZW5kZW5jeSBvbiBkYXRlIGZvcm1hdHRpbmcgbGlicmFyaWVzXG4gIGZ1bmN0aW9uIGdldERhdGUoZCkge1xuICAgIGZ1bmN0aW9uIHBhZChuKSB7XG4gICAgICByZXR1cm4gbiA8IDEwID8gJzAnICsgbiA6IG47XG4gICAgfVxuICAgIHJldHVybiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyAnLSdcbiAgICAgICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nXG4gICAgICArIHBhZChkLmdldFVUQ0RhdGUoKSkgKyAnVCdcbiAgICAgICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOidcbiAgICAgICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6J1xuICAgICAgKyBwYWQoZC5nZXRVVENTZWNvbmRzKCkpICsgJ1onO1xuICB9XG4gIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICB2YXIgY3JlYXRlZCA9IGdldERhdGUobm93KTtcbiAgdmFyIHRpbWVTdGFtcFhtbCA9ICcnO1xuICBpZiAodGhpcy5faGFzVGltZVN0YW1wKSB7XG4gICAgdmFyIGV4cGlyZXMgPSBnZXREYXRlKCBuZXcgRGF0ZShub3cuZ2V0VGltZSgpICsgKDEwMDAgKiA2MDApKSApO1xuICAgIHRpbWVTdGFtcFhtbCA9IFwiPHdzdTpUaW1lc3RhbXAgd3N1OklkPVxcXCJUaW1lc3RhbXAtXCIrY3JlYXRlZCtcIlxcXCI+XCIgK1xuICAgICAgXCI8d3N1OkNyZWF0ZWQ+XCIrY3JlYXRlZCtcIjwvd3N1OkNyZWF0ZWQ+XCIgK1xuICAgICAgXCI8d3N1OkV4cGlyZXM+XCIrZXhwaXJlcytcIjwvd3N1OkV4cGlyZXM+XCIgK1xuICAgICAgXCI8L3dzdTpUaW1lc3RhbXA+XCI7XG4gIH1cblxuICB2YXIgcGFzc3dvcmQsIG5vbmNlO1xuICBpZiAodGhpcy5faGFzTm9uY2UgfHwgdGhpcy5fcGFzc3dvcmRUeXBlICE9PSAnUGFzc3dvcmRUZXh0Jykge1xuICAgIC8vIG5vbmNlID0gYmFzZTY0ICggc2hhMSAoIGNyZWF0ZWQgKyByYW5kb20gKSApXG4gICAgLy8gdmFyIG5IYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKTtcbiAgICAvLyBuSGFzaC51cGRhdGUoY3JlYXRlZCArIE1hdGgucmFuZG9tKCkpO1xuICAgIC8vIG5vbmNlID0gbkhhc2guZGlnZXN0KCdiYXNlNjQnKTtcbiAgICBub25jZSA9IEJhc2U2NC5zdHJpbmdpZnkoc2hhMShjcmVhdGVkICsgTWF0aC5yYW5kb20oKSwgJycpKTtcbiAgfVxuICBpZiAodGhpcy5fcGFzc3dvcmRUeXBlID09PSAnUGFzc3dvcmRUZXh0Jykge1xuICAgIHBhc3N3b3JkID0gXCI8d3NzZTpQYXNzd29yZCBUeXBlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXVzZXJuYW1lLXRva2VuLXByb2ZpbGUtMS4wI1Bhc3N3b3JkVGV4dFxcXCI+XCIgKyB0aGlzLl9wYXNzd29yZCArIFwiPC93c3NlOlBhc3N3b3JkPlwiO1xuICAgIGlmIChub25jZSkge1xuICAgICAgcGFzc3dvcmQgKz0gXCI8d3NzZTpOb25jZSBFbmNvZGluZ1R5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtc29hcC1tZXNzYWdlLXNlY3VyaXR5LTEuMCNCYXNlNjRCaW5hcnlcXFwiPlwiICsgbm9uY2UgKyBcIjwvd3NzZTpOb25jZT5cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFzc3dvcmQgPSBcIjx3c3NlOlBhc3N3b3JkIFR5cGU9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3MtdXNlcm5hbWUtdG9rZW4tcHJvZmlsZS0xLjAjUGFzc3dvcmREaWdlc3RcXFwiPlwiICsgcGFzc3dvcmREaWdlc3Qobm9uY2UsIGNyZWF0ZWQsIHRoaXMuX3Bhc3N3b3JkKSArIFwiPC93c3NlOlBhc3N3b3JkPlwiICtcbiAgICAgIFwiPHdzc2U6Tm9uY2UgRW5jb2RpbmdUeXBlPVxcXCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy93c3MvMjAwNC8wMS9vYXNpcy0yMDA0MDEtd3NzLXNvYXAtbWVzc2FnZS1zZWN1cml0eS0xLjAjQmFzZTY0QmluYXJ5XFxcIj5cIiArIG5vbmNlICsgXCI8L3dzc2U6Tm9uY2U+XCI7XG4gIH1cblxuICByZXR1cm4gXCI8d3NzZTpTZWN1cml0eSBcIiArICh0aGlzLl9hY3RvciA/IFwic29hcDphY3Rvcj1cXFwiXCIgKyB0aGlzLl9hY3RvciArIFwiXFxcIiBcIiA6IFwiXCIpICtcbiAgICAodGhpcy5fbXVzdFVuZGVyc3RhbmQgPyBcInNvYXA6bXVzdFVuZGVyc3RhbmQ9XFxcIjFcXFwiIFwiIDogXCJcIikgK1xuICAgIFwieG1sbnM6d3NzZT1cXFwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvd3NzLzIwMDQvMDEvb2FzaXMtMjAwNDAxLXdzcy13c3NlY3VyaXR5LXNlY2V4dC0xLjAueHNkXFxcIiB4bWxuczp3c3U9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtd3NzZWN1cml0eS11dGlsaXR5LTEuMC54c2RcXFwiPlwiICtcbiAgICB0aW1lU3RhbXBYbWwgK1xuICAgIFwiPHdzc2U6VXNlcm5hbWVUb2tlbiB4bWxuczp3c3U9XFxcImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3dzcy8yMDA0LzAxL29hc2lzLTIwMDQwMS13c3Mtd3NzZWN1cml0eS11dGlsaXR5LTEuMC54c2RcXFwiIHdzdTpJZD1cXFwiU2VjdXJpdHlUb2tlbi1cIiArIGNyZWF0ZWQgKyBcIlxcXCI+XCIgK1xuICAgIFwiPHdzc2U6VXNlcm5hbWU+XCIgKyB0aGlzLl91c2VybmFtZSArIFwiPC93c3NlOlVzZXJuYW1lPlwiICtcbiAgICBwYXNzd29yZCArXG4gICAgKHRoaXMuX2hhc1Rva2VuQ3JlYXRlZCA/IFwiPHdzdTpDcmVhdGVkPlwiICsgY3JlYXRlZCArIFwiPC93c3U6Q3JlYXRlZD5cIiA6IFwiXCIpICtcbiAgICBcIjwvd3NzZTpVc2VybmFtZVRva2VuPlwiICtcbiAgICBcIjwvd3NzZTpTZWN1cml0eT5cIjtcbn07XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gV1NTZWN1cml0eTtcbiJdfQ==