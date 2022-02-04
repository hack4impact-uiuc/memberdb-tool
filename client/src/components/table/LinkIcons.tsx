import React from 'react';
import PropTypes from 'prop-types';
import { BiGlobe } from 'react-icons/bi';
import { SiGithub, SiLinkedin, SiNotion } from 'react-icons/si';
import { FiFigma } from 'react-icons/fi';

enum Link {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  NOTION = 'notion',
  FIGMA = 'figma',
  OTHER = 'other',
};

type LinkIconProps = {
  links: {[key in Link]: string},
  linkType: Link,
}

const LinkIcon = ({ links, linkType }: LinkIconProps) => {   
  const getIcon = (icon: Link) => {
    const iconMap = {
      'github': SiGithub,
      'linkedin': SiLinkedin,
      'notion': SiNotion,
      'figma': FiFigma,
      'other': BiGlobe
    }
    return iconMap[icon];
  }

  const Icon = getIcon(linkType) || BiGlobe;
  let url = links[linkType];

  if (linkType == Link.LINKEDIN) {
    url = url && `https://www.linkedin.com/in/${url}`;
  }
  if (linkType == Link.GITHUB) {
    url = url && `https://github.com/${url}`;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="table-link-icons"
    >
      <Icon size={16} color={url ? '#0069CA' : '#657788'} />
    </a>
  );
};

type LinkIconsProps = {
  value: {[key in Link]: string},
  linkTypes: Link[],
}
const LinkIcons = ({ value, linkTypes }: LinkIconsProps) => (
  <div>
    {linkTypes.map((linkType) => (
      <LinkIcon links={value} linkType={linkType} key={linkType} />
    ))}
  </div>
);

export { LinkIcons as default, Link };
