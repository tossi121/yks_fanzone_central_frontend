import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { currentGallery, updateGallery } from '@/_services/services_api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

function GalleryEdit({ id }) {
  const galleryId = id;
  const [formValues, setFormValues] = useState({ title: '', description: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [addImageFile, setAddImageFile] = useState([]);
  const [currentGalleryData, setCurrentGalleryData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (galleryId) {
      handleCurrentGallery();
    }
  }, [galleryId]);

  useEffect(() => {
    if (galleryId) {
      const values = {
        title: currentGalleryData?.name_of_group || '',
        description: currentGalleryData?.description_of_gallery || '',
        status: currentGalleryData?.status || '',
      };
      setFormValues(values);
      setThumbnailFile(currentGalleryData?.thumbnailImage);
      setAddImageFile(currentGalleryData?.images);
    }
  }, [galleryId, currentGalleryData]);

  const handleCurrentGallery = async () => {
    const res = await currentGallery(galleryId);
    if (res?.status) {
      const data = res.data;
      setCurrentGalleryData(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const createFormData = (files, folderName) => {
    const formData = new FormData();
    formData.append('folderName', folderName);

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

  const handleUpload = async (files, setFiles) => {
    try {
      const folderName = Array.isArray(files) ? 'yks/gallery-thumbnail' : 'yks/gallery-images';
      const formData = createFormData(files, folderName);
      const headers = getHeaders();

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setFiles(response?.data?.result);
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const handleThumbnailClick = (event) => {
    const file = event.target.files[0];
    handleUpload(file, setThumbnailFile);
  };

  const handleAddImageClick = (event) => {
    const files = Array.from(event.target.files);
    handleUpload(files, setAddImageFile);
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
        thumbnailImage: thumbnailFile,
        status: formValues.status,
      };

      const res = await updateGallery(galleryId, params);

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
    } else if (thumbnailFile.size > 10 * 1024 * 1024) {
      errors.thumbnailFile = 'File size should be 10 MB or less';
    }
    if (addImageFile.length == 0) {
      errors.addImageFile = 'Please upload a thumbnail';
    }

    addImageFile.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
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
                  <h4 className="fw-bold mb-0">Edit Gallery</h4>
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
                          {(thumbnailFile && (
                            <>
                              <a
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
                              </a>
                            </>
                          )) || <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />}
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
                          <div className="d-flex justify-content-center align-items-center gap-3 overflow-auto w-100 h-100">
                            {(addImageFile?.length > 0 &&
                              addImageFile.map((preview, index) => (
                                <>
                                  <a target="_blank" className="cursor_pointer" href={process.env.IMAGE_BASE + preview}>
                                    <Image
                                      key={index}
                                      src={process.env.IMAGE_BASE + preview}
                                      alt={`Preview ${index}`}
                                      height={150}
                                      width={150}
                                      className="rounded-3 mb-2"
                                    />
                                  </a>
                                </>
                              ))) || (
                              <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
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

export default GalleryEdit;
