class Queue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;

  get isRunning() {
    return this.running;
  }

  add = async <T>(action: () => Promise<T>) => {
    let resolveResponder: (response: T) => void;
    const responder = new Promise<T>((resolve) => {
      resolveResponder = resolve;
    });
    const wrapper = () => new Promise<T>(async (resolve) => {
      const response = await action();
      resolveResponder(response);
      resolve(response);
    });
    this.queue.push(wrapper);
    if (!this.running) {
      this.run();
    }
    return responder;
  }

  private run = async () => {
    this.running = true;
    let nextTask = this.queue.shift();
    if (!nextTask) {
      this.running = false;
      return;
    }
    await nextTask();
    this.run();
  }
}

export default Queue;