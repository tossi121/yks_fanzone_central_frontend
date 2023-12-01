import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';

function DeleteModal(props) {
  const { showModal, handleDelete, text, closeModal, loading } = props;
  return (
    <Modal show={showModal} onHide={closeModal} size={'sm'} centered>
      <Modal.Body className="text-center py-4">
        <FontAwesomeIcon icon={faTrashAlt} className="text-danger fs-1 mb-2" width={30} />
        <h4 className="blue_dark fw-bold">Are you sure?</h4>
        <p className="mb-0 fs_14 slate_gray">
          Do you really want to delete the {text}? This record can not be restored.
        </p>
        <Row>
          <Col className="mt-4">
            <Button variant="outline-secondary" className="me-2" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={handleDelete} disabled={loading}>
              Delete
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteModal;
