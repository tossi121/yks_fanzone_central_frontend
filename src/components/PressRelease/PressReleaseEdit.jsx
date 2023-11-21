import { updatePressRelease, geTournamentList, currentPressRelease } from '@/_services/services_api';
import { faCloudUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

function PressReleaseEdit({ id }) {
  const pressReleaseId = id;
  const [formValues, setFormValues] = useState({ title: '', edition: '', status: 'Published' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [pdfFilePreview, setPdfFilePreview] = useState(null);
  const [publishDate, setPublishDate] = useState(null);
  const [currentPressData, setCurrentPressData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (pressReleaseId) {
      handleTournamentList();
      handlecurrentPressRelease();
    }
  }, [pressReleaseId]);

  useEffect(() => {
    if (pressReleaseId) {
      const values = {
        title: currentPressData?.title || '',
        edition: currentPressData?.edition || '',
        status: currentPressData?.status || '',
      };
      const date = currentPressData?.publishDate;
      const date1 = moment(date).format('dd-MMM-yyyy');
      // setPublishDate(date1);
      setFormValues(values);
    }
  }, [pressReleaseId, currentPressData, publishDate]);

  const handlecurrentPressRelease = async (e) => {
    const res = await currentPressRelease(pressReleaseId);
    if (res?.status) {
      const data = res.data;
      setCurrentPressData(data);
    }
  };

  const handleTournamentList = async (e) => {
    const res = await geTournamentList();
    if (res?.status) {
      const data = res.data;
      setTournamentName(data);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = {
      title: formValues.title,
      thumbnail: 'https://examwwpdle.com/thumbnail.jpg',
      pdfFile: 'https://exampwdle.com/press_release.pdf',
      edition: formValues.edition,
      publishDate: moment(publishDate).format('YYYY-MM-DD'),
      status: formValues.status,
    };

    const res = await updatePressRelease(params);
    if (res?.status) {
      toast.success(res.message);
      router.push('/');
    } else {
      toast.error(res?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleThumbnailFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePdfFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfFilePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold mb-0">Edit Press Releases</h4>
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
                          minDate={new Date()}
                          onChange={(date) => setPublishDate(date)}
                          placeholderText="Select Publish Date"
                          showTimeSelect={false}
                          dateFormat="dd-MMM-yyyy"
                          className="shadow-none fs_14 slate_gray"
                          onKeyDown={(e) => e.preventDefault()}
                        />
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
                          {thumbnailPreview && (
                            <Image
                              src={thumbnailPreview}
                              alt="thumbnail"
                              width={150}
                              height={150}
                              className="img-fluid rounded-3 mb-3"
                            />
                          )}
                          {thumbnailPreview == null && (
                            <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={35} height={35} />
                          )}
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
                          <p className="text-danger fs-14 error-message">{formErrors.thumbnailFile}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label className="blue_dark fw-medium">Upload PDF File</Form.Label>
                      <div className="mb-3">
                        <div className="file_upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {pdfFilePreview && (
                            <Image
                              src={pdfFilePreview}
                              alt="pdfFile"
                              width={150}
                              height={150}
                              className="img-fluid rounded-3"
                            />
                          )}
                          <FontAwesomeIcon icon={faCloudUpload} className="slate_gray mb-3" width={35} height={35} />
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
                        {formErrors.pdfFileFile && (
                          <p className="text-danger fs-14 error-message">{formErrors.pdfFileFile}</p>
                        )}
                      </div>
                    </Col>

                    <Col lg={6}>
                      <Button variant="" type="submit" className="common_btn text-white px-4">
                        Publish
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

export default PressReleaseEdit;
