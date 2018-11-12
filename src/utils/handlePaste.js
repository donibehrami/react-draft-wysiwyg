import { getSelectedBlock } from "draftjs-utils";
import { Modifier, EditorState, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { OrderedMap, List } from "immutable";

export const handlePastedText = (text, html, editorState, onChange) => {
  const selectedBlock = getSelectedBlock(editorState);
  if (selectedBlock && selectedBlock.type === "code") {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
    return true;
  } else if (html) {
    const content = document.createElement('div');
    content.innerHTML = html;
    const elements = Array.from(content.getElementsByTagName('*'));
    elements && elements.map((element) => {
      element.style.fontSize = element.style.fontSize.replace('pt', 'px');
    });
    const returnHtml = content && content.innerHTML ? content.innerHTML : html;
    const contentBlock = htmlToDraft(returnHtml);
    let contentState = editorState.getCurrentContent();
    contentBlock.entityMap.forEach((value, key) => {
      contentState = contentState.mergeEntityData(key, value);
    });
    contentState = Modifier.replaceWithFragment(
      contentState,
      editorState.getSelection(),
      new List(contentBlock.contentBlocks)
    );
    onChange(EditorState.push(editorState, contentState, "insert-characters"));
    return true;
  }
  return false;
};
