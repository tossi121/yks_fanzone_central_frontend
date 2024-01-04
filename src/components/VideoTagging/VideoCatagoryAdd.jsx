import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { addCatagory } from '@/_services/services_api';

function VideoCatagoryAdd(props) {
  const { showVideo, handleClose, handleCatagoryList } = props;
  const [formValues, setFormValues] = useState({ title: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        tag: formValues.title,
      };

      const res = await addCatagory(params);

      if (res?.status) {
        toast.success(res.message);
        handleClose();
        handleCatagoryList();
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Please enter catagory';
    }

    return errors;
  };

  return (
    <>
      <Modal show={showVideo} onHide={handleClose} size={'lg'} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Catagory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form autoComplete="off" onSubmit={handleSubmit}>
                <Row className="align-items-center">
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Group>
                        <Form.Label className="blue_dark fw-medium">Enter Catagory</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Catagory"
                          name="title"
                          className="shadow-none fs_14 slate_gray"
                          value={formValues.title}
                          onChange={handleChange}
                        />
                        {formErrors.title && <p className="text-danger fs_13 mt-1">{formErrors.title}</p>}
                      </Form.Group>
                    </div>
                  </Col>

                  <Col sm={12}>
                    <Button
                      variant=""
                      className="px-4 text-white common_btn shadow-none"
                      disabled={loading}
                      type="submit"
                    >
                      Save
                      {loading && <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default VideoCatagoryAdd;
