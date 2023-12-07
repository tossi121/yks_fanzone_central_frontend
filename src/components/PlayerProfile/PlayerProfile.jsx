import { getPlayerProfileList } from '@/_services/services_api';
import { faEdit, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const TableLoader = dynamic(import('../DataTable/TableLoader'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));

function PlayerProfile() {
  const [playerProfile, setPlayerProfile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { page } = router.query;

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      router.replace('/player-profile');
    }
  }, [page]);

  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'Profile', field: 'profile_url' },
    { heading: 'Name', field: 'name' },
    // { heading: 'Nick Name', field: 'nick_name' },
    { heading: 'Category', field: 'category' },
    { heading: 'Position Name', field: 'position_name' },
    // { heading: 'Position', field: 'position' },
    // { heading: 'DOB', field: 'date_of_birth' },
    // { heading: 'Country', field: 'home_town' },
    // { heading: 'Height', field: 'height' },
    { heading: 'Years Active', field: 'years_active' },
    // { heading: 'Skill', field: 'skill' },
    // { heading: 'Bio', field: 'bio' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];
  useEffect(() => {
    handlePlayerList();
  }, [currentPage]);

  const options = {
    columns: {
      render: {
        date_of_birth: renderDate,
        action: renderActions,
        profile_url: renderThumbnailImage,
        position_name: renderPosition,
      },
    },
  };

  function renderThumbnailImage(value, row) {
    return (
      <>
        {(row.profile_url && (
          <Image src={process.env.IMAGE_BASE + row.profile_url} width={50} height={50} alt="thumbnailImage" />
        )) || <FontAwesomeIcon icon={faImage} className="slate_gray mb-3" width={25} height={25} />}
      </>
    );
  }

  const handlePlayerList = async () => {
    setLoading(true);
    const res = await getPlayerProfileList();
    if (res.status) {
      const data = res.data;
      setPlayerProfile(data);
    }
    setLoading(false);
  };

  function renderDate(value, row) {
    return <span className="text-nowrap">{moment(row.date_of_birth).format('DD MMMM YYYY')} </span>;
  }

  function renderPosition(value, row) {
    return <span>{row.position_name?.join(', ')} </span>;
  }

  function renderActions(value, row) {
    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`player-profile/${row.id}?page=${currentPage}`}>
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
                {(!loading && playerProfile && (
                  <CustomDataTable
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rows={playerProfile}
                    columns={columns}
                    options={options}
                  />
                )) || <TableLoader />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PlayerProfile;
