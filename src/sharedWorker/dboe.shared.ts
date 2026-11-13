import { initDB, deleteDatabase } from "./initDB";
import { start } from "./start";

if (!("SharedWorkerGlobalScope" in self && self instanceof SharedWorkerGlobalScope)) {
  throw new Error("Not running in SharedWorkerGlobalScope");
}

self.onconnect = (event: MessageEvent) => {
  const [port] = event.ports;

  port.onmessage = (event: MessageEvent<APIRequest<any>>) => {
    async function handleRequest({ name, data }: APIRequest<any>, handlers: Handlers) {
      try {
        const handler = handlers[name];
        if (!handler) {
          throw new Error(`Handler for ${name} not found`);
        }

        handler({ port, data });
      } catch (error) {
        port.postMessage({ error: (error as Error).message });
      }
    }
    const req = event.data;
    void handleRequest(req, handlers);
  };

  port.start();
};

export type HandlerProps<Data extends Record<string, unknown> | null> = {
  port: MessagePort;
  data: Data;
};

export type EmptyData = Record<string, never>;

export type Handler<
  P extends Record<string, unknown> | null,
  R extends Record<string, unknown> | void,
> = ({ port, data }: HandlerProps<P>) => R;

type Handlers = {
  [name: string]: Handler<any, any>;
};

const handlers = {
  start,
  initDB,
  deleteDatabase,
} as const satisfies Handlers;

type APIRequest<H extends Handlers> = {
  [N in keyof H]: {
    name: N;
    data: Parameters<H[N]>[0]["data"];
  };
}[keyof H];

export type APIRequestH = APIRequest<typeof handlers>;
