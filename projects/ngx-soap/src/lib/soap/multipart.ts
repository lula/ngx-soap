export class Multipart  {
  preambleCRLF = true;
  postambleCRLF = true;

  build(parts, boundary) {
    const body = [];

    function add (part) {
      if (typeof part === 'number') {
        part = part.toString();
      }
      return body.push(part)
    }

    if (this.preambleCRLF) {
      add('\r\n')
    }

    parts.forEach(function (part) {
      let preamble = '--' + boundary + '\r\n';
      Object.keys(part).forEach(function (key) {
        if (key === 'body') { return }
        preamble += key + ': ' + part[key] + '\r\n'
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

    const size = body.map((part) => {
      if (typeof part === 'string') {
        return part.length
      } else {
        return part.byteLength;
      }
    }).reduce((a, b) => a + b, 0);

    let uint8array = new Uint8Array(size);
    let i = 0;
    body.forEach((part) => {
      if (typeof part === 'string') {
        for (let j = 0; j < part.length; i++, j++) {
          uint8array[i] = part.charCodeAt(j) & 0xff;
        }
      } else {
        for (let j = 0; j < part.byteLength; i++, j++) {
          uint8array[i] = part[j];
        }
      }
    });
    return uint8array.buffer;
  }

}
