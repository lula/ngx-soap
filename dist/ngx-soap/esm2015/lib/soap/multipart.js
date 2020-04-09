/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class Multipart {
    constructor() {
        this.preambleCRLF = true;
        this.postambleCRLF = true;
    }
    /**
     * @param {?} parts
     * @param {?} boundary
     * @return {?}
     */
    build(parts, boundary) {
        /** @type {?} */
        const body = [];
        /**
         * @param {?} part
         * @return {?}
         */
        function add(part) {
            if (typeof part === 'number') {
                part = part.toString();
            }
            return body.push(part);
        }
        if (this.preambleCRLF) {
            add('\r\n');
        }
        parts.forEach(function (part) {
            /** @type {?} */
            let preamble = '--' + boundary + '\r\n';
            Object.keys(part).forEach(function (key) {
                if (key === 'body') {
                    return;
                }
                preamble += key + ': ' + part[key] + '\r\n';
            });
            preamble += '\r\n';
            add(preamble);
            add(part.body);
            add('\r\n');
        });
        add('--' + boundary + '--');
        if (this.postambleCRLF) {
            add('\r\n');
        }
        /** @type {?} */
        const size = body.map((part) => {
            if (typeof part === 'string') {
                return part.length;
            }
            else {
                return part.byteLength;
            }
        }).reduce((a, b) => a + b, 0);
        /** @type {?} */
        let uint8array = new Uint8Array(size);
        /** @type {?} */
        let i = 0;
        body.forEach((part) => {
            if (typeof part === 'string') {
                for (let j = 0; j < part.length; i++, j++) {
                    uint8array[i] = part.charCodeAt(j) & 0xff;
                }
            }
            else {
                for (let j = 0; j < part.byteLength; i++, j++) {
                    uint8array[i] = part[j];
                }
            }
        });
        return uint8array.buffer;
    }
}
if (false) {
    /** @type {?} */
    Multipart.prototype.preambleCRLF;
    /** @type {?} */
    Multipart.prototype.postambleCRLF;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwYXJ0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNvYXAvIiwic291cmNlcyI6WyJsaWIvc29hcC9tdWx0aXBhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQXRCO1FBQ0UsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsa0JBQWEsR0FBRyxJQUFJLENBQUM7SUF5RHZCLENBQUM7Ozs7OztJQXZEQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVE7O2NBQ2IsSUFBSSxHQUFHLEVBQUU7Ozs7O1FBRWYsU0FBUyxHQUFHLENBQUUsSUFBSTtZQUNoQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUN4QjtZQUNELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNaO1FBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7O2dCQUN0QixRQUFRLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztnQkFDckMsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU07aUJBQUU7Z0JBQzlCLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUE7WUFDN0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLElBQUksTUFBTSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDYjs7Y0FFSyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzdCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7YUFDbkI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7O1lBRXpCLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7O1lBQ2pDLENBQUMsR0FBRyxDQUFDO1FBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3BCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUMzQzthQUNGO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDM0IsQ0FBQztDQUVGOzs7SUExREMsaUNBQW9COztJQUNwQixrQ0FBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgTXVsdGlwYXJ0ICB7XHJcbiAgcHJlYW1ibGVDUkxGID0gdHJ1ZTtcclxuICBwb3N0YW1ibGVDUkxGID0gdHJ1ZTtcclxuXHJcbiAgYnVpbGQocGFydHMsIGJvdW5kYXJ5KSB7XHJcbiAgICBjb25zdCBib2R5ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkIChwYXJ0KSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcGFydCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBwYXJ0ID0gcGFydC50b1N0cmluZygpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBib2R5LnB1c2gocGFydClcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wcmVhbWJsZUNSTEYpIHtcclxuICAgICAgYWRkKCdcXHJcXG4nKVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcclxuICAgICAgbGV0IHByZWFtYmxlID0gJy0tJyArIGJvdW5kYXJ5ICsgJ1xcclxcbic7XHJcbiAgICAgIE9iamVjdC5rZXlzKHBhcnQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGlmIChrZXkgPT09ICdib2R5JykgeyByZXR1cm4gfVxyXG4gICAgICAgIHByZWFtYmxlICs9IGtleSArICc6ICcgKyBwYXJ0W2tleV0gKyAnXFxyXFxuJ1xyXG4gICAgICB9KTtcclxuICAgICAgcHJlYW1ibGUgKz0gJ1xcclxcbic7XHJcbiAgICAgIGFkZChwcmVhbWJsZSk7XHJcbiAgICAgIGFkZChwYXJ0LmJvZHkpO1xyXG4gICAgICBhZGQoJ1xcclxcbicpO1xyXG4gICAgfSk7XHJcbiAgICBhZGQoJy0tJyArIGJvdW5kYXJ5ICsgJy0tJyk7XHJcblxyXG4gICAgaWYgKHRoaXMucG9zdGFtYmxlQ1JMRikge1xyXG4gICAgICBhZGQoJ1xcclxcbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNpemUgPSBib2R5Lm1hcCgocGFydCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHBhcnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnQubGVuZ3RoXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnQuYnl0ZUxlbmd0aDtcclxuICAgICAgfVxyXG4gICAgfSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcblxyXG4gICAgbGV0IHVpbnQ4YXJyYXkgPSBuZXcgVWludDhBcnJheShzaXplKTtcclxuICAgIGxldCBpID0gMDtcclxuICAgIGJvZHkuZm9yRWFjaCgocGFydCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHBhcnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXJ0Lmxlbmd0aDsgaSsrLCBqKyspIHtcclxuICAgICAgICAgIHVpbnQ4YXJyYXlbaV0gPSBwYXJ0LmNoYXJDb2RlQXQoaikgJiAweGZmO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnQuYnl0ZUxlbmd0aDsgaSsrLCBqKyspIHtcclxuICAgICAgICAgIHVpbnQ4YXJyYXlbaV0gPSBwYXJ0W2pdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdWludDhhcnJheS5idWZmZXI7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=