import React from 'react';
import { BiGlobe } from 'react-icons/bi';
import { SiGithub, SiLinkedin, SiNotion } from 'react-icons/si';
import { FiFigma } from 'react-icons/fi';

const link = {
  GITHUB: 'github',
  LINKEDIN: 'linkedin',
  NOTION: 'notion',
  FIGMA: 'figma',
  OTHER: 'other',
};

const LinkIcon = ({ links, linkType }) => {
  let Icon;
  let url = links[linkType];
  switch (linkType) {
    case link.GITHUB:
      Icon = SiGithub;
      url = url && 'https://github.com/' + url;
      break;
    case link.LINKEDIN:
      Icon = SiLinkedin;
      url = url && 'https://www.linkedin.com/in/' + url;
      break;
    case link.NOTION:
      Icon = SiNotion;
      break;
    case link.FIGMA:
      Icon = FiFigma;
      break;
    case link.OTHER:
      Icon = BiGlobe;
      break;
    default:
      Icon = BiGlobe;
  }
  return (
    <a href={url} target="_blank" className="table-link-icons">
      <Icon size={16} color={url ? '#0069CA' : '#657788'} />
    </a>
  );
};

const LinkIcons = ({ value, linkTypes }) => (
  <div>
    {linkTypes.map((linkType) => (
      <LinkIcon links={value} linkType={linkType} key={linkType} />
    ))}
  </div>
);

LinkIcons.defaultProps = {
  value: {},
};

export { LinkIcons as default, link };
