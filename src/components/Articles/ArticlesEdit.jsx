import { updateArticles, currentArticles, getCustomTagsList } from '@/_services/services_api';
import { faArrowLeft, faImage, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import dynamic from 'next/dynamic';

const CustomTagsAdd = dynamic(import('../CustomTags/CustomTagsAdd'));

function ArticlesEdit({ id }) {
  const articlesId = id;
  const [formValues, setFormValues] = useState({
    title: '',
    articleType: 'Normal Article',
    status: 'Published',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [currentArticlesData, setCurrentArticlesData] = useState(null);
  const [tagsData, setTagsData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [show, setShow] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (articlesId) {
      handleCurrentArticles();
      handleTagsList();
    }
  }, [articlesId]);

  const handleTagsList = async (e) => {
    setLoading(true);
    const res = await getCustomTagsList();
    if (res?.status) {
      const data = res.data;
      setTagsData(data);
    }
    setLoading(false);
  };

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
        articleType: currentArticlesData?.articles_type || '',
      };
      setFormValues(values);
      setSelectedTags(currentArticlesData?.tags);
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
        tags: selectedTags.map((i) => i),
        content: pageContent.level?.content,
        schedule: moment(scheduleDate).format('YYYY-MM-DD HH:mm:ss'),
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
      const folderName = setFile === setThumbnailFile ? 'articles' : '/';
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

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCheckboxChange = (tagName) => {
    const isTagSelected = selectedTags.includes(tagName);

    if (isTagSelected) {
      const updatedTags = selectedTags.filter((tag) => tag !== tagName);
      setSelectedTags(updatedTags);
    } else {
      setSelectedTags((prevTags) => [...prevTags, tagName]);
    }
  };

  const filteredOptions = tagsData.filter((option) => option.tag.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <>
      {show && (
        <CustomTagsAdd
          {...{
            show,
            handleTagsList,
            handleClose: () => setShow(false),
          }}
        />
      )}
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
                  <h4 className="fw-bold mb-0">Edit Articles</h4>
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
                      <Form.Label className="blue_dark fw-medium">Article Type</Form.Label>
                      <div className="mb-3">
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Normal Article"
                          type="radio"
                          id="Normal Article"
                          value="Normal Article"
                          checked={formValues.articleType === 'Normal Article'}
                          onChange={handleChange}
                          name="articleType"
                        />
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Fantasy Article"
                          type="radio"
                          id="Fantasy Article"
                          value="Fantasy Article"
                          checked={formValues.articleType === 'Fantasy Article'}
                          onChange={handleChange}
                          name="articleType"
                        />
                        <Form.Check
                          inline
                          className="fs_14 slate_gray"
                          label="Short News"
                          type="radio"
                          id="Short News"
                          value="Short News"
                          checked={formValues.articleType === 'Short News'}
                          onChange={handleChange}
                          name="articleType"
                        />
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
                          placeholderText="Select Schedule Date and Time"
                          showTimeSelect
                          timeFormat="h:mm aa"
                          dateFormat="dd MMM yyyy h:mm aa"
                          className="shadow-none fs_14 slate_gray"
                          onKeyDown={(e) => e.preventDefault()}
                          minDate={new Date()}
                          filterTime={filterPassedTime}
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
                      <Form.Group>
                        <Form.Label className="blue_dark fw-medium">Select Tags</Form.Label>
                        <Dropdown className="w-100 rounded-1">
                          <Dropdown.Toggle
                            variant="none"
                            className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
                            id="dropdown-basic"
                          >
                            <span className="text-truncate pe-3">
                              {selectedTags?.length > 0 ? selectedTags.map((tag) => tag).join(', ') : 'Select Tags'}
                            </span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
                            <div className="px-2 mb-2 d-flex gap-2 align-items-center">
                              <div className="w-100">
                                <input
                                  type="search"
                                  placeholder="Search Tags"
                                  onChange={handleSearchChange}
                                  className="form-control shadow-none fs_14 slate_gray"
                                  value={searchValue}
                                />
                              </div>
                              <div
                                className="common_btn text-white h-100 p-1 px-2 rounded-2 cursor_pointer text-nowrap"
                                onClick={() => setShow(true)}
                              >
                                <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} />
                              </div>
                            </div>
                            {filteredOptions.map((option) => (
                              <div
                                key={option.id}
                                className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray"
                              >
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  onChange={() => handleCheckboxChange(option.tag)}
                                  className="cursor_pointer"
                                  checked={selectedTags?.some((tag) =>
                                    typeof tag === 'object' ? tag.id === option.id : tag === option.tag
                                  )}
                                />

                                <label htmlFor={option.id} className="ms-3 cursor_pointer user-select-none w-100">
                                  {option.tag}
                                </label>
                              </div>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Col>
                    <Col lg={12}>
                      {console.log(pageContent)}
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Enter Content</Form.Label>
                          <Editor
                            initialValue={pageContent}
                            onChange={(value) => setPageContent(value)}
                            apiKey={process.env.TINYMCE_API_KEY}
                            init={{
                              menubar: false,
                              plugins:
                                'anchor autolink charmap image link lists searchreplace table visualblocks forecolor backcolor tinydrive',
                              toolbar:
                                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | forecolor backcolor',
                              image_title: true,
                              automatic_uploads: false,
                              file_picker_types: 'image',
                              file_picker_callback: async (cb, value, meta) => {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');
                                input.setAttribute('multiple', 'true');
                                input.addEventListener('change', async (e) => {
                                  const file = e.target.files[0];
                                  const formData = new FormData();
                                  formData.append('folderName', '/articles_content');
                                  formData.append('files', file);
                                  const headers = getHeaders();

                                  try {
                                    // Upload to S3
                                    const s3Response = await axios.post(
                                      `${process.env.BASE_API_URL}${process.env.PRESS_RELEASES_UPLOAD_FILE_DATA}`,
                                      formData,
                                      { headers }
                                    );

                                    // Assuming S3 response contains the S3 URL
                                    const s3ImageUrl = process.env.IMAGE_BASE + s3Response.data.result[0];

                                    // Include file name in alt attribute
                                    const altText = file.name;

                                    // Set the image directly with the S3 URL
                                    const imgTag = `<img src="${s3ImageUrl}" alt="${altText}">`;

                                    // Insert the image into the editor
                                    tinymce.activeEditor.execCommand('mceInsertContent', false, imgTag);

                                    // Invoke the callback with the S3 image URL and image title
                                    cb(s3ImageUrl, { title: altText });
                                  } catch (error) {
                                    console.error('Error:', error);
                                  }
                                });

                                input.click();
                              },
                            }}
                          />
                          {formErrors.pageContent && <p className="text-danger fs_13 mt-1">{formErrors.pageContent}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Button
                        variant=""
                        className="px-4 text-white common_btn shadow-none"
                        disabled={loading}
                        type="submit"
                      >
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
