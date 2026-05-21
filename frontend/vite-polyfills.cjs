// Minimal Blob + File polyfills for Node builds (only define if missing)
if (typeof globalThis.File === 'undefined') {
  if (typeof globalThis.Blob === 'undefined') {
    globalThis.Blob = class {
      constructor(parts = [], options = {}) {
        this.parts = parts;
        this.type = options?.type || '';
        this.size = parts.reduce((s, p) => s + (typeof p === 'string' ? Buffer.byteLength(p) : (p && p.length) || 0), 0);
      }
      async arrayBuffer() { return Buffer.concat(this.parts.map(p => Buffer.from(String(p)))); }
      text() { return Promise.resolve(this.parts.map(p => String(p)).join('')); }
    };
  }

  class FilePoly extends globalThis.Blob {
    constructor(parts = [], name = '', options = {}) {
      super(parts, options);
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
    }
  }

  globalThis.File = FilePoly;
}