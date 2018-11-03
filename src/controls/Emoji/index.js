/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContentState, convertFromHTML, Modifier, EditorState } from 'draft-js';

import LayoutComponent from './Component';

export default class Emoji extends Component {
  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    expanded: false,
  };

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded;
  };

  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  }

  doExpand: Function = (): void => {
    this.setState({
      expanded: true,
    });
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false,
    });
  };

  addEmoji: Function = (emoji: string): void => {
    const { editorState, onChange } = this.props;
    // const newBlock = convertFromHTML(`<span>${emoji}</span>`);

    // console.log(newBlock);

    // const newState = EditorState.createEmpty();
    // const newContent = newState.getCurrentContent();
    // const newBlockMap = newContent.getBlocksAsArray();
    // newBlockMap.splice(0, 1, newBlock.contentBlocks[0]);

    // const newContentState =
    //     ContentState.createFromBlockArray(newBlockMap, newBlockMap.entityMap);

    // const contentState = Modifier.replaceWithFragment(
    //   editorState.getCurrentContent(),
    //   editorState.getSelection(),
    //   newContentState.getBlockMap(),
    //   // editorState.getCurrentInlineStyle(),
    // );

    const contentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle(),
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    // onChange(EditorState.push(editorState, contentState, 'insert-fragment'));
    this.doCollapse();
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded } = this.state;
    const EmojiComponent = config.component || LayoutComponent;
    return (
      <EmojiComponent
        config={config}
        translations={translations}
        onChange={this.addEmoji}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onCollpase={this.closeModal}
      />
    );
  }
}

// todo: unit test cases
