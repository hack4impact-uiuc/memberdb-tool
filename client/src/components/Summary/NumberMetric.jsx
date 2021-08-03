import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import '../../css/Summary.css';

const NumberMetric = ({ options, defaultOption, value, label }) => {
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));
  const formattedDefaultOption = formattedOptions.find(
    (option) => option.value === defaultOption,
  );
  return (
    <div className="num-metric-container">
      <Select
        options={formattedOptions}
        defaultValue={formattedDefaultOption}
        className="num-metric-select"
      />
      <span className="num-metric-big-num">{value}</span>
      <span className="num-metric-label">{label}</span>
    </div>
  );
};

NumberMetric.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  defaultOption: PropTypes.string,
  value: PropTypes.number,
  label: PropTypes.string,
};

export default NumberMetric;
