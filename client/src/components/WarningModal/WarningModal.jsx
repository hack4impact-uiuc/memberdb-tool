// @flow
import React, { Node } from 'react';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';

import '../../css/WarningModal.css';

type WarningModalProp = {
  title: String,
  description: String,
  noAction: () => void,
  yesAction: () => void,
  isOpen: Bool,
  noText?: String,
  yesText?: String,
};

const WarningModal = ({
  title,
  description,
  noAction,
  yesAction,
  isOpen,
  noText = 'No',
  yesText = 'Yes',
}: WarningModalProp): Node => (
  <Modal className="warning-modal" open={isOpen}>
    <Header className="warning-modal-title" content={title} />
    <Modal.Content>
      <p className="warning-modal-description">{description}</p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        className="warning-modal-button"
        color="red"
        onClick={() => noAction()}
      >
        {noText}
      </Button>
      <Button
        className="warning-modal-button"
        color="green"
        icon
        labelPosition="right"
        onClick={() => yesAction()}
      >
        {yesText} <Icon name="checkmark" />
      </Button>
    </Modal.Actions>
  </Modal>
);

export default WarningModal;
