import { addPressRelease, geTournamentList } from '@/_services/services_api';
import { faArrowLeft, faCloudUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ImageLoader = dynamic(import('../DataTable/ImageLoader'));

function PressReleaseAdd() {
  const [formValues, setFormValues] = useState({ title: '', edition: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleTournamentList();
  }, []);

  const handleTournamentList = async () => {
    const res = await geTournamentList();
    if (res?.status) {
      const data = res.data;
      setTournamentName(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = formValidation(formValues);
    setFormErrors(errors);
    setLoading(true);
    if (Object.keys(errors).length === 0) {
      const params = {
        title: formValues.title,
        thumbnail: thumbnailFile,
        pdfFile: pdfFile,
        edition: formValues.edition,
        publishDate: moment(publishDate).format('YYYY-MM-DD'),
        status: formValues.status,
      };

      const res = await addPressRelease(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/press-release');
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
      const folderName = setFile === setThumbnailFile ? 'yks/thumbnail' : 'yks/pdf';
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
          setPdfLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(`Error uploading ${setFile === setThumbnailFile ? 'thumbnail' : 'pdf'} file:`, error);
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
    if (file.type === 'application/pdf') {
      if (file && file.size > 10 * 1024 * 1024) {
        setPdfError('PDF size should be 10 MB or less');
        callback('PDF size should be 10 MB or less');
      } else {
        setPdfLoading(true);
        setPdfError(null);
        callback(null);
      }
    } else {
      if (file && file.size > 10 * 1024 * 1024) {
        setThumbnailError('Thumbnail size should be 10 MB or less');
        callback('Thumbnail size should be 10 MB or less');
      } else {
        setThumbnailLoading(true);
        setThumbnailError(null);
        callback(null);
      }
    }
  };

  const handleThumbnailClick = (event) => {
    handleFileClick(event, setThumbnailFile);
  };

  const handlePdfClick = (event) => {
    handleFileClick(event, setPdfFile);
  };

  const formValidation = (values) => {
    const errors = {};

    if (!values.title) {
      errors.title = 'Please enter a title ';
    }
    if (!values.edition) {
      errors.edition = 'Please select a edition';
    }
    if (!publishDate) {
      errors.publishDate = 'Please select a publish date';
    }

    if (!thumbnailFile) {
      errors.thumbnailFile = 'Please upload a thumbnail';
    } else if (thumbnailFile.size > 10 * 1024 * 1024) {
      errors.thumbnailFile = 'File size should be 10 MB or less';
    }

    if (!pdfFile) {
      errors.pdfFile = 'Please upload a pdf ';
    }

    return errors;
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Link href={'/press-release'} className="slate_gray">
              <FontAwesomeIcon icon={faArrowLeft} width={15} height={15} className="me-2" />
              Back
            </Link>
            <Card className="bg-white mt-3">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Add Press Releases</h4>
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
                      <div className="mb-3">
                        <Form.Group>
                          <Form.Label className="blue_dark fw-medium">Select Edition</Form.Label>
                          <Form.Select
                            name="edition"
                            value={formValues.edition}
                            onChange={handleChange}
                            className="shadow-none fs_14 slate_gray form-control cursor_pointer"
                          >
                            <option>Select Edition</option>
                            {tournamentName.map((item, key) => (
                              <option key={key} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                          </Form.Select>
                          {formErrors.edition && <p className="text-danger fs_13 mt-1">{formErrors.edition}</p>}
                        </Form.Group>
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
                              <span className="fs_13 mt-2 slate_gray">800px width x 533px height</span>
                            </>
                          )}
                        </div>

                        {(thumbnailError && <p className="text-danger fs_13 mt-1">{thumbnailError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload PDF File</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(pdfLoading && <ImageLoader />) || (
                            <>
                              {(pdfFile && (
                                <>
                                  <Link
                                    target="_blank"
                                    className="cursor_pointer"
                                    href={process.env.IMAGE_BASE + pdfFile}
                                  >
                                    <Image
                                      src={'/images/pdf.png'}
                                      alt="pdfFile"
                                      width={70}
                                      height={70}
                                      className="rounded-3"
                                    />
                                  </Link>
                                </>
                              )) || (
                                <FontAwesomeIcon
                                  icon={faCloudUpload}
                                  className="slate_gray mb-3"
                                  width={35}
                                  height={35}
                                />
                              )}

                              <div>
                                <Form.Control
                                  type="file"
                                  id="pdfFile"
                                  onChange={handlePdfClick}
                                  accept=".pdf"
                                  className="d-none"
                                  aria-describedby="pdfFile"
                                />

                                <label
                                  className="common_btn text-white rounded-2 py-2 px-3 fs-14 me-2 cursor_pointer"
                                  htmlFor="pdfFile"
                                >
                                  <span className="d-inline-flex align-middle">Upload PDF File</span>
                                </label>
                              </div>
                              <span className="fs_13 mt-2 slate_gray">800px width x 533px height</span>
                            </>
                          )}
                        </div>
                        {(pdfError && <p className="text-danger fs_13 mt-1">{pdfError}</p>) || (
                          <p className="text-danger fs_13 mt-1">{formErrors.pdfFile}</p>
                        )}
                      </div>
                    </Col>

                    <Col lg={6}>
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

export default PressReleaseAdd;
