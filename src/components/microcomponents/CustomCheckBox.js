import React from 'react';
import PropTypes from 'prop-types';

import checked from '../../statics/images/checked.svg';
import unchecked from '../../statics/images/Unchecked.svg';

class CustomCheckBox extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.string,
      checked: PropTypes.bool,
      onChange: PropTypes.func,
      handleClick: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {isChecked: this.props.checked};
  }

  componentDidMount() {
    this.setState({isChecked: this.props.checked});
  }

  componentDidUpdate(prevProps) {
    if (this.state.isChecked !== this.props.checked) this.setState({isChecked: this.props.checked});
  }

  handleChange(e) {
    this.setState({isChecked: e.target.checked});
    this.props.onChange(e);
  }

  render() {
    const {isChecked} = this.state;
    const icon = isChecked ? checked : unchecked;
    return (
      <div
        id={this.props.id}
        className="swash-checkbox"
        onClick={() => {
          this.setState({isChecked: !isChecked});

          if (this.props.handleClick) this.props.handleClick(this.state.isChecked);
        }}>
        <img alt={''} src={icon} style={{width: 16, height: 16, cursor: 'pointer'}} />
      </div>
    );
  }
}

export default CustomCheckBox;
