import { faArrowLeft, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { addGallery } from '@/_services/services_api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import dynamic from 'next/dynamic';

const ImageLoader = dynamic(import('../DataTable/ImageLoader'));

function GalleryAdd() {
  const [formValues, setFormValues] = useState({ title: '', description: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [addImageFile, setAddImageFile] = useState([]);
  const [publishDate, setPublishDate] = useState(null);
  const [show, setShow] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [imgError, setImgError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const createFormData = (files, folderName, existingFiles = []) => {
    const formData = new FormData();
    formData.append('folderName', folderName);

    existingFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });

    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    } else {
      formData.append('files', files);
    }

    return formData;
  };

  const getHeaders = () => {
    return {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${Cookies.get('yks_fanzone_central_token')}`,
    };
  };

  const handleUpload = async (files, setFiles, existingFiles = []) => {
    try {
      const folderName = Array.isArray(files) ? 'yks/gallery-images' : 'yks/gallery-thumbnail';
      const formData = createFormData(files, folderName, existingFiles); // Pass existingFiles
      const headers = getHeaders();

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setFiles(existingFiles.concat(response?.data?.result));
          setThumbnailLoading(false);
          setImgLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleFileClick = (event, setFiles, setErrorFunction) => {
    const files = Array.from(event.target.files);
    handleSize(files, setErrorFunction, (error) => {
      if (!error) {
        handleUpload(files, setFiles);
      }
    });
  };

  const handleImgClick = (event, setFiles, setErrorFunction, existingFiles = []) => {
    const files = Array.from(event.target.files);
    handleImgSize(files, setErrorFunction, (error) => {
      if (!error) {
        handleUpload(files, setFiles, existingFiles);
      }
    });
  };

  const handleSize = (files, setErrorFunction, callback) => {
    const maxSize = 10 * 1024 * 1024;
    const exceedsSize = files.some((file) => file.size > maxSize);

    if (exceedsSize) {
      setErrorFunction(`Thumbnail size should be ${maxSize / (1024 * 1024)} MB or less`);
      callback(`Thumbnail size should be ${maxSize / (1024 * 1024)} MB or less`);
    } else {
      setErrorFunction(null);
      callback(null);
      setThumbnailLoading(true);
    }
  };

  const handleImgSize = (files, setErrorFunction, callback) => {
    const maxSize = 10 * 1024 * 1024;
    const exceedsSize = files.some((file) => file.size > maxSize);

    if (exceedsSize) {
      setErrorFunction(`Image size should be ${maxSize / (1024 * 1024)} MB or less`);
      callback(`Image size should be ${maxSize / (1024 * 1024)} MB or less`);
    } else {
      setErrorFunction(null);
      callback(null);
      setImgLoading(true);
    }
  };

  const handleThumbnailClick = (event) => {
    handleFileClick(event, setThumbnailFile, setThumbnailError);
  };

  const handleAddImageClick = (event) => {
    handleImgClick(event, setAddImageFile, setImgError, addImageFile);
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
        images: addImageFile,
        thumbnailImage: thumbnailFile?.[0] || '',
        publishDate: moment(publishDate).format('YYYY-MM-DD'),
        status: formValues.status,
      };

      const res = await addGallery(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/gallery');
      } else {
        toast.error(res?.message);
      }
    }

    setLoading(false);
  };

  const formValidation = (values) => {
    const errors = {};

    if (values.status === 'Draft') {
      if (!values.title && !values.description && !publishDate && !thumbnailFile && addImageFile.length === 0) {
        toast.error('At least one field is required');
        errors.status = 'At least one field is required';
      }
    } else {
      if (!values.title) {
        errors.title = 'Please enter title';
      }
      if (!publishDate) {
        errors.publishDate = 'Please select publish date';
      }
      if (!values.description) {
        errors.description = 'Please enter description';
      } else if (values.description.length > 150) {
        errors.description = 'Description should be 150 characters or less';
      }

      if (!thumbnailFile) {
        errors.thumbnailFile = 'Please upload thumbnail';
      }
      if (addImageFile.length === 0) {
        errors.addImageFile = 'Please upload at least one image';
      }
    }

    return errors;
  };

  const handleRemoveImage = (index, setFiles) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  function ModalGallery() {
    return (
      <>
        <Modal show={show} centered size="lg" onHide={() => setShow(false)}>
          <Modal.Header closeButton className="fw-semibold">
            All Uploaded Images
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-wrap align-items-center gap-3 justify-content-center">
              {(addImageFile?.length > 0 &&
                addImageFile.map((preview, index) => (
                  <>
                    <div className="position-relative">
                      <Link target="_blank" className="cursor_pointer" href={process.env.IMAGE_BASE + preview}>
                        <Image
                          key={index}
                          src={process.env.IMAGE_BASE + preview}
                          alt={`Preview ${index}`}
                          height={125}
                          width={125}
                          className="rounded-3 mb-2 img-fluid"
                        />
                      </Link>
                      <FontAwesomeIcon
                        icon={faTimes}
                        onClick={() => handleRemoveImage(index, setAddImageFile)}
                        className="slate_gray cursor_pointer rounded-4 border p-1 position-absolute z-1 bg-white remove_icon"
                        width={25}
                        height={25}
                      />
                    </div>
                  </>
                ))) || <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      {show && <ModalGallery />}
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
                  <Row>
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
                          label="Publish"
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
                          label="Unpublish"
                          type="radio"
                          id="Unpublished"
                          value="Unpublished"
                          checked={formValues.status === 'Unpublished'}
                          onChange={handleChange}
                          name="status"
                        />
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Draft"
                          type="radio"
                          id="Draft"
                          value="Draft"
                          checked={formValues.status === 'Draft'}
                          onChange={handleChange}
                          name="status"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Select Publish Date</Form.Label>
                      <div className="mb-3 d-flex flex-column">
                        <ReactDatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          selected={publishDate}
                          onChange={(date) => setPublishDate(date)}
                          placeholderText="Select Publish Date"
                          showTimeSelect={false}
                          dateFormat="dd MMM yyyy"
                          className="shadow-none fs_14 slate_gray"
                          onKeyDown={(e) => e.preventDefault()}
                        />
                        {formErrors.publishDate && <p className="text-danger fs_13 mt-1">{formErrors.publishDate}</p>}
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
                          {(thumbnailLoading && <ImageLoader />) || (
                            <>
                              {(thumbnailFile && (
                                <>
                                  <Link
                                    target="_blank"
                                    className="cursor_pointer"
                                    href={process.env.IMAGE_BASE + thumbnailFile}
                                  >
                                    <Image
                                      src={process.env.IMAGE_BASE + thumbnailFile}
                                      alt="thumbnail"
                                      height={150}
                                      width={150}
                                      className="rounded-3 mb-2"
                                    />
                                  </Link>
                                </>
                              )) || (
                                <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                              )}
                              <div>
                                <Form.Control
                                  type="file"
                                  id="thumbnail"
                                  onChange={handleThumbnailClick}
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
                            </>
                          )}
                        </div>

                        {(thumbnailError && <p className="text-danger fs_13 mt-1">{thumbnailError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Images</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(imgLoading && <ImageLoader />) || (
                            <>
                              <div className="d-flex flex-wrap align-items-center gap-3 justify-content-center">
                                {(addImageFile?.length > 0 &&
                                  addImageFile.slice(0, 3).map((preview, index) => (
                                    <>
                                      <div className="cursor_pointer position-relative">
                                        <Link href={process.env.IMAGE_BASE + preview} target="_blank">
                                          <Image
                                            key={index}
                                            src={process.env.IMAGE_BASE + preview}
                                            alt={`Preview ${index}`}
                                            height={150}
                                            width={150}
                                            className="rounded-3 mb-2"
                                          />
                                        </Link>

                                        <FontAwesomeIcon
                                          icon={faTimes}
                                          onClick={() => handleRemoveImage(index, setAddImageFile)}
                                          className="slate_gray cursor_pointer rounded-4 border p-1 position-absolute z-1 bg-white remove_icon"
                                          width={25}
                                          height={25}
                                        />
                                      </div>
                                    </>
                                  ))) || (
                                  <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                                )}
                                {addImageFile?.length > 3 && (
                                  <Badge className="cursor_pointer web-btn" onClick={() => setShow(true)}>
                                    +{addImageFile?.length} More...
                                  </Badge>
                                )}
                              </div>
                              <div>
                                <Form.Control
                                  multiple
                                  type="file"
                                  id="addImages"
                                  onChange={handleAddImageClick}
                                  accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                  className="d-none"
                                  aria-describedby="addImages"
                                />
                                <label
                                  className="common_btn text-white rounded-2 py-2 px-3 fs-14 me-2 cursor_pointer"
                                  htmlFor="addImages"
                                >
                                  <span className="d-inline-flex align-middle">Upload Images</span>
                                </label>
                              </div>
                              <span className="fs_13 mt-2 slate_gray">500px width x 500px height</span>
                            </>
                          )}
                        </div>
                        {(imgError && <p className="text-danger fs_13 mt-1">{imgError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.addImageFile}</p>
                        )}
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
