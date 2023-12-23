import { updateArticles, currentArticles } from '@/_services/services_api';
import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';

function ArticlesEdit({ id }) {
  const articlesId = id;
  const [formValues, setFormValues] = useState({ title: '', articleType: [], tags: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [currentArticlesData, setCurrentArticlesData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (articlesId) {
      handleCurrentArticles();
    }
  }, [articlesId]);

  const handleCurrentArticles = async () => {
    const res = await currentArticles(articlesId);
    if (res?.status) {
      const data = res.data;
      setCurrentArticlesData(data);
    }
  };

  useEffect(() => {
    if (articlesId) {
      const values = {
        title: currentArticlesData?.title || '',
        status: currentArticlesData?.status || '',
        tags: currentArticlesData?.tags || '',
        articleType: currentArticlesData?.articles_type || '',
      };
      setFormValues(values);
      const date = new Date(currentArticlesData?.schedule || '');
      if (!isNaN(date.getTime())) {
        setScheduleDate(date);
      } else {
        console.error('Invalid date format');
      }
      setThumbnailFile(currentArticlesData?.imageUrl);
      setPageContent(currentArticlesData?.content);
    }
  }, [articlesId, currentArticlesData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        title: formValues.title,
        imageUrl: thumbnailFile,
        articles_type: formValues.articleType,
        tags: formValues.tags,
        content: pageContent.level?.content,
        schedule: moment(scheduleDate).format('YYYY-MM-DD'),
        status: formValues.status,
      };

      const res = await updateArticles(articlesId, params);
      if (res?.status) {
        toast.success(res.message);
        router.push('/articles');
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const createFormData = (file, folderName) => {
    const formData = new FormData();
    formData.append('folderName', folderName);
    formData.append('files', file);
    return formData;
  };

  const getHeaders = () => {
    return {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${Cookies.get('yks_fanzone_central_token')}`,
    };
  };

  const handleUpload = async (file, setFile) => {
    try {
      const folderName = setFile === setThumbnailFile ? '/articles' : '/';
      const formData = createFormData(file, folderName);
      const headers = getHeaders();

      const response = await axios.post(
        `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
        formData,
        { headers }
      );

      if (response?.data?.status) {
        setTimeout(() => {
          setFile(response?.data?.result[0]);
          setThumbnailLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(`Error uploading ${setFile === setThumbnailFile ? 'articles' : ''} file:`, error);
    }
  };

  const handleFileClick = (event, setFile) => {
    const file = event.target.files[0];
    handleSize(file, (error) => {
      if (!error) {
        handleUpload(file, setFile);
      }
    });
  };

  const handleSize = (file, callback) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setThumbnailError('Image size should be 10 MB or less');
      callback('Image size should be 10 MB or less');
    } else {
      setThumbnailError(null);
      callback(null);
      setThumbnailLoading(true);
    }
  };

  const handleThumbnailClick = (event) => {
    handleFileClick(event, setThumbnailFile);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Please enter title';
    }

    if (pageContent == '') {
      errors.pageContent = 'Please enter content';
    }

    if (!scheduleDate) {
      errors.scheduleDate = 'Please select schedule date';
    }

    if (values.articleType.length === 0) {
      errors.articleType = 'Please select article type';
    }

    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload image';
    } else if (thumbnailFile.size > 10 * 1024 * 1024) {
      errors.thumbnailFile = 'File size should be 10 MB or less';
    }

    return errors;
  };

  const handleArticlesChange = (permission) => {
    setFormValues((prevFormValues) => {
      if (prevFormValues.articleType.includes(permission)) {
        return {
          ...prevFormValues,
          articleType: prevFormValues.articleType.filter((item) => item !== permission),
        };
      } else {
        return {
          ...prevFormValues,
          articleType: [...prevFormValues.articleType, permission],
        };
      }
    });
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/articles'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Add Articles</h4>
                </div>
                <Form autoComplete="off" className="mt-3" onSubmit={handleSubmit}>
                  <Row className="align-items-baseline">
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
                      <div className="mb-3">
                        <Form.Label className="blue_dark fw-medium">Select Article Type</Form.Label>
                        <Form.Group>
                          {['Normal Article', 'Fantasy Article', 'Short News'].map((item, key) => (
                            <Form.Label
                              key={key}
                              className="cursor_pointer slate_gray fs_14 user-select-none me-3 text-capitalize"
                              htmlFor={item}
                            >
                              <input
                                type="checkbox"
                                name={item}
                                id={item}
                                className="form-check-input me-2 shadow-none border"
                                checked={formValues.articleType.includes(item)}
                                onChange={() => handleArticlesChange(item)}
                              />
                              {item}
                            </Form.Label>
                          ))}
                        </Form.Group>
                        {formErrors.articleType && <p className="text-danger fs_13 mt-1">{formErrors.articleType}</p>}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Select Schedule Date</Form.Label>
                      <div className="mb-3 d-flex flex-column">
                        <ReactDatePicker
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          selected={scheduleDate}
                          onChange={(date) => setScheduleDate(date)}
                          placeholderText="Select Schedule Date"
                          showTimeSelect={false}
                          dateFormat="dd MMM yyyy"
                          className="shadow-none fs_14 slate_gray"
                          onKeyDown={(e) => e.preventDefault()}
                          minDate={new Date()}
                        />
                        {formErrors.scheduleDate && <p className="text-danger fs_13 mt-1">{formErrors.scheduleDate}</p>}
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
                      </div>
                    </Col>

                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload Image</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(thumbnailLoading && (
                            <Spinner animation="border" size="lg" variant="primary" className="spinner" />
                          )) || (
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
                                  className="common_btn text-white rounded-2 py-2 px-3 fs_14 me-2 cursor_pointer"
                                  htmlFor="thumbnail"
                                >
                                  <span className="d-inline-flex align-middle">Upload Image</span>
                                </label>
                              </div>
                            </>
                          )}
                        </div>

                        {(thumbnailError && <p className="text-danger fs_13 mt-1">{thumbnailError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Tags</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="tags"
                            value={formValues.tags}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray textarea_description"
                            placeholder="Enter tags"
                          />
                          {formErrors.tags && <p className="text-danger fs_13 mt-1">{formErrors.tags}</p>}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Content</Form.Label>
                          <Editor
                            initialValue={pageContent}
                            onChange={(value) => setPageContent(value)}
                            apiKey={process.env.TINYMCE_API_KEY}
                            init={{
                              plugins:
                                'anchor autolink charmap image link lists media searchreplace table visualblocks forecolor backcolor',
                              toolbar:
                                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | forecolor backcolor',
                            }}
                          />
                          {formErrors.pageContent && <p className="text-danger fs_13 mt-1">{formErrors.pageContent}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button variant="" className="px-4 text-white common_btn shadow-none" disabled={loading} type="submit">
                       Update
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

export default ArticlesEdit;
