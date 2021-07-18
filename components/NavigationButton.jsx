import React from 'react';
import { Icon, IconButton } from 'rsuite';

const prevTitle = (manual, content) => {
  const sections = manual.sections;
  const currentSection = sections.filter((item) => item.id === content.sectionId);
  const currentSectionKey = sections.map((item) => item.id).indexOf(content.sectionId);
  const currentContents = currentSection[0].contents.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
  }));
  let currentContentKey = currentContents.map((item) => item.id).indexOf(content.id);
  let prev = 0;
  if (currentContents.length > currentContentKey && currentContentKey !== 0) {
    prev = currentContentKey - 1;
    prev = currentContents[prev];
    prev = prev ? prev.title : false;
  } //Get previous section and use
  else if (sections.length > currentSectionKey && currentSectionKey !== 0) {
    prev = currentSectionKey - 1;
    prev = sections[prev];
    if (prev) {
      let prevContents = prev.contents,
        length = prev.contents.length - 1;
      prev = prevContents[length];
      prev = prev.title;
      prev = prev ? prev : false;
    } else {
      prev = false;
    }
  }

  return prev;
};

const prevLink = (manual, content) => {
  const sections = manual.sections;
  const currentSection = sections.filter((item) => item.id === content.sectionId);
  const currentSectionKey = sections.map((item) => item.id).indexOf(content.sectionId);
  const currentContents = currentSection[0].contents.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
  }));
  let currentContentKey = currentContents.map((item) => item.id).indexOf(content.id);
  let prev = 0;
  if (currentContents.length > currentContentKey && currentContentKey !== 0) {
    prev = currentContentKey - 1;
    prev = currentContents[prev];
    if (prev) {
      prev = `/m/${manual.slug}/${prev.slug}`;
      prev = prev ? prev : false;
    } else {
      prev = false;
    }
  } //Get previous section and use
  else if (sections.length > currentSectionKey && currentSectionKey !== 0) {
    prev = currentSectionKey - 1;
    prev = sections[prev];
    if (prev) {
      let prevContents = prev.contents,
        length = prev.contents.length - 1;
      prev = prevContents[length];
      prev = `/m/${manual.slug}/${prev.slug}`;
      prev = prev ? prev : false;
    } else {
      prev = false;
    }
  }

  return prev;
};

const nextTitle = (manual, content) => {
  const sections = manual.sections;
  const currentSection = sections.filter((item) => item.id === content.sectionId);
  const currentSectionKey = sections.map((item) => item.id).indexOf(content.sectionId);
  const currentContents = currentSection[0].contents.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
  }));
  let currentContentKey = currentContents.map((item) => item.id).indexOf(content.id);
  let next = 0;
  let last = currentContents.length - currentContentKey;
  if (currentContents.length > currentContentKey && last !== 1) {
    next = currentContentKey + 1;
    next = currentContents[next];
    next = next ? next.title : false;
  } //Get next section and use
  else if (sections.length > currentSectionKey) {
    next = currentSectionKey + 1;
    next = sections[next];
    if (next) {
      let nextContents = next.contents;
      next = nextContents[0];
      next = next ? next.title : false;
    } else {
      next = false;
    }
  }

  return next;
};

const nextLink = (manual, content) => {
  const sections = manual.sections;
  const currentSection = sections.filter((item) => item.id === content.sectionId);
  const currentSectionKey = sections.map((item) => item.id).indexOf(content.sectionId);
  const currentContents = currentSection[0].contents.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
  }));
  let currentContentKey = currentContents.map((item) => item.id).indexOf(content.id);
  let next = 0;
  let last = currentContents.length - currentContentKey;
  if (currentContents.length > currentContentKey && last !== 1) {
    next = currentContentKey + 1;
    next = currentContents[next];
    next = next && next.id ? `/m/${manual.slug}/${next.slug}` : false;
  } //Get nextious section and use
  else if (sections.length > currentSectionKey) {
    next = currentSectionKey + 1;
    next = sections[next];
    if (next) {
      let nextContents = next.contents;
      next = nextContents[0];
      next = next && next.id ? `/m/${manual.slug}/${next.slug}` : false;
    } else {
      next = false;
    }
  }

  return next;
};

const title = (manual, content, forward) => {
  if (forward) {
    return nextTitle(manual, content);
  } else {
    return prevTitle(manual, content);
  }
};

const link = (manual, content, forward) => {
  if (forward) {
    return nextLink(manual, content);
  } else {
    return prevLink(manual, content);
  }
};

const NavigationButton = ({ manual, content, forward }) => (
  <IconButton
    appearance="subtle"
    icon={<Icon icon={forward ? 'chevron-right' : 'chevron-left'} />}
    placement={forward ? 'right' : 'left'}
    style={{
      float: forward ? 'right' : 'left',
      display: title(manual, content, forward) ? 'inline-block' : 'none',
    }}
    href={link(manual, content, forward)}
  >
    {title(manual, content, forward)}
  </IconButton>
);

export default NavigationButton;
