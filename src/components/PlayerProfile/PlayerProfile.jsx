import { getPlayerProfileList } from '@/_services/services_api';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const TableLoader = dynamic(import('../DataTable/TableLoader'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));

function PlayerProfile() {
  const [playerProfile, setPlayerProfile] = useState([]);
  const columns = [
    { heading: 'Id', field: 'id' },
    { heading: 'Name', field: 'name' },
    { heading: 'Nick Name', field: 'nick_name' },
    { heading: 'Position', field: 'position' },
    { heading: 'DOB', field: 'date_of_birth' },
    { heading: 'Home Town', field: 'home_town' },
    { heading: 'Height', field: 'height' },
    { heading: 'Years Active', field: 'years_active' },
    { heading: 'Skill', field: 'skill' },
    { heading: 'Bio', field: 'bio' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];
  useEffect(() => {
    handlePressReleasesList();
  }, []);

  const options = {
    columns: {
      render: { date_of_birth: renderDate, action: renderActions },
    },
  };

  const handlePressReleasesList = async (e) => {
    const res = await getPlayerProfileList();
    if (res.status) {
      const data = res.data;
      setPlayerProfile(data);
    }
  };

  function renderDate(value, row) {
    return <span className="text-nowrap">{moment(row.date_of_birth).format('DD-MMMM-YYYY')} </span>;
  }

  function renderActions(value, row) {
    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`player-profile/${row.id}`}>
            <FontAwesomeIcon
              title="Edit"
              icon={faEdit}
              width={15}
              height={15}
              className="cursor_pointer blue_dark me-3"
            />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white player_profile">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">Player Profile</h4>
                </div>
                {(playerProfile && <CustomDataTable rows={playerProfile} columns={columns} options={options} />) || (
                  <TableLoader />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PlayerProfile;
