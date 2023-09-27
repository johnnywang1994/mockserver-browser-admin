declare namespace globalThis {
  import { MockServerClient } from 'mockserver-client/mockServerClient';
  interface Window {
    mockServerClient: MockServerClient;
  }
}
