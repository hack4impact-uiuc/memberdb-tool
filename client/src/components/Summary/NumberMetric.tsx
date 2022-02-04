import React from 'react';
import Select from 'react-select';
import '../../css/Summary.css';

type NumberMetricProps = {
  options: string[],
  defaultOption: string,
  value: number,
  label: string,
}

const NumberMetric = ({ options, defaultOption, value, label }: NumberMetricProps) => {
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

export default NumberMetric;