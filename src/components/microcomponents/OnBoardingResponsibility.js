import React from 'react';
import CustomCheckBox from './CustomCheckBox';
import PropTypes from 'prop-types';

class OnBoardingResponsibility extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      previousPage: PropTypes.string,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      CurrentPage: 'OnBoardingResponsibility',
      isChecked: false,
    };

    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    if (this.state.isChecked) this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box">
            <div className="swash-onboarding-box-header">
              <p>Know your responsibility</p>
            </div>
            <div className="swash-onboarding-box-body">
              <p>
                If you lose your private keys, or someone else gains access to them, <b>you will lose all of your funds forever</b>. Swash cannot
                recover them. It’s your responsibility to be safe and secure.
              </p>
              <div
                className="swash-onboarding-box-footer-left-small"
                onClick={() => {
                  this.setState({isChecked: !this.state.isChecked});
                }}>
                <CustomCheckBox
                  id="approvePolicy"
                  checked={this.state.isChecked}
                  handleClick={() => {
                    this.setState({
                      isChecked: !this.state.isChecked,
                    });
                  }}
                />
                <span>I have read it and I agree</span>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left">
                <div
                  className="swash-onboarding-box-approve-wrapper"
                  onClick={() => {
                    this.setState({isChecked: !this.state.isChecked});
                  }}>
                  <CustomCheckBox id="approvePolicy" checked={this.state.isChecked} />
                  <span>I have read it and I agree</span>
                </div>
              </div>
              <div className="swash-onboarding-box-footer-right">
                <div
                  className={this.state.isChecked ? 'swash-onboarding-proceed-button' : 'swash-onboarding-proceed-disable-button'}
                  onClick={this.LoadOnBoardingNew}>
                  Proceed
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default OnBoardingResponsibility;
