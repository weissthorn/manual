import React from 'react';
import SunEditor, { buttonList } from 'suneditor-react';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

export default function Editor({ value, onChange }) {
  /**
   * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
   */
  const editorRef = React.useRef();

  React.useEffect(() => {}, []);

  return (
    <div style={{ marginBottom: 15 }}>
      <SunEditor
        ref={editorRef}
        setOptions={{
          height: 200,
          buttonList: [
            [
              'undo',
              'redo',
              'formatBlock',
              'blockquote',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'align',
              'list',
              'table',
              'link',
              'image',
              'video',
            ],
          ],
        }}
        defaultValue={value}
        onChange={onChange}
      />
    </div>
  );
}
