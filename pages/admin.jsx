import { Container, Content, InputPicker, Table, Input, Modal, Button, Alert } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import Header from '../components/Header';
import moment from 'moment';
import React from 'react';

export default function Admin() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [notify, setNotify] = React.useState();

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
    const url = `api/users?page=1&limit=1000`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
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
    const url = `api/users/search?query=${query}&page=1&limit=1000`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
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
    console.log(value);
    user.name = value;
    setUser(user);
  };

  const handleEmail = (value) => {
    user.email = value;
    setUser(user);
  };

  const handlePassword = (value) => {
    user.password = value;
    setUser(user);
  };

  const handleRoleChange = (value) => {
    user.role = value;
    setUser(user);
  };

  const handleBannedChange = (value) => {
    user.banned = value;
    setUser(user);
  };

  const addUser = async (form) => {
    setLoading(true);
    const url = `api/users/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getUsers();
          setUser({});
          toggleModal();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const updateUser = async (form) => {
    setLoading(true);
    const url = `api/users/update`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getUsers();
          toggleModal();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const edit = (id) => {
    let user = users.filter((item) => item.id == id);
    user = user[0];
    setUser(user);
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
      addUser(form);
    }
  };

  const saveEdit = (e) => {
    e.preventDefault();

    let field,
      form = user;
    field = document.querySelectorAll('.user2');
    field.forEach((item) => {
      let { name, value } = item;
      form[name] = value;
    });

    if (!form.name) {
      setNotify('Name is too short !');
    } else if (!form.email) {
      setNotify('Invalid email address!');
    } else if (!form.role) {
      setNotify('Choose a role!');
    } else {
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
              value={user.name}
              className="user2"
            />
            <br />
            <Input
              placeholder="Email"
              type="email"
              name="email"
              onChange={handleEmail}
              value={user.email}
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
              value={user.role}
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
              value={user.status}
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
              <Input
                size="lg"
                type="search"
                placeholder="Search using name, email...."
                style={{ width: 400 }}
                onChange={handleSearch}
              />
              <br />
              <h3>{users.length <= 1 ? 'User' : 'Users'}</h3>
              <Button appearance="default" onClick={toggleModal}>
                + Add user
              </Button>
            </div>
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
                    return <span>{moment(rowData.createdAt).format('MMM D,YYYY @ h:mm A')}</span>;
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

            {/* <div className="center">
              <br />
              <Button size="sm">&larr; Previous</Button>
              <Button size="sm" style={{ marginLeft: 10 }}>
                Next &rarr;
              </Button>
            </div> */}
          </div>
        </Content>
        {/* <Footer></Footer> */}
      </Container>
    </div>
  );
}
