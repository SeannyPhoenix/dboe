import type { HandlerProps } from './dboe.shared';

export async function start({ port }: HandlerProps<null>) {
  port.postMessage({
    success: true,
    data: { workerName: self.name },
  });
}
