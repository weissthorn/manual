import React from 'react';
import { Container, Content, InputPicker, Table, Input, Modal, Button, Alert } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import Header from '../components/Header';
import moment from 'moment';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

export default function Admin() {
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [profile, setProfile] = React.useState({});
  const [notify, setNotify] = React.useState();
  const router = useRouter();
  const cookie = parseCookies();

  React.useEffect(() => {
    let user = cookie;
    user = user && user._auth ? JSON.parse(user._auth) : null;
    user = user && user.role === 'reader' ? router.push('/401') : null;
  }, []);

  React.useEffect(() => {
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
          setNotify(res.error);
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
          setNotify(res.error);
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

  const handleRole = (value) => {
    user.role = value;
    setUser(user);
  };

  const handleName = (value) => {
    profile.name = value;
    setProfile(profile);
  };

  const handleEmail = (value) => {
    profile.email = value;
    setProfile(profile);
  };

  const handlePassword = (value) => {
    profile.password = value;
    setProfile(profile);
  };

  const handleRoleChange = (value) => {
    profile.role = value;
    setProfile(profile);
  };

  const handleBannedChange = (value) => {
    profile.status = value;
    setProfile(profile);
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
          Alert.info('User added', 5000);
        } else {
          setNotify(res.error);
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
          Alert.info('User detail updated', 5000);
        } else {
          setNotify(res.error);
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

  const save = (e) => {
    e.preventDefault();

    let field,
      form = user;
    field = document.querySelectorAll('.user');
    field.forEach((item) => {
      let { name, value } = item;
      form[name] = value;
    });

    const { name, email, password, role } = form;

    if (!name) {
      setNotify('Name is too short !');
    } else if (!email) {
      setNotify('Invalid email address!');
    } else if (!password) {
      setNotify('Password is too short!');
    } else if (!role) {
      setNotify('Choose a role!');
    } else {
      setNotify('');
      addUser(form);
    }
  };

  const saveEdit = (e) => {
    e.preventDefault();

    let form = profile;

    if (!form.name) {
      setNotify('Name is too short !');
    } else if (!form.email) {
      setNotify('Invalid email address!');
    } else if (!form.role) {
      setNotify('Choose a role!');
    } else {
      setNotify('');
      updateUser(form);
    }
  };

  return (
    <div className="show-fake-browser navbar-page">
      <Modal size={'xs'} show={modal} backdrop="static">
        <form onSubmit={save}>
          <Modal.Header>
            <Modal.Title>Add user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Name"
              type="name"
              name="name"
              className="user"
              // required
            />
            <br />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              className="user"
              // required
            />
            <br />
            <Input
              placeholder="Password"
              type="password"
              name="password"
              className="user"
              // required
            />
            <br />
            <InputPicker
              data={[
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Reader', value: 'reader' },
              ]}
              placeholder="Role"
              block
              required
              onChange={handleRole}
            />
            <br />

            <span style={{ color: '#cb0000' }}>{notify}</span>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="blue" loading={loading}>
              Save
            </Button>
            <Button onClick={toggleModal} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <Modal size={'xs'} show={modal2} onHide={toggleModal2} backdrop="static">
        <form onSubmit={saveEdit}>
          <Modal.Header>
            <Modal.Title>Edit user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              placeholder="Name"
              type="name"
              name="name"
              onChange={handleName}
              defaultValue={profile.name}
              className="user2"
            />
            <br />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleEmail}
              defaultValue={profile.email}
              className="user2"
            />
            <br />
            <Input
              placeholder="Type password to override existing password."
              type="password"
              name="password"
              className="user"
              onChange={handlePassword}
              className="user2"
            />
            <br />
            <InputPicker
              data={[
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
                { label: 'Reader', value: 'reader' },
              ]}
              defaultValue={profile.role}
              placeholder="Role"
              block
              required
              onChange={handleRoleChange}
              className="user2"
            />
            <br />
            <InputPicker
              data={[
                { label: 'Active', value: 'active' },
                { label: 'Not active', value: 'not active' },
              ]}
              defaultValue={profile.status}
              placeholder="Active or not active?"
              block
              required
              onChange={handleBannedChange}
              className="user2"
            />
            <br />

            <span style={{ color: '#cb0000' }}>{notify}</span>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="blue" loading={loading}>
              Save
            </Button>
            <Button onClick={toggleModal2} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Container>
        <Header title="Admin" />

        <Content className="container">
          <br />
          <br />
          <div>
            <div>
              <div className="admin-search">
                <Input
                  size="lg"
                  type="search"
                  placeholder="Search using name, email...."
                  onChange={handleSearch}
                />
              </div>

              <h4 className="top-heading">
                {users.length}
                {users.length <= 1 ? ' User' : ' Users'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button appearance="default" onClick={toggleModal}>
                  + Add user
                </Button>
              </h4>
            </div>
            <br />
            <br />

            <Table loading={loading} height={600} data={users}>
              <Column width={200} fixed>
                <HeaderCell>Name</HeaderCell>
                <Cell dataKey="name" />
              </Column>
              <Column width={250} fixed>
                <HeaderCell>Email</HeaderCell>
                <Cell dataKey="email" />
              </Column>
              <Column width={150} fixed>
                <HeaderCell>Role</HeaderCell>
                <Cell dataKey="role" />
              </Column>
              <Column width={200} fixed>
                <HeaderCell>Date</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return <span>{moment(rowData.createdAt).format('MMM D, YYYY @ h:mm A')}</span>;
                  }}
                </Cell>
              </Column>
              <Column width={120} fixed="right">
                <HeaderCell>Action</HeaderCell>
                <Cell>
                  {(rowData) => {
                    return (
                      <span>
                        <Button size="xs" appearance="ghost" onClick={edit.bind(this, rowData.id)}>
                          {' '}
                          Edit{' '}
                        </Button>
                      </span>
                    );
                  }}
                </Cell>
              </Column>
            </Table>
          </div>
        </Content>
      </Container>
    </div>
  );
}
