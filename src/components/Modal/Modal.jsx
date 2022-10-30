import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ModalBox, Overlay } from './Modal.styled';

export const Modal = ({ onClose, url }) => {
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    }
  });

  const close = evt => {
    if (evt.target === evt.currentTarget) onClose();
  };

  const handleKeydown = evt => {
    if (evt.code !== 'Escape') return;

    onClose();
  };

  return (
    <Overlay onClick={close}>
      <ModalBox>
        <img src={url} alt="" />
      </ModalBox>
    </Overlay>
  );
}

Modal.propTypes = {
  url: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
