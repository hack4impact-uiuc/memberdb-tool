// @flow
import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import '../../css/Note.css';

/**
 * @constant
 * @type {Array<Array<Object>}
 */
const TOOLBAR_BLOCKS = Object.freeze([
  [
    ...['header-one', 'header-two', 'header-three', 'header-four'].map(
      (header, idx) => ({
        value: header,
        icon: (
          <>
            <Icon name="header" />
            {idx + 1}
          </>
        ),
      }),
    ),
    {
      value: 'blockquote',
      icon: <Icon name="quote left" />,
    },
    {
      value: 'code-block',
      icon: <Icon name="code" />,
    },
  ],
  [
    { value: 'unordered-list-item', icon: <Icon name="list ul" /> },
    { value: 'ordered-list-item', icon: <Icon name="list ol" /> },
  ],
]);

/**
 * @constant
 * @type {Array<Array<String>}
 */
const TOOLBAR_STYLES = Object.freeze([['bold', 'italic', 'underline']]);

type EditorToolbarProps = {
  handleRichStyle: Function,
  handleBlockType: Function,
};

/**
 * Toolbar for formatting in a DraftJS editor provided
 * callbacks for toggling rich styles and block types
 *
 * @param {*} props
 * @returns
 */
function EditorToolbar({
  handleRichStyle,
  handleBlockType,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      {TOOLBAR_BLOCKS.map((group) => (
        <Button.Group>
          {group.map((block) => (
            <Button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                handleBlockType(block.value);
              }}
              icon
            >
              {block.icon}
            </Button>
          ))}
        </Button.Group>
      ))}
      {TOOLBAR_STYLES.map((group) => (
        <Button.Group>
          {group.map((style) => (
            <Button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleRichStyle(style.toUpperCase())}
              icon
            >
              <Icon name={style} />
            </Button>
          ))}
        </Button.Group>
      ))}
    </div>
  );
}

export default EditorToolbar;
