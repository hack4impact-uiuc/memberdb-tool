import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { Button, Image } from 'semantic-ui-react';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ProfileImageAttribute = ({
  value = '',
  isDisabled = false,
  className = '',
  onChange,
  isRequired = false,
}) => {
  const ref = useRef();

  const onValueChange = async (e) => {
    const base64String = await toBase64(e.target.files[0]);
    onChange(base64String, 'image');
  };

  return (
    <div className={className}>
      <p>{startCase('Image')}</p>
      {value ? (
        <div>
          <Image
            src={value}
            circular
            size="small"
            style={{ paddingBottom: '1em' }}
          />
        </div>
      ) : (
        <p>No Image Uploaded</p>
      )}
      <Button
        content="Choose Image"
        labelPosition="left"
        icon="file"
        onClick={() => ref.current.click()}
        disabled={isDisabled}
      />
      <input
        ref={ref}
        type="file"
        hidden
        onChange={onValueChange}
        required={isRequired}
      />
    </div>
  );
};

ProfileImageAttribute.propTypes = {
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
};

export default ProfileImageAttribute;
