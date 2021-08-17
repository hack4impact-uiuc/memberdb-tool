import React from 'react';
import { BiGlobe } from 'react-icons/bi';
import { SiGithub, SiLinkedin } from 'react-icons/si';

const LinkIcons = ({ value }) => {
  const { github, linkedin, other } = value ?? {};
  const githubLink = github && 'https://github.com/' + github;
  const linkedinLink = linkedin && 'https://www.linkedin.com/in/' + linkedin;

  return (
    <div>
      <a href={githubLink} target="_blank" className="table-link-icons">
        <SiGithub size={16} color={github ? '#0069CA' : '#657788'} />
      </a>
      <a href={linkedinLink} target="_blank" className="table-link-icons">
        <SiLinkedin size={16} color={linkedin ? '#0069CA' : '#657788'} />
      </a>
      <a href={other} target="_blank" className="table-link-icons">
        <BiGlobe size={16} color={other ? '#0069CA' : '#657788'} />
      </a>
    </div>
  );
};

export default LinkIcons;
