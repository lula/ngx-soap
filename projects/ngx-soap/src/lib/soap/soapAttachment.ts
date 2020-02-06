export class SoapAttachment {

  constructor(public mimetype: string,
              public contentId: string,
              public name: string,
              public body: any
  ) {

  }

  static fromFormFiles(files: FileList | File[]): Promise<any> {
    if (files instanceof FileList) {
      files = Array.from(files);
    }

    const promisses = files.map((file) => {
      return new Promise(function(resolve) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
          const arrayBuffer = (e.target as any).result;
          const bytes = new Uint8Array(arrayBuffer);
          const attachment = new SoapAttachment(file.type, file.name, file.name, bytes);
          resolve(attachment);
        }
      });
   });

   return Promise.all(promisses);
  }

}
