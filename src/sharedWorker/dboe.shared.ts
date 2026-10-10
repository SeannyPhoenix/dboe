import { start } from './start';

if (!('SharedWorkerGlobalScope' in self && self instanceof SharedWorkerGlobalScope)) {
  throw new Error('Not running in SharedWorkerGlobalScope');
}

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];

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
    handleRequest(req, handlers);
  };

  port.start();
};

export type HandlerProps<Data extends Record<string, unknown> | null> = {
  port: MessagePort;
  data: Data;
};

type Handler<Data extends Record<string, unknown>> = ({ port, data }: HandlerProps<Data>) => void;

type Handlers = {
  [name: string]: Handler<any>;
};

const handlers = {
  start,
  time: async ({ port }: HandlerProps<null>) => {
    port.postMessage({
      success: true,
      data: new Date().toISOString(),
    });
  },
} as const satisfies Handlers;

type APIRequest<H extends Handlers> = {
  [N in keyof H]: {
    name: N;
    data: Parameters<H[N]>[0]['data'];
  };
}[keyof H];

export type APIRequestH = APIRequest<typeof handlers>;
