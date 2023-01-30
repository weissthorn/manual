import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import {
  Button,
  Card,
  Input,
  Textarea,
  Link,
  Spacer,
  Modal,
  Loading,
  Collapse,
  Divider,
} from '@geist-ui/core';
import { Search, Edit, ChevronRight, Plus, XCircle, Menu, XCircleFill } from '@geist-ui/icons';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../../components/ManualHeader';
import Editor from '../../../components/Editor';
import { useRouter } from 'next/router';
import moment from 'moment';
import DOMPurify from 'dompurify';
import useToken from '../../../components/Token';

export default function Manual() {
  const router = useRouter();
  const user = useToken();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState();
  const [notify, setNotify] = useState();
  const [manual, setManual] = useState({});
  const [manualTitle, setManualTitle] = useState();
  const [manualDescription, setManualDescription] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [section, setSection] = useState();
  const [sectionId, setSectionId] = useState();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    getManual();
  }, [router, user]);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleModal2 = () => {
    setManualTitle(manual.title);
    setManualDescription(manual.description);
    setModal2(!modal2);
  };

  const toggleModal3 = (id) => {
    if (id) {
      setSectionId(id);
    } else {
      setTitle();
      setContent();
    }
    setModal3(!modal3);
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
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
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

  const saveSection = async (form) => {
    setLoading(true);
    const url = `/api/sections/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManual();
          setNotify('');
          toast.success('Section created!');
          toggleModal();
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addSection = async () => {
    if (!section) {
      setNotify('Section title is empty!');
    } else {
      setNotify('');
      const data = {
        title: section,
        manualId: manual.id,
        user: user.id,
      };

      await saveSection(data);
    }
  };

  const saveContent = async (form) => {
    setLoading(true);
    const url = `/api/content/create`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          router.push(`/m/${manual.slug}/${res.data.slug}`);
          setNotify('');
          setTitle();
          setContent();
          toast.success('Content created!');
          setModal3(false);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const addContent = async () => {
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

      await saveContent(data);
    }
  };

  const getManual = async () => {
    const { slug } = router.query;

    setLoading(true);
    const url = `/api/manuals/${slug}`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
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

  const updateManual = async (form) => {
    setLoading(true);
    const url = `/api/manuals/update`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
          getManual();
          toggleModal2();
          toast.success('Manual updated successfully', 5000);
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const saveManual = () => {
    if (!manualTitle) {
      toast.warning('Manual title is empty!');
    } else if (!manualDescription) {
      toast.warning('Manual description is empty!');
    } else {
      const form = { id: manual.id, title: manualTitle, description: manualDescription };
      updateManual(form);
    }
  };

  let sections = manual && manual.sections ? manual.sections : [];
  sections = sections
    .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
    .reverse();
  sections = sections.map((item, key) => (
    <Collapse key={item.id} title={item.title} initialVisible={item.contents.length ? true : false}>
      {getContent(item.contents, manual.slug)}
      <Button
        scale={0.5}
        type="abort"
        icon={<Plus />}
        id={item.id}
        onClick={() => toggleModal3(item.id)}
        style={{ display: user.role !== 'reader' ? 'block' : 'none' }}
      >
        Add content
      </Button>
    </Collapse>
  ));

  return (
    <div className="show-fake-browser navbar-page">
      <Toaster />
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
                <XCircleFill />
              </span>
            </h4>
            <Button
              icon={<Plus />}
              onClick={toggleModal}
              style={{ display: user && user.role !== 'reader' ? 'block' : 'none' }}
            >
              Add section
            </Button>
            <Spacer />
            <Collapse.Group accordion>{sections}</Collapse.Group>
          </div>
        </div>
      </div>

      <Modal visible={modal} onClose={toggleModal} disableBackdropClick>
        <Modal.Title>Add section</Modal.Title>
        <Modal.Content>
          <p style={{ color: '#cb0000' }}>{notify}</p>
          <br />
          <Input
            width={'100%'}
            scale={1.5}
            placeholder="Section Title"
            onChange={(e) => setSection(e.target.value)}
          />
        </Modal.Content>
        <Modal.Action passive onClick={toggleModal}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={addSection} loading={loading}>
          Save
        </Modal.Action>
      </Modal>

      <Modal visible={modal2} onClose={toggleModal2} disableBackdropClick>
        <Modal.Title>Edit Manual</Modal.Title>
        <Modal.Content>
          <p style={{ color: '#cb0000' }}>{notify}</p>
          <Spacer />
          <Input
            width={'100%'}
            placeholder="Manual Title"
            onChange={(e) => setManualTitle(e.target.value)}
            initialValue={manual.title}
          />
          <Spacer />
          <Textarea
            width={'100%'}
            rows={3}
            placeholder="Manual description"
            onChange={(e) => setManualDescription(e.target.value)}
            initialValue={manual.description}
          />
        </Modal.Content>
        <Modal.Action passive onClick={toggleModal2}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={saveManual} loading={loading}>
          Save
        </Modal.Action>
      </Modal>

      <Modal width="100vw" visible={modal3} onClose={toggleModal3}>
        <Modal.Title>Add content</Modal.Title>
        <Modal.Content>
          <div className="editor-grid">
            <div>
              <Input
                width="100%"
                placeholder="Content Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <Spacer />
              <Editor height={350} onChange={setContent} />
            </div>
            <div>
              <h3>{title}</h3>
              <div
                className="preview"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </div>
          </div>
        </Modal.Content>

        <Modal.Action onClick={toggleModal3} passive>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={addContent} loading={loading}>
          Save
        </Modal.Action>
      </Modal>

      <div className="side-menu">
        <div className="inner">
          <span className="menu mobile" onClick={toggleMenu}>
            <Menu size={30} />
          </span>
          <div className="desktop inner-menu">
            <h4>{manual.title}</h4>
            <div
              style={{
                display: user && user.role !== 'reader' && manual ? 'block' : 'none',
              }}
            >
              <Button type="abort" icon={<Plus />} onClick={toggleModal}>
                Add section
              </Button>
            </div>

            <Collapse.Group>{sections}</Collapse.Group>
          </div>
        </div>
      </div>
      <div className="contented">
        <div className="header">
          <div className="search">
            <Input
              icon={<Search />}
              placeholder={`Search manual....`}
              onChange={(e) => searchContent(e.target.value)}
            />
          </div>

          <Header title={manual.title} description={manual.description} />
        </div>
        <div className="search-result" style={{ display: search ? 'block' : 'none' }}>
          {result
            .sort((a, b) => b.contents.length - a.contents.length)
            .map((item, key) => (
              <div key={key} className="result">
                <div className="item">
                  <h5>{item.title}</h5>
                </div>
                <div className="item" style={{ borderLeft: '1px solid #ccc' }}>
                  {getSearch(item.contents, manual.slug)}
                </div>
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
            <Button type="abort" icon={<Edit />} onClick={toggleModal2}>
              Edit manual
            </Button>
          </div>
          <span className="space-20" />
          <div>
            <h3>{manual ? manual.title : ''}</h3>
            <p>{manual ? manual.description : ''}</p>
          </div>
        </div>

        <div className="footer">
          <Divider />

          <Button
            auto
            iconRight={<ChevronRight />}
            style={{
              float: 'right',
              display:
                manual &&
                manual.sections &&
                manual.sections.length &&
                manual.sections[0].contents[0]
                  ? 'inline-block'
                  : 'none',
            }}
          >
            <Link
              href={
                manual &&
                manual.sections &&
                manual.sections.length &&
                manual.sections[0].contents[0]
                  ? `/m/${manual.slug}/${manual.sections[0].contents[0].slug}`
                  : ''
              }
            >
              {manual && manual.sections && manual.sections.length && manual.sections[0].contents[0]
                ? manual.sections[0].contents[0].title
                : ''}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
