import { FC, useState, memo } from 'react';
import { ServerConfig } from '@/hooks/useMockServerClient';


interface BindMockServerProps {
  onSyncMockServer: (config: ServerConfig) => void;
}

const BindMockServer: FC<BindMockServerProps> = ({ onSyncMockServer }) => {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('1080');

  const isValid = !!host && !!port;

  const handleBindServer = () => {
    onSyncMockServer({ host, port: Number(port) });
  };

  return (
    <div className="h-[100svh] bg-[#2e3235]">
      <div className="flex flex-col justify-center h-full max-w-[440px] mx-auto">
        <div className="flex flex-col">
          <label className="text-white font-bold mr-2 mb-1">
            MockServer Host
          </label>
          <input
            type="text"
            placeholder="server host"
            className="px-2 py-1 rounded-md"
            value={host}
            onChange={({ target: { value }}) => setHost(value)}
          />
        </div>
        <div className="flex flex-col mt-2">
          <label className="text-white font-bold mr-2 mb-1">
            MockServer Port
          </label>
          <input
            type="text"
            placeholder="server port"
            className="px-2 py-1 rounded-md"
            value={port}
            onChange={({ target: { value }}) => setPort(value)}
          />
        </div>
        <button
          className="p-2 text-center text-white bg-green-600 hover:bg-green-500 mt-6 rounded-lg font-bold select-none cursor-pointer"
          role="button"
          disabled={!isValid}
          onClick={isValid ? handleBindServer : undefined}
        >
          Sync Server Client
        </button>
      </div>
    </div>
  );
};

export default memo(BindMockServer);
