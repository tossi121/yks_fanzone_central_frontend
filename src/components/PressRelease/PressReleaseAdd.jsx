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

function PressReleaseAdd() {
  const [formValues, setFormValues] = useState({ title: '', edition: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const router = useRouter();

  useEffect(() => {
    handleTournamentList();
  }, []);

  useEffect(() => {
    if (thumbnailFile) {
      uploadThumbnailFile();
    }
  }, [thumbnailFile]);

  useEffect(() => {
    if (pdfFile) {
      uploadPdfFile();
    }
  }, [pdfFile]);

  const handleTournamentList = async (e) => {
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
        thumbnail: thumbnail,
        pdfFile: pdf,
        edition: formValues.edition,
        publishDate: moment(publishDate).format('YYYY-MM-DD'),
        status: formValues.status,
      };

      const res = await addPressRelease(params);

      if (res?.status) {
        toast.success(res.message);
        router.push('/');
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

  const uploadThumbnailFile = async () => {
    try {
      const formData = new FormData();
      formData.append('folderName', 'yks/thumbnail');
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

  const uploadPdfFile = async () => {
    try {
      const formData = new FormData();
      formData.append('folderName', 'yks/pdf');
      formData.append('files', pdfFile);

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
          setPdf(response?.data?.result[0]);
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading thumbnail file:', error);
    }
  };

  const handlePdfFile = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPdfPreview(event.target.result);
      };

      reader.readAsDataURL(file);
    }
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
      errors.thumbnailFile = 'Please upload a thumbnail ';
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
                              <option key={key} value={item.tournamentName}>
                                {item.tournamentName}
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
                          dateFormat="dd-MMM-yyyy"
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
                      <Form.Label className="blue_dark fw-medium">Upload Thumbnail</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(thumbnailPreview && (
                            <Image
                              src={thumbnailPreview}
                              alt="thumbnail"
                              height={150}
                              width={150}
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
                          <span className="fs_13 mt-2 slate_gray">800px width x 533px height</span>
                        </div>
                        {formErrors.thumbnailFile && (
                          <p className="text-danger fs_13 mt-1">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload PDF File</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {(pdfPreview && (
                            <Image src={'/images/pdf.png'} alt="pdfFile" width={70} height={70} className="rounded-3" />
                          )) || (
                            <FontAwesomeIcon icon={faCloudUpload} className="slate_gray mb-3" width={35} height={35} />
                          )}

                          <div>
                            <Form.Control
                              type="file"
                              id="pdfFile"
                              onChange={handlePdfFile}
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
                        </div>
                        {formErrors.pdfFile && <p className="text-danger fs_13 mt-1">{formErrors.pdfFile}</p>}
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
