import { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Table, Loading, Link, Spacer } from '@geist-ui/core';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import moment from 'moment';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import useToken from '../components/Token';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [users, setUsers] = useState([]);
  const [field, setField] = useState({});
  const [profile, setProfile] = useState({});
  const router = useRouter();
  const user = useToken;

  useEffect(() => {
    user && user.role === 'reader' ? router.push('/401') : null;
  }, [user]);

  useEffect(() => {
    getUsers();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModal2 = () => {
    setModal2(!modal2);
  };

  const getUsers = async () => {
    setLoading(true);
    const url = `/api/users?page=1&limit=1000`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
          setLoading(false);
        } else {
          toast.error(res.error);
        }
      });
  };

  const searchUser = async (query) => {
    setLoading(true);
    const url = `/api/users/search?query=${query}&page=1&limit=1000`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsers(res.data);
          setLoading(false);
        } else {
          toast.error(res.error);
        }
      });
  };

  const handleSearch = (val) => {
    val = val.trim();

    if (val) {
      searchUser(val);
    } else {
      getUsers();
    }
  };

  const addUser = async (form) => {
    setLoading(true);
    const url = `/api/users/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getUsers();
          setUser({});
          toggleModal();
          toast.success('User added', 5000);
        } else {
          toast.error(res.error);
          setLoading(false);
        }
      });
  };

  const updateUser = async (form) => {
    setLoading(true);
    const url = `/api/users/update`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getUsers();
          setProfile({});
          toggleModal2();
          toast.success('User detail updated', 5000);
        } else {
          toast.error(res.error);
          setLoading(false);
        }
      });
  };

  const edit = (id) => {
    let editUser = users.filter((item) => item.id === id);
    editUser = editUser[0];

    setProfile(editUser);
    toggleModal2();
  };

  const save = async () => {
    const { name, email, password, role } = field;

    if (!name || name.length < 3) {
      toast.error('Name is too short ! Minimum 3 characters');
    } else if (!email) {
      toast.error('Invalid email address!');
    } else if (!password || password.length < 6) {
      toast.error('Password is too short! Minimum 6 characters.');
    } else if (!role) {
      toast.error('Choose a role!');
    } else {
      await addUser(field);
    }
  };

  const saveEdit = async () => {
    const { name, email, password, role } = profile;

    if (!name || name.length < 3) {
      toast.error('Name is too short ! Minimum 3 characters');
    } else if (!email) {
      toast.error('Invalid email address!');
    } else if (!role) {
      toast.error('Choose a role!');
    } else {
      await updateUser(profile);
    }
  };

  return (
    <div className="show-fake-browser navbar-page">
      <Toaster />
      <Modal visible={modal} disableBackdropClick>
        <Modal.Title>Add user</Modal.Title>
        <Modal.Content>
          <Input
            width={'100%'}
            placeholder="Name"
            onChange={(e) => setField({ ...field, name: e.target.value })}
          />
          <Spacer />
          <Input
            width={'100%'}
            placeholder="Email"
            htmlType="email"
            onChange={(e) => setField({ ...field, email: e.target.value })}
          />
          <Spacer />
          <Input.Password
            width={'100%'}
            placeholder="Password"
            onChange={(e) => setField({ ...field, password: e.target.value })}
          />
          <Spacer />

          <Select
            width={'100%'}
            placeholder="Role"
            onChange={(role) => setField({ ...field, role: role })}
          >
            {[
              { label: 'Admin', value: 'admin' },
              { label: 'Editor', value: 'editor' },
              { label: 'Reader', value: 'reader' },
            ].map((item, key) => (
              <Select.Option key={key} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Spacer />
        </Modal.Content>

        <Modal.Action onClick={toggleModal} passive>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={save} loading={loading}>
          Save
        </Modal.Action>
      </Modal>
      <Modal visible={modal2} onClose={toggleModal2} disableBackdropClick>
        <Modal.Title>Edit user</Modal.Title>
        <Modal.Content>
          <Input
            width={'100%'}
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
          <Spacer />
          <Input
            width={'100%'}
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <Spacer />
          <Input.Password
            width={'100%'}
            placeholder="Type password to override existing password."
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
          <Spacer />
          <Select
            width={'100%'}
            value={profile.role}
            placeholder="Role"
            onChange={(role) => setProfile({ ...profile, role: role })}
          >
            {[
              { label: 'Admin', value: 'admin' },
              { label: 'Editor', value: 'editor' },
              { label: 'Reader', value: 'reader' },
            ].map((item, key) => (
              <Select.Option key={key} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
          <Spacer />
          <Select
            width={'100%'}
            value={profile.status}
            placeholder="Status"
            onChange={(status) => setProfile({ ...profile, status: status })}
          >
            <Select.Option value={'active'}>Active</Select.Option>
            <Select.Option value={'not active'}>Not active</Select.Option>
          </Select>

          <Spacer />
        </Modal.Content>

        <Modal.Action onClick={toggleModal2} passive>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={saveEdit} loading={loading}>
          Save
        </Modal.Action>
      </Modal>

      <Header title="Admin" />

      <div className="container">
        <Spacer h={7} />
        <div>
          <div>
            <div className="admin-search">
              <Input
                width={'100%'}
                htmlType="search"
                placeholder="Search using name, email...."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <h4 className="top-heading">
              {users.length}
              {users.length <= 1 ? ' User' : ' Users'}
              <Spacer w={3} inline />
              <Button auto onClick={toggleModal}>
                + Add user
              </Button>
            </h4>
          </div>
          <Spacer h={2} />

          <Table data={users}>
            <Table.Column prop="name" label="Name" />
            <Table.Column prop="email" label="Email" />
            <Table.Column prop="role" label="Role" />
            <Table.Column
              prop="status"
              label="Status"
              render={(status) => (
                <span style={{ color: status === 'active' ? 'green' : 'red' }}>{status}</span>
              )}
            />
            <Table.Column
              prop="createdAt"
              label="Date"
              render={(_, rowData) => (
                <span>{moment(rowData.createdAt).format('MMM D, YYYY @ h:mm A')}</span>
              )}
            />
            <Table.Column
              prop="action"
              label="Action"
              render={(_, rowData) => (
                <Button auto scale={0.5} type="secondary-light" onClick={() => edit(rowData.id)}>
                  Edit
                </Button>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
