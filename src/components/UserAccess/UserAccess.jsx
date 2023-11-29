import { getUserAccessList } from '@/_services/services_api';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function UserAccess() {
  const [userAccess, setUserAccess] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    { heading: 'First Name', field: 'first_name' },
    { heading: 'Last Name', field: 'last_name' },
    { heading: 'Email', field: 'email' },
    { heading: 'Permissions', field: 'permissions' },
  ];

  useEffect(() => {
    handlePressReleasesList();
  }, []);

  const handlePressReleasesList = async (e) => {
    const res = await getUserAccessList();
    if (res.status) {
      const data = res.data;
      setUserAccess(data);
    }
  };

  const options = {
    columns: {
      render: { permissions: renderPermissions },
    },
  };

  function renderPermissions(value, row) {
    return <span className="text-nowrap">{row.permissions.join(' , ')} </span>;
  }

  return (
    <>
      {showModal && (
        <DeleteModal
          {...{
            showModal,
            setShowModal,
            loading,
            closeModal: () => setShowModal(false),
            handleDelete,
            text: 'user access',
          }}
        />
      )}
      <Container fluid>
        <Row>
          <Col>
            <Card className="bg-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <h4 className="fw-bold mb-0">User Access</h4>
                  <Link className="common_btn text-white px-3 py-1 rounded-2" href="/user-access/add">
                    <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} className="me-1" /> Add
                  </Link>
                </div>

                {(userAccess && <CustomDataTable rows={userAccess} columns={columns} options={options} />) || (
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

export default UserAccess;
