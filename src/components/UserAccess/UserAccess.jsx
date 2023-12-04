import { deleteUserAccessPermission, getUserAccessList } from '@/_services/services_api';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';

const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const DeleteModal = dynamic(import('../DeleteModal'));
const TableLoader = dynamic(import('../DataTable/TableLoader'));

function UserAccess() {
  const [userAccess, setUserAccess] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    { heading: 'Id', field: 'serialNumber' },
    { heading: 'First Name', field: 'first_name' },
    { heading: 'Last Name', field: 'last_name' },
    { heading: 'Email', field: 'email' },
    { heading: 'Permissions', field: 'permissions' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  useEffect(() => {
    handleUserAccessList();
  }, []);

  const handleUserAccessList = async (e) => {
    setLoading(true);
    const res = await getUserAccessList();
    if (res.status) {
      const data = res.data;
      setUserAccess(data);
    }
    setLoading(false);
  };

  const options = {
    columns: {
      render: { permissions: renderPermissions, status: renderSatus, action: renderActions },
    },
  };

  function renderPermissions(value, row) {
    const permissions = row.permissions.join(' , ');
    return <span className="text-nowrap text-capitalize">{permissions.replace(/[-_]/g, ' ')} </span>;
  }

  function renderActions(value, row) {
    const handleDeleteModal = () => {
      setDeleteId(row);
      setShowModal(true);
    };
    return (
      <>
        <div className="action_btn text-nowrap">
          <Link href={`user-access/${row.id}`}>
            <FontAwesomeIcon
              title="Edit"
              icon={faEdit}
              width={15}
              height={15}
              className="cursor_pointer blue_dark me-3"
            />
          </Link>
          <FontAwesomeIcon
            title="Delete"
            onClick={handleDeleteModal}
            icon={faTrash}
            width={15}
            height={15}
            className="cursor_pointer blue_dark"
          />
        </div>
      </>
    );
  }

  function renderSatus(value, row) {
    const statusColors = {
      Active: 'success',
      Inactive: 'danger',
    };

    return (
      <>
        <Badge pill bg={statusColors[row.status]} className="fs_12">
          {row.status}
        </Badge>
      </>
    );
  }

  const handleDelete = async (e) => {
    setLoading(true);
    const res = await deleteUserAccessPermission(deleteId.id);
    if (res?.status) {
      toast.success(res?.message);
      setShowModal(false);
      handleUserAccessList();
    } else {
      toast.error(res?.message);
    }
    setLoading(false);
  };

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

                {(!loading && userAccess && (
                  <CustomDataTable rows={userAccess} columns={columns} options={options} />
                )) || <TableLoader />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserAccess;
