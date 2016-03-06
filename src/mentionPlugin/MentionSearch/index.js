import React, { Component } from 'react';

import Dropdown from './Dropdown';
import MentionOption from './MentionOption';
import addMention from '../modifiers/addMention';
import styles from './styles';
import getSearchText from '../utils/getSearchText';

export default (mentions) => {
  class MentionSearch extends Component {

    componentWillMount() {
      console.log('attach keyboard events');
    }

    componentWillUnmount() {
      console.log('remove keyboard events');
    }

    onMentionSelect = (mention) => {
      const newEditorState = addMention(this.props.editor.props.editorState, mention, this.lastSelection);
      this.props.editor.onChange(newEditorState);
    };

    // Get the first 5 mentions that match
    getMentionsForFilter = () => {
      const { word } = getSearchText(this.props.editor.props.editorState, this.lastSelection);
      const mentionValue = word.substring(1, word.length).toLowerCase();
      const filteredValues = mentions && mentions.filter((mention) => (
        !mentionValue || mention.get('handle').toLowerCase().indexOf(mentionValue) > -1
      ));
      const size = filteredValues.size < 5 ? filteredValues.size : 5;
      return filteredValues.setSize(size);
    };

    renderItemForMention = (mention) => (
      <div key={ mention.get('handle') }
        eventKey={ mention.get('handle') }
        onClick={ this.onMentionSelect }
      >
        <span>{ mention.get('handle') }</span>
      </div>
    );

    render() {
      // TODO ask issac to provide begin & end down to the component as prop (in decorators)
      this.lastSelection = this.props.editor.props.editorState.getSelection();
      const filteredMentions = this.getMentionsForFilter();
      return (
        <span {...this.props} style={ styles.root }>
          { this.props.children }
          { filteredMentions.size > 0 ?
            <Dropdown>
            {
              this.getMentionsForFilter().map((mention) => (
                <MentionOption
                  key={ mention.get('handle') }
                  onMentionSelect={ this.onMentionSelect }
                  mention={ mention }
                />
              ))
            }
          </Dropdown>
          : null}
        </span>
      );
    }
  }

  return MentionSearch;
};
