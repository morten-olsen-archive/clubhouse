interface Store {
  getIdentity: () => Promise<any>;
  getNames: () => Promise<string[]>;
  getChannelConfig: (name: string) => Promise<any>;
  setChannelConfig: (name: string, value: any) => Promise<void>;
  getSocialConfig: (name: string) => Promise<any>;
  setSocialConfig: (name: string, value: any) => Promise<void>;
}

export default Store;
