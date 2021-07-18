import React from 'react';
import {
  Button,
  Panel,
  PanelGroup,
  Divider,
  Icon,
  IconButton,
  Row,
  Col,
  Modal,
  Input,
  InputGroup,
  Alert,
} from 'rsuite';
import { parseCookies } from 'nookies';
import Header from '../../../components/ManualHeader';
import Editor from '../../../components/Editor';
import { useRouter } from 'next/router';
import moment from 'moment';
import DOMPurify from 'dompurify';
import NavigationButton from '../../../components/NavigationButton';

export default function Chapter() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [modal3, setModal3] = React.useState(false);
  const [modal4, setModal4] = React.useState(false);
  const [result, setResult] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [notify, setNotify] = React.useState();
  const [manual, setManual] = React.useState({});
  const [title, setTitle] = React.useState();
  const [contents, setContents] = React.useState({});
  const [content, setContent] = React.useState();
  const [section, setSection] = React.useState();
  const [sectionId, setSectionId] = React.useState();
  const [menu, setMenu] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady) return;
    getManual();
    loadContent();
  }, [router.query]);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModal2 = () => {
    let editSection = manual.sections.filter((item) => item.id === contents.sectionId);
    setSection(editSection[0].title);
    setSectionId(contents.sectionId);
    setModal2(!modal2);
  };

  const toggleModal3 = (e) => {
    let id = e.target.id;
    if (id) {
      setSectionId(id);
    } else {
      setTitle();
      setContent();
    }
    setModal3(!modal3);
  };

  const toggleModal4 = () => {
    setTitle(contents.title);
    setContent(contents.content);
    setModal4(!modal4);
  };

  const toggleSearch = () => {
    setSearch(!search);
  };

  const searchContent = (val) => {
    setSearch(true);
    if (val.length) {
      searchManual(val);
    } else {
      setSearch(false);
    }
  };

  const searchManual = async (q) => {
    setLoading(true);
    const url = `/api/search?query=${q}&manualId=${manual.id}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          setResult(res.data);
          setNotify('');
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const getContent = (contents, title) => {
    const { chapter } = router.query;
    contents = contents && contents.length ? contents : [];
    contents = contents
      .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
      .reverse();
    let url = contents.map((item, key) => (
      <a
        href={`/m/${title}/${item.slug}`}
        id={`${item.slug}`}
        key={key}
        className={`${chapter === item.slug ? 'active' : ''}`}
      >
        {item.title}
      </a>
    ));

    return url;
  };

  const getSearch = (contents, title) => {
    const { chapter } = router.query;
    contents = contents && contents.length ? contents : [];
    contents = contents
      .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
      .reverse();
    let url = contents.map((item, key) => (
      <div key={key}>
        <a
          href={`/m/${title}/${item.slug}`}
          id={`${item.slug}`}
          className={`${chapter === item.slug ? 'active' : ''}`}
          style={{ paddingLeft: 5 }}
        >
          {item.title}
        </a>
      </div>
    ));

    return url;
  };

  const loadContent = async () => {
    const { chapter } = router.query;

    setLoading(true);
    const url = `/api/content/${chapter}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          setContents(res.data);
          setNotify('');
        } else {
          if (res.error === 'Unable to get content.') {
            router.push('/404');
          }
          setLoading(false);
        }
      });
  };

  const saveSection = async (form) => {
    setLoading(true);
    const url = `/api/sections/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManual();
          setNotify('');
          setSection('');
          Alert.info('Section created!');
          toggleModal();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const updateSection = async (form) => {
    setLoading(true);
    const url = `/api/sections/update`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManual();
          setNotify('');
          setSection('');
          Alert.info('Section updated!');
          toggleModal2();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addSection = () => {
    if (!section) {
      setNotify('Section title is empty!');
    } else {
      setNotify('');
      const data = {
        title: section,
        manualId: manual.id,
        user: user.id,
      };

      saveSection(data);
    }
  };

  const editSection = () => {
    if (!section) {
      setNotify('Section title is empty!');
    } else {
      setNotify('');
      const data = {
        title: section,
        id: sectionId,
        user: user.id,
      };

      updateSection(data);
    }
  };

  const saveContent = async (form) => {
    setLoading(true);
    const url = `/api/content/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          router.push(`/m/${manual.slug}/${res.data.slug}`);
          setNotify('');
          setTitle('');
          setContent('');
          Alert.info('Content created!');
          setModal3(false);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const updateContent = async (form) => {
    setLoading(true);
    const url = `/api/content/update`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          router.push(`/m/${manual.slug}/${res.data.slug}`);
          setNotify('');
          setTitle('');
          setContent('');
          Alert.info('Content updated!');
          setModal4(false);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addContent = () => {
    if (!title) {
      setNotify('Content title is empty!');
    } else if (!content) {
      setNotify('Content is empty!');
    } else {
      setNotify('');
      const data = {
        title,
        content,
        sectionId,
        user: user.id,
      };

      saveContent(data);
    }
  };

  const editContent = () => {
    if (!title) {
      setNotify('Content title is empty!');
    } else if (!content) {
      setNotify('Content is empty!');
    } else {
      setNotify('');
      const data = {
        title,
        content,
        id: contents.id,
        user: user.id,
      };

      updateContent(data);
    }
  };

  const handleTitle = (val) => {
    setTitle(val);
  };

  const handleContent = (val) => {
    val = DOMPurify.sanitize(val);
    setContent(val);
  };

  const getManual = async () => {
    const { slug } = router.query;

    setLoading(true);
    const url = `/api/manuals/${slug}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          setManual(res.data);
          setNotify('');
        } else {
          if (res.error === 'Unable to get manual.') {
            router.push('/404');
          }
          setLoading(false);
        }
      });
  };

  const isLoggedIn = () => {
    let user = parseCookies();
    user = user && user._auth ? JSON.parse(user._auth) : {};
    return user;
  };

  const user = isLoggedIn();

  let sections = manual && manual.sections ? manual.sections : [];
  sections = sections
    .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
    .reverse();
  sections = sections.map((item, key) => (
    <Panel defaultExpanded={item.contents.length ? true : false} header={item.title} key={key}>
      {getContent(item.contents, manual.slug)}
      <IconButton
        id={item.id}
        size="xs"
        appearance="subtle"
        icon={<Icon icon="plus" />}
        placement="left"
        onClick={toggleModal3}
        style={{ display: user.role !== 'reader' ? 'block' : 'none' }}
      >
        Add content
      </IconButton>
    </Panel>
  ));

  return (
    <div className="show-fake-browser navbar-page">
      <div
        className="custom-modal"
        style={{ display: search ? 'block' : 'none' }}
        onClick={toggleSearch}
      >
        &nbsp;
      </div>
      <div className="custom-modal" style={{ display: menu ? 'block' : 'none' }}>
        <div className="side-menu mobile">
          <div className="inner">
            <h4>
              {manual.title}{' '}
              <span className="icon-menu" onClick={toggleMenu}>
                <Icon icon="close" size={'2x'} />
              </span>
            </h4>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={toggleModal}
              style={{ display: user && user.role !== 'reader' ? 'block' : 'none' }}
            >
              Add section
            </IconButton>
            <PanelGroup accordion>{sections}</PanelGroup>
          </div>
        </div>
      </div>

      <Modal show={modal} onHide={toggleModal}>
        <Modal.Header>
          <Modal.Title>Add section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: '#cb0000' }}>{notify}</p>
          <br />
          <Input type="text" placeholder="Section Title" onChange={(value) => setSection(value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addSection} appearance="primary" loading={loading}>
            Save
          </Button>
          <Button onClick={toggleModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modal2} onHide={toggleModal2}>
        <Modal.Header>
          <Modal.Title>Edit section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: '#cb0000' }}>{notify}</p>
          <br />
          <Input
            type="text"
            placeholder="Section Title"
            value={section}
            onChange={(value) => setSection(value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={editSection} appearance="primary" loading={loading}>
            Save
          </Button>
          <Button onClick={toggleModal2} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal full overflow={true} show={modal3} onHide={toggleModal3}>
        <Modal.Header>
          <Modal.Title>Add content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={9}>
              <Input type="text" placeholder="Content Title" onChange={handleTitle} /> <br />
              <Editor onChange={handleContent} />
            </Col>
            <Col xsOffset={1} xs={12}>
              <h4>{title}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addContent} loading={loading} appearance="primary">
            Save
          </Button>
          <Button onClick={toggleModal3} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal full overflow={true} show={modal4} onHide={toggleModal4}>
        <Modal.Header>
          <Modal.Title>Update content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={9}>
              <Input type="text" placeholder="Content Title" value={title} onChange={handleTitle} />{' '}
              <br />
              <Editor onChange={handleContent} value={content} />
            </Col>
            <Col xsOffset={1} xs={12}>
              <h4>{title}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={editContent} loading={loading} appearance="primary">
            Save
          </Button>
          <Button onClick={toggleModal4} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="side-menu">
        <div className="inner">
          <span className="menu mobile" onClick={toggleMenu}>
            <Icon icon="bars" size={'2x'} />
          </span>
          <div className="desktop inner-menu">
            <h4>{manual.title}</h4>
            <IconButton
              appearance="subtle"
              icon={<Icon icon="plus" />}
              placement="left"
              onClick={toggleModal}
              style={{
                display:
                  user &&
                  user.role !== 'reader' &&
                  manual &&
                  manual.sections &&
                  manual.sections.length
                    ? 'block'
                    : 'none',
              }}
            >
              Add section
            </IconButton>
            <PanelGroup accordion>{sections}</PanelGroup>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="header">
          <div className="search">
            <InputGroup inside>
              <InputGroup.Addon>
                <Icon icon="search" />
              </InputGroup.Addon>
              <Input size={'lg'} placeholder={`Search manual....`} onChange={searchContent} />
            </InputGroup>
          </div>

          <Header />
        </div>
        <div className="search-result" style={{ display: search ? 'block' : 'none' }}>
          {result
            .sort((a, b) => b.contents.length - a.contents.length)
            .map((item, key) => (
              <div key={key} className="result">
                <Row>
                  <Col xs={24} lg={8}>
                    <h5>{item.title}</h5>
                  </Col>
                  <Col xs={24} lg={16} style={{ borderLeft: '1px solid #ccc' }}>
                    {getSearch(item.contents, manual.slug)}
                  </Col>
                </Row>
              </div>
            ))}
          {!result.length ? 'No result found' : null}
        </div>

        <div className="inner">
          <div
            className=""
            style={{
              display: user && user.role !== 'reader' && manual ? 'block' : 'none',
            }}
          >
            <IconButton
              onClick={toggleModal2}
              appearance="subtle"
              icon={<Icon icon="pencil" />}
              placement="left"
            >
              Edit section
            </IconButton>
            <IconButton
              onClick={toggleModal4}
              appearance="subtle"
              icon={<Icon icon="pencil" />}
              placement="left"
            >
              Edit content
            </IconButton>
          </div>
          <span className="space-20" />
          <div>
            <h3 className="page-title">{contents ? contents.title : ''}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: contents ? contents.content : '',
              }}
            />
          </div>
        </div>
        {manual && manual.sections && contents.sectionId ? (
          <div className="footer">
            <Divider />

            <NavigationButton manual={manual} content={contents} forward={false} />
            <NavigationButton manual={manual} content={contents} forward={true} />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
