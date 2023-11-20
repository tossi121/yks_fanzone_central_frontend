import React, { useEffect, useState } from 'react';
import CustomDataTable from './DataTable/CustomDataTable';
import { getPressReleasesList } from '@/_services/services_api';
import { Card, Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';

function PressRelease() {
  const [pressReleases, setPressReleases] = useState(null);
  const columns = [
    { heading: 'Id', field: 'id' },
    { heading: 'Title', field: 'title' },
    { heading: 'Update By', field: 'update_by' },
    { heading: 'Updated Date', field: 'updatedAt' },
    { heading: 'Status', field: 'status' },
  ];

  const options = {
    columns: {
      render: {
        updatedAt: renderDate,
      },
    },
  };

  function renderDate(value, row) {
    return <span>{moment(row.Date).format('DD-MMMM-YYYY')} </span>;
  }

  useEffect(() => {
    handlePressReleasesList();
  }, []);

  const handlePressReleasesList = async (e) => {
    const res = await getPressReleasesList();
    if (res.status) {
      const data = res.data;
      setPressReleases(data);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card className="bg-white">
            <Card.Body className="p-4">
              <h4 className="fw-bold">Press Releases</h4>
              {pressReleases && <CustomDataTable rows={pressReleases} columns={columns} options={options} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PressRelease;
