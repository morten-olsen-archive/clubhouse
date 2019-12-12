interface Message<T = any> {
  message: T;
  data: string;
  sender: {
    fingerprint?: string;
    id: string;
  };
  receivers: {
    fingerprint?: string;
    id: string;
  }[];
}

export default Message;
