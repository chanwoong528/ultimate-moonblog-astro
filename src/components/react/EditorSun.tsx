//@ts-nocheck
import React, { useRef, useEffect } from "react";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Imp
import { CONTENT_TYPE } from "../../common/utils/constant/BE_DATA_TYPES";


const EditorSun = ({ type, parent, onClickSave }) => {
  const editor = useRef();
  const commentButtonList = useRef([
    // ["undo", "redo"],
    // ["paragraphStyle", "blockquote"],
    // ["bold", "underline", "italic", "strike"],
    // ["fontColor", "hiliteColor"],
    // ["outdent", "indent"],
    // ["align", "horizontalRule", "list"],
    // ["link", "image" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
    // ["fullScreen", "showBlocks", "codeView"], //tobe removed
    ["save"],
  ]);
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  return (
    <div className="editor-con">
      <SunEditor
        setOptions={{
          buttonList:
            type === CONTENT_TYPE.comment
              ? commentButtonList.current
              : buttonList.complex,
        }}
        getSunEditorInstance={getSunEditorInstance}
        placeholder="The editor's default value"
        setAllPlugins={true}
        onSave={(content, core) => {
          onClickSave(content, parent);
        }}
      />
    </div>
  );
};

export default EditorSun;
