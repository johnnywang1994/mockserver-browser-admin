import { useRef, useState, useEffect, useCallback, FC, PropsWithChildren, memo } from 'react';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { StreamLanguage } from "@codemirror/language"
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { material } from '@uiw/codemirror-theme-material';
import type { Extension } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';

interface Props extends PropsWithChildren {
  height?: string;
  theme?: ReactCodeMirrorProps['theme'];
  extensions?: Extension[];
  initialValue?: string;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  delay?: number;
  readOnly?: boolean;
}

const ReactCodeEditor: FC<Props> = ({
  height = '100%',
  theme = material,
  extensions = [json(), StreamLanguage.define(yaml)],
  initialValue,
  onChange,
  delay,
  readOnly = false,
}) => {
  const [editorValue, setEditorValue] = useState(initialValue || '');
  const updateTimerRef = useRef<NodeJS.Timeout>();

  const onValueChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    const change = () => {
      setEditorValue(value);
      if (onChange) onChange(value, viewUpdate);
    };
    if (delay && typeof delay === 'number') {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = setTimeout(() => change(), delay);
    } else {
      change();
    }
  }, [onChange, delay]);

  useEffect(() => () => {
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = undefined;
    }
  }, []);

  return (
    <CodeMirror
      className="text-lg"
      height={height}
      value={editorValue}
      readOnly={readOnly}
      extensions={extensions}
      theme={theme}
      basicSetup={{
        lineNumbers: true,
        autocompletion: true,
      }}
      onChange={onValueChange}
    />
  );
};

export default memo(ReactCodeEditor);
