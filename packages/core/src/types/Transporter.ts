interface Transporter {
  exists: (id: string) => Promise<boolean>;
  set: (id: string, content: string) => Promise<void>;
  get: (id: string) => Promise<string>;
  waitForPackage?: (id: string) => Promise<void>;
}

export default Transporter;
