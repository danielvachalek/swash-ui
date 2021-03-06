import React from 'react';
import CustomRadioBox from './CustomRadioBox.js';
import FilePickerPopup from './FilePickerPopup';
import ThreeBoxImg from '../../statics/images/3box.svg';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import CustomSnackbar from './CustomSnackbar';
import PassphraseModal from './PassphraseModal';
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
    this.notifyRef = React.createRef();
    this.state = {showPopup: false, onboardingType: 'LocalFile'};
    // This binding is necessary to make `this` work in the callback
    // this.XXX = this.XXX.bind(this);
    this.LoadOnBoardingNew = this.LoadOnBoardingNew.bind(this);
    this.radioChangeHandler = this.radioChangeHandler.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
  }

  LoadOnBoardingNew() {
    let type = this.state.onboardingType;

    if (!window.browser.runtime.onMessage.hasListener(this.togglePopup)) window.browser.runtime.onMessage.addListener(this.togglePopup);

    switch (type) {
      case 'LocalFile':
        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
          let that = this;
          let file = e.target.files[0];
          let reader = new FileReader();

          reader.readAsText(file);

          reader.onload = function () {
            window.helper.applyConfig(reader.result).then((response) => {
              if (response) {
                that.goToNextPage();
              } else this.notifyRef.current.handleNotification('The configuration file could not be imported', 'error');
            });
          };

          reader.onerror = function () {
            console.error(reader.error);
          };
        };
        input.click();
        // return this.props.ChangeOnBoardingPage('ImportFromLocal');
        break;
      case 'GoogleDrive':
        window.browser.tabs.getCurrent().then((tab) => {
          window.helper.startOnBoarding(type, tab.id).then(() => {});
        });
        break;
      case 'DropBox':
        window.browser.tabs.getCurrent().then((tab) => {
          window.helper.startOnBoarding(type, tab.id).then(() => {});
        });
        break;
      case '3Box':
        this.togglePopup();
        break;
      default:
    }
  }

  radioChangeHandler(selectedType) {
    this.setState({
      onboardingType: selectedType,
    });
  }

  togglePopup(isCompleted) {
    this.setState({
      showPopup: !this.state.showPopup,
    });

    if (isCompleted === true) this.goToNextPage();
  }

  goToNextPage() {
    if (!window.browser.runtime.onMessage.hasListener(this.togglePopup)) window.browser.runtime.onMessage.removeListener(this.togglePopup);
    this.props.ChangeOnBoardingPage(this.props.nextPage());
  }

  goToPreviousPage() {
    this.props.ChangeOnBoardingPage(this.props.previousPage());
  }

  render() {
    let modal = (
      <FilePickerPopup text='Click "Close Button" to hide popup' closePopup={this.togglePopup.bind(this)} onboarding={this.state.onboardingType} />
    );

    if (this.state.onboardingType === '3Box') {
      modal = <PassphraseModal page={'import'} closePopup={this.togglePopup.bind(this)} />;
    }

    return (
      <div className="d-flex justify-content-center">
        <React.Fragment>
          <div className="swash-onboarding-box swash-onboarding-box-big">
            <div className="swash-onboarding-box-header">
              <p>Import your configuration</p>
            </div>
            <div className="swash-onboarding-box-body swash-onboarding-box-body-big swash-onboarding-box-body-import">
              <span>Choose an option to import your settings file</span>
              <br />
              <div className="swash-onbording-export-div">
                <div
                  className="swash-onbording-import-option"
                  onClick={() => {
                    this.setState({onboardingType: 'LocalFile'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="swash-onboarding-import-option-row">
                    <img src={LocalFileImg} alt={''} />
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <span>Local file</span>
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <CustomRadioBox id="LocalFile" handleClick={this.radioChangeHandler} isChecked={this.state.onboardingType === 'LocalFile'} />
                  </div>
                </div>
                <div
                  className="swash-onbording-import-option"
                  onClick={() => {
                    this.setState({onboardingType: 'GoogleDrive'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="swash-onboarding-import-option-row">
                    <img src={GoogleDriveImg} alt={''} />
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <span>Google Drive</span>
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <CustomRadioBox id="GoogleDrive" handleClick={this.radioChangeHandler} isChecked={this.state.onboardingType === 'GoogleDrive'} />
                  </div>
                </div>
                <div
                  className="swash-onbording-import-option"
                  onClick={() => {
                    this.setState({onboardingType: 'DropBox'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="swash-onboarding-import-option-row">
                    <img src={DropboxImg} alt={''} />
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <span>Dropbox</span>
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <CustomRadioBox id="DropBox" handleClick={this.radioChangeHandler} isChecked={this.state.onboardingType === 'DropBox'} />
                  </div>
                </div>
                <div
                  className="swash-onbording-import-option"
                  onClick={() => {
                    this.setState({onboardingType: '3Box'});
                  }}
                  style={{cursor: 'pointer'}}>
                  <div className="swash-onboarding-import-option-row">
                    <img src={ThreeBoxImg} alt={''} />
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <span>3Box</span>
                  </div>
                  <div className="swash-onboarding-import-option-row">
                    <CustomRadioBox id="3Box" handleClick={this.radioChangeHandler} isChecked={this.state.onboardingType === '3Box'} />
                  </div>
                </div>
              </div>
            </div>
            <div className="swash-onboarding-box-footer">
              <div className="swash-onboarding-box-footer-left"></div>
              <div className="swash-onboarding-box-footer-right">
                <div className="swash-onboarding-proceed-button" onClick={this.LoadOnBoardingNew}>
                  Import
                </div>
                <div style={{float: 'right', cursor: 'pointer'}}>
                  <span onClick={this.goToPreviousPage}>Back</span>
                </div>
              </div>
            </div>
          </div>
          {this.state.showPopup ? (
            <div>
              <div
                className="swash-modal"
                onClick={(e) => {
                  if (e.target === e.currentTarget) this.togglePopup();
                }}>
                {modal}
              </div>
            </div>
          ) : (
            ''
          )}
        </React.Fragment>
        <CustomSnackbar ref={this.notifyRef} />
      </div>
    );
  }
}

export default OnBoardingNewPage;
