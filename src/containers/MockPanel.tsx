import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FC, useState, useEffect } from 'react';
import type { Expectation } from 'mockserver-client';
import yaml from 'js-yaml';
import { Icon } from '@iconify/react';

import useMockServerClient, { ServerConfig } from '@/hooks/useMockServerClient';
import BindMockServer from '@/components/BindMockServer';
import Panel from '@/components/Panel';
import ReactCodeEditor from '@/components/CodeMirror';

const toastError = (msg: string) => {
  toast.error(msg, {
    autoClose: 3000,
  });
};

const toastSuccess = (msg: string) => {
  toast.success(msg, {
    autoClose: 3000,
  });
};

// default use JSON format
const parseExpectation = (str: string) => {
  let expect;
  try {
    expect = JSON.parse(str);
  } catch {
    expect = yaml.load(str);
  }
  return expect;
};

const strigifyExpectation = (obj: Expectation, type: 'YAML' | 'JSON') => {
  if (type === 'YAML') return yaml.dump(obj);
  return JSON.stringify(obj, null, 2);
};

const activeFormatClass = 'text-sky-300 font-bold';

const MockPanel: FC = () => {
  const {
    client,
    allActiveExpect,
    Model,
    serverConfig,
  } = useMockServerClient();

  const [editingExpect, setEditingExpect] = useState<Expectation>();
  const [switchYaml, setSwitchYaml] = useState(false);

  const isValidServerConfig = !!serverConfig?.host && !!serverConfig?.port;

  const handleSelectExpectation = (expectation: Expectation) => {
    setEditingExpect(expectation);
    setSwitchYaml(false);
  };

  const handleNewExpectation = () => {
    setEditingExpect({});
    setSwitchYaml(false);
  };

  const handleSaveExpection = async () => {
    if (editingExpect && Object.keys(editingExpect).length > 0) {
      try {
        if (editingExpect.id) {
          await Model.createExpect(editingExpect);
        } else {
          await Model.updateExpect(editingExpect);
        }
        setEditingExpect(undefined);
        toastSuccess('Save successful');
      } catch(err) {
        console.error(err);
        toastError('Failed to save');
      }
    }
  };

  const handleClearExpection = async (id?: string) => {
    if (
      id &&
      window.confirm('Are you sure you wish to delete this expectation?')
    ) {
      try {
        await Model.clearExpectById(id);
        toastSuccess('Clear successful');
        // if current editing expect was deleted
        if (editingExpect?.id === id) {
          setEditingExpect(undefined);
        }
      } catch(err) {
        console.error(err);
        toastError('Failed to clear');
      }
    }
  };

  const handleEditorChanged = (newValue: string) => {
    let newExpect;
    try {
      newExpect = parseExpectation(newValue);
      setEditingExpect({
        ...newExpect,
        id: editingExpect?.id,
      });
    } catch {
      toastError('Invalid json or yaml format');
    }
  };

  const handleBindServerConfig = (config: ServerConfig) => {
    Model.bindMockServer(config.host, config.port);
  };

  useEffect(() => {
    if (client) {
      try {
        Model.getAllActiveExpect();
      } catch(err) {
        console.error(err);
        toastError('Failed to get all active expectations');
      }
    }
  }, [client, Model]);

  return isValidServerConfig ? (
    <>
      <div className="flex-1 flex overflow-auto">
        <Panel
          editingExpect={editingExpect}
          activeExpects={allActiveExpect}
          onNewExpection={handleNewExpectation}
          onSaveExpection={handleSaveExpection}
          onClearExpection={handleClearExpection}
          onSelectExpectation={handleSelectExpectation}
          onCancelEdit={() => setEditingExpect(undefined)}
          onReloadActiveExpectation={Model.getAllActiveExpect}
        />
        <div className="relative flex-1 overflow-auto">
          {editingExpect && (
            <ReactCodeEditor
              key={`${editingExpect.id}-${switchYaml ? 'yaml' : 'json'}`}
              delay={1000}
              initialValue={
                strigifyExpectation({
                  ...editingExpect,
                  id: undefined,
                }, switchYaml ? 'YAML' : 'JSON')
              }
              onChange={handleEditorChanged}
            />
          )}
          <div
            className="absolute flex items-center right-1 top-1 text-xs text-white bg-yellow-800 hover:bg-yellow-700 px-2 py-1 rounded-md select-none cursor-pointer shadow-md"
            onClick={() => setSwitchYaml(!switchYaml)}
          >
            <span className={switchYaml ? activeFormatClass : ''}>YAML</span>
            <Icon className="mx-1" icon="icon-park-outline:switch" />
            <span className={!switchYaml ? activeFormatClass : ''}>JSON</span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  ) : (
    <BindMockServer onSyncMockServer={handleBindServerConfig} />
  );
}

export default MockPanel;
