import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expectation, ExpectationId } from 'mockserver-client';
import type { MockServerClient, PathOrRequestDefinition } from 'mockserver-client/mockServerClient';

export type ServerConfig = {
  host: string;
  port: number;
}

function retry(callback: () => void, retryCount = -1) {
  let interval = 1000;
  const run = () => {
    try {
      callback();
    } catch {
      if (retryCount === 0) return;
      setTimeout(() => run(), interval);
      retryCount--;
      interval*=1.5;
    }
  };
  run();
}

function useMockServerClient(host?: string, port?: number) {
  const [serverConfig, setServerConfig] = useState<ServerConfig>();
  const [client, setClient] = useState<MockServerClient>();
  const [allActiveExpect, setAllActiveExpect] = useState<Expectation[] | undefined>();

  const getAllActiveExpect = useCallback(async () => {
    const res = await client?.retrieveActiveExpectations({});
    setAllActiveExpect(res);
  }, [client]);

  const createExpect = useCallback(async (expectation: Expectation) => {
    await client?.mockAnyResponse(expectation);
    getAllActiveExpect();
  }, [client, getAllActiveExpect]);

  const clearExpectByMatcher = useCallback(async (matcher: PathOrRequestDefinition) => {
    await client?.clear(matcher, 'EXPECTATIONS');
    getAllActiveExpect();
  }, [client, getAllActiveExpect]);

  const clearExpectById = useCallback(async (id?: string) => {
    if (id) {
      await client?.clearById(id as unknown as ExpectationId, 'EXPECTATIONS');
      getAllActiveExpect();
    }
  }, [client, getAllActiveExpect]);

  const updateExpect = useCallback(async (expectation: Expectation) => {
    await Promise.allSettled([
      createExpect(expectation),
      clearExpectById(expectation.id),
    ]);
  }, [createExpect, clearExpectById]);

  const bindMockServer = useCallback((h: string, p: number) => {
    setServerConfig({ host: h, port: p });
    retry(() => {
      if (typeof window.mockServerClient === 'function') {
        setClient(window.mockServerClient(h, p));
      } else {
        throw Error('retry');
      }
    }, 3);
  }, []);

  useEffect(() => {
    if (!!host && !!port) {
      bindMockServer(host, port);
    }
  }, [host, port, bindMockServer]);

  const Model = useMemo(() => ({
    createExpect,
    getAllActiveExpect,
    clearExpectByMatcher,
    clearExpectById,
    updateExpect,
    bindMockServer,
  }), [
    createExpect,
    getAllActiveExpect,
    clearExpectByMatcher,
    clearExpectById,
    updateExpect,
    bindMockServer,
  ]);

  return {
    serverConfig,
    client,
    allActiveExpect,
    Model,
  };
}

export default useMockServerClient;
