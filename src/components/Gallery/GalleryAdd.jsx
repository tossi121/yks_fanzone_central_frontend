import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { addGallery } from '@/_services/services_api';
import toast from 'react-hot-toast';

function GalleryAdd() {
  const [formValues, setFormValues] = useState({ title: '', description: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [addImageFile, setAddImageFile] = useState([]);
  const [addImagePreview, setAddImagePreview] = useState([]);
  const [addImage, setAddImage] = useState([]);

  useEffect(() => {
    if (thumbnailFile) {
      uploadThumbnailFile();
    }
  }, [thumbnailFile]);

  useEffect(() => {
    if (addImageFile.length > 0) {
      uploadAddImageFile();
    }
  }, [addImageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const uploadThumbnailFile = async () => {
    try {
      const formData = new FormData();
      formData.append('folderName', 'yks/gallery-thumbnail');
      formData.append('files', thumbnailFile);

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('yks_fanzone_central_token')}`,
      };

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setThumbnail(response?.data?.result[0]);
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading thumbnail file:', error);
    }
  };

  const handleThumbnailFile = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const uploadAddImageFile = async () => {
    try {
      const formData = new FormData();
      formData.append('folderName', 'yks/gallery-images');
      addImageFile.forEach((file) => formData.append('files', file));

      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('yks_fanzone_central_token')}`,
      };

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setAddImage(response?.data?.result[0]);
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading image file:', error);
    }
  };

  const handleAddImageFile = (e) => {
    const files = e.target.files;

    if (files) {
      const newFiles = Array.from(files);
      setAddImageFile((prevFiles) => [...prevFiles, ...newFiles]);

      newFiles.forEach((file) => {
        readAndSetImagePreview(file);
      });
    }
  };

  const readAndSetImagePreview = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setAddImagePreview((prevPreviews) => [...prevPreviews, event.target.result]);
    };

    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        name_of_group: formValues.title,
        description_of_gallery: formValues.description,
        images: addImage,
        thumbnailImage: thumbnail,
        status: formValues.status,
      };

      const res = await addGallery(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/');
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Please enter a title ';
    }

    if (!values.description) {
      errors.description = 'Please enter a description';
    } else if (values.description.length > 150) {
      errors.description = 'Description should be 150 characters or less';
    }

    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload a thumbnail';
    } else if (thumbnailFile.size > 1024 * 1024) {
      errors.thumbnailFile = 'File size should be 1 MB or less';
    }
    if (addImageFile.length == 0) {
      errors.addImageFile = 'Please upload a thumbnail';
    }

    addImageFile.forEach((file, index) => {
      if (file.size > 1024 * 1024) {
        errors.addImageFile = `File size should be 1 MB or less`;
      }
    });

    return errors;
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/gallery'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Add Gallery</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Tilte</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Tilte"
                            name="title"
                            className="shadow-none fs_14 slate_gray"
                            value={formValues.title}
                            onChange={handleChange}
                          />
                          {formErrors.title && <p className="text-danger fs_13 mt-1">{formErrors.title}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Status</Form.Label>
                      <div className="mb-3">
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Published"
                          type="radio"
                          id="Published"
                          value="Published"
                          checked={formValues.status === 'Published'}
                          onChange={handleChange}
                          name="status"
                        />
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Unpublished"
                          type="radio"
                          id="Unpublished"
                          value="Unpublished"
                          checked={formValues.status === 'Unpublished'}
                          onChange={handleChange}
                          name="status"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray textarea_description"
                            placeholder="Description of the gallery"
                          />
                          {formErrors.description && <p className="text-danger fs_13 mt-1">{formErrors.description}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Thumbnail</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(thumbnailPreview && (
                            <Image
                              src={thumbnailPreview}
                              alt="thumbnail"
                              height={500}
                              width={500}
                              className="rounded-3 mb-2"
                            />
                          )) ||
                            (thumbnailPreview == null && (
                              <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                            ))}
                          <div>
                            <Form.Control
                              type="file"
                              id="thumbnail"
                              onChange={handleThumbnailFile}
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              className="d-none"
                              aria-describedby="thumbnail"
                            />
                            <label
                              className="common_btn text-white rounded-2 py-2 px-3 fs-14 me-2 cursor_pointer"
                              htmlFor="thumbnail"
                            >
                              <span className="d-inline-flex align-middle">Upload Thumbnail</span>
                            </label>
                          </div>
                          <span className="fs_13 mt-2 slate_gray">500px width x 500px height</span>
                        </div>
                        {formErrors.thumbnailFile && (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Images</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          <div className="d-flex justify-content-center align-items-center w-100 flex-wrap h-100 gap-2 overflow-auto">
                            {(addImagePreview.length > 0 &&
                              addImagePreview.map((preview, index) => (
                                <Image
                                  key={index}
                                  src={preview}
                                  alt={`Preview ${index}`}
                                  height={150}
                                  width={150}
                                  className="rounded-3 mb-2"
                                />
                              ))) || (
                              <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                            )}
                          </div>
                          <div>
                            <Form.Control
                              multiple
                              type="file"
                              id="addImage"
                              onChange={handleAddImageFile}
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              className="d-none"
                              aria-describedby="addImage"
                            />
                            <label
                              className="common_btn text-white rounded-2 py-2 px-3 fs-14 me-2 cursor_pointer"
                              htmlFor="addImage"
                            >
                              <span className="d-inline-flex align-middle">Upload Images</span>
                            </label>
                          </div>
                          <span className="fs_13 mt-2 slate_gray">500px width x 500px height</span>
                        </div>
                        {formErrors.addImageFile && <p className="text-danger fs_13 mt-1">{formErrors.addImageFile}</p>}
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button variant="" className="px-4 text-white common_btn" disabled={loading} type="submit">
                        Publish
                        {loading && <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default GalleryAdd;
