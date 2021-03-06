import React from 'react';
import PropTypes from 'prop-types';

class OnBoardingNewPage extends React.Component {
  static get propTypes() {
    return {
      nextPage: PropTypes.string,
      previousPage: PropTypes.string,
      ChangeOnBoardingPage: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingCreateWallet = this.LoadOnBoardingCreateWallet.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingCreateWallet() {
    window.helper.createAndSaveWallet().then(() => {
      this.props.ChangeOnBoardingPage(this.props.nextPage());
    });
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
              <p>Create new wallet</p>
            </div>
            <div className="swash-onboarding-box-body">
              <p>
                A new Ethereum wallet will be created for you. Keep the address and private keys in a safe place. You can share your wallet address
                with everyone but <b>never share your private keys with anyone</b>.
              </p>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left"></div>
              <div className="swash-onboarding-box-footer-right">
                <div className="swash-onboarding-proceed-button" onClick={this.LoadOnBoardingCreateWallet}>
                  Create
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

export default OnBoardingNewPage;
