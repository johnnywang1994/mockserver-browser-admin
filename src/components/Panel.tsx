import { FC, memo } from 'react';
import type { Expectation, HttpRequest } from 'mockserver-client';
import { Icon } from '@iconify/react';

const HttpMethodColor: Record<string, string> = {
  GET: 'text-green-500',
  POST: 'text-amber-600',
  PUT: 'text-sky-500',
  PATCH: 'text-violet-400',
  DELETE: 'text-rose-600',
  HEAD: 'text-emerald-500',
  OPTIONS: 'text-fuchsia-500',
  Any: '',
};

interface MockPanelProps {
  editingExpect?: Expectation;
  activeExpects?: Expectation[];
  onNewExpection: () => void;
  onSaveExpection: () => void;
  onClearExpection: (id?: string) => void;
  onSelectExpectation: (expectation: Expectation) => void;
  onCancelEdit: () => void;
  onReloadActiveExpectation: () => void;
}

const MockPanel: FC<MockPanelProps> = ({
  editingExpect,
  activeExpects,
  onNewExpection,
  onSaveExpection,
  onClearExpection,
  onSelectExpectation,
  onCancelEdit,
  onReloadActiveExpectation,
}) => {
  const isEditing = !!editingExpect;
  return (
    <div className="w-[250px] px-6 py-5 text-white bg-gray-800">
      <div className="flex items-center">
        <div
          className="inline-block p-2 bg-green-600/70 hover:bg-green-600 rounded-lg select-none cursor-pointer"
          role="button"
          title={isEditing ? 'save expectation' : 'create new expectation'}
          onClick={isEditing ? onSaveExpection : onNewExpection}
        >
          <Icon
            icon={isEditing ? 'mingcute:save-fill' : 'gridicons:add'}
            width="30"
          />
        </div>
        {isEditing ? (
          <div
            className="inline-block p-2 bg-gray-500/70 hover:bg-gray-500 rounded-lg select-none cursor-pointer ml-2"
            role="button"
            title="cancel editing"
            onClick={onCancelEdit}
          >
            <Icon icon="mdi:file-cancel" width="30" />
          </div>
        ) : (
          <div
            className="inline-block p-2 bg-gray-500/70 hover:bg-gray-500 rounded-lg select-none cursor-pointer ml-2"
            role="button"
            title="sync mock server"
            onClick={onReloadActiveExpectation}
          >
            <Icon icon="tabler:reload" width="30" />
          </div>
        )}
      </div>

      <div className="flex flex-col pt-4">
        {activeExpects ? (
          activeExpects.map((expectation) => {
            const req = expectation.httpRequest as HttpRequest;
            const path = req?.path;
            const method = ((req?.method ?? 'ANY') as string).toUpperCase();
            const httpMethodColor = HttpMethodColor[method];
            const isCurrentEditing = expectation.id === editingExpect?.id;
            return (
              <div
                key={expectation.id}
                className={`flex items-center pl-4 pr-2 py-2 mb-1 text-sm rounded-lg select-none cursor-pointer [&>.icon-trash]:hover:opacity-100 ${
                  isCurrentEditing
                    ? 'bg-sky-600'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                role="listitem"
                onClick={() => onSelectExpectation(expectation)}
              >
                <span className={`text-xs font-bold mr-1 ${httpMethodColor}`}>
                  {method}
                </span>
                {typeof path === 'object' ? path.value : path}
                <span></span>
                <div
                  className="icon-trash ml-auto opacity-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearExpection(expectation.id);
                  }}
                >
                  <Icon icon="iconamoon:trash-light" width="16" />
                </div>
              </div>
            );
          })) : (
            <div className="flex justify-center w-full">
              <Icon icon="eos-icons:bubble-loading" width="30" />
            </div>
          )}
      </div>
    </div>
  );
}

export default memo(MockPanel);