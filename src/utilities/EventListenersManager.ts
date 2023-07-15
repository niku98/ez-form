type Listeners<T> = {
  [P in keyof T]?: Set<(...param: T[P] extends [] ? T[P] : any[]) => void>;
};

type Listener<E> = (...param: E extends [] ? E : any[]) => void;

export class EventListenersManager<
  ListEvents extends { [key: string]: any[] }
> {
  private listeners: Listeners<ListEvents>;

  constructor() {
    this.listeners = {} as Listeners<ListEvents>;
  }

  trigger<K extends keyof ListEvents>(event: K, ...params: ListEvents[K]) {
    const listeners = this.listeners[event];

    listeners?.forEach((listener) => {
      listener(...params);
    });
  }

  on<K extends keyof ListEvents>(event: K, listener: Listener<ListEvents[K]>) {
    const listeners = this.listeners[event];

    if (listeners) {
      !listeners.has(listener) && listeners?.add(listener);
    } else {
      this.listeners[event] = new Set([listener]);
    }

    return () => {
      this.off(event, listener);
    };
  }

  off<K extends keyof ListEvents>(event: K, listener: Listener<ListEvents[K]>) {
    const listeners = this.listeners[event];

    if (listeners) {
      listeners.delete(listener);
    } else {
      throw new Error(`${this} is doesn't have event "${String(event)}"`);
    }
  }
}
