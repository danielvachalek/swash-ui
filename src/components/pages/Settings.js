import React from 'react';
import CustomSnackbar from '../microcomponents/CustomSnackbar';
import RDropdownMenu from '../microcomponents/RDropdownMenu.js';

import {MDBTable, MDBTableBody, MDBTableHead} from 'mdbreact';
import CustomSelect from '../microcomponents/CustomSelect';
import LocalFileImg from '../../statics/images/file.svg';
import GoogleDriveImg from '../../statics/images/google-drive.svg';
import DropboxImg from '../../statics/images/dropbox.svg';
import ThreeBoxImg from '../../statics/images/3box.svg';
import PassphraseModal from '../microcomponents/PassphraseModal.js';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      privacyLevel: 0,
      filters: [],
      masks: [],
      showPopup: false,
    };

    this.onboardingOAuth = this.onboardingOAuth.bind(this);
    this.onboardingUpload = this.onboardingUpload.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    this.loadSettings();
    this.loadReferal();
    window.scrollTo(0, 0);
  }

  componentDidUnmount() {}

  loadSettings() {
    window.helper.load().then((db) => {
      let modules = [];

      for (let module in db.modules) {
        modules.push(db.modules[module]);
      }

      let filters = db.filters;
      let newFilters = [];
      for (let x in filters) {
        newFilters.push({
          value: filters[x].value,
          type: filters[x].type,
          internal: filters[x].internal,
        });
      }

      let masks = db.privacyData;
      let newMasks = [];
      for (let x in masks) {
        newMasks.push({
          value: masks[x].value,
        });
      }
      let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
      this.setState({
        filters: newFilters,
        masks: newMasks,
        privacyLevel: db.configs.privacyLevel,
        modules: modules,
        referralLink: referralLink
      });
    });
  }

  async loadReferal() {
    let db = await window.helper.load();
    if(!db.profile.user_id) {
      setTimeout(() => this.loadReferal(), 5000);
      return;
    }    
    let referralLink = db.profile.user_id ? `https://swashapp.io/referral/${db.profile.user_id}` : '';
    this.setState({referralLink});
  }

  addMask() {
    let mvElement = document.getElementById('maskValue');
    let f = {
      value: mvElement.value,
    };
    mvElement.value = '';
    if (!f.value || f.value === 'undefined') {
      this.refs.notify.handleNotification('Null is not allowed', 'error');
      return;
    }

    let allow = true;
    window.helper.loadPrivacyData().then((pData) => {
      for (let i in pData) {
        if (pData[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        pData.push(f);
        window.helper.savePrivacyData(pData);
        let i = this.state.masks;
        i.push(f);
        this.setState({masks: i});
      } else {
        this.refs.notify.handleNotification('Duplicate entry', 'error');
      }
    });
  }

  deleteMaskRecord(id) {
    let newArray = [];
    let storageArray = [];
    for (let i in this.state.masks) {
      if (this.state.masks[i].value !== id) {
        newArray.push(this.state.masks[i]);
        storageArray.push({value: this.state.masks[i].value});
      }
    }
    window.helper.savePrivacyData(storageArray);
    this.setState({masks: newArray});
  }

  addFilter() {
    let f = {
      value: document.getElementById('filterValue').value,
      type: this.refs.matchingTypeSelect.getSelectedItem().value,
      internal: false,
    };
    if (!f.value || f.value === 'undefined') {
      this.refs.notify.handleNotification('Null is not allowed', 'error');
      return;
    }

    let allow = true;
    window.helper.loadFilters().then((filter) => {
      for (let i in filter) {
        if (filter[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        filter.push(f);
        window.helper.saveFilters(filter);
        let i = this.state.filters;
        i.push(f);
        this.setState({filters: i});
        this.refs.notify.handleNotification('Added successfully', 'success');
      } else {
        this.refs.notify.handleNotification('Duplicate entry', 'error');
      }
    });
  }

  deleteFilterRecord(id) {
    let newArray = [];
    let storageArray = [];
    for (let i in this.state.filters) {
      if (this.state.filters[i].value !== id) {
        newArray.push(this.state.filters[i]);
        storageArray.push({type: this.state.filters[i].type, value: this.state.filters[i].value, internal: this.state.filters[i].internal});
      } else {
        if (this.state.filters[i].internal) {
          this.refs.notify.handleNotification('Internal filters can not be removed', 'error');
          return;
        }
      }
    }
    window.helper.saveFilters(storageArray);
    this.setState({filters: newArray});
  }

  onboardingOAuth(onboarding) {
    if (!window.browser.runtime.onMessage.hasListener(this.onboardingUpload)) window.browser.runtime.onMessage.addListener(this.onboardingUpload);

    window.browser.tabs.getCurrent().then((tab) => {
      window.helper.startOnBoarding(onboarding, tab.id).then(() => {});
    });
  }

  onboardingUpload(request, sender, sendResponse) {
    if (request.onboarding) {
      window.helper.uploadFile(request.onboarding).then((response) => {
        if (response === false) this.refs.notify.handleNotification('The configuration file could not be exported', 'error');
        else this.refs.notify.handleNotification('The configuration file is exported successfully', 'success');
      });
    }

    if (!window.browser.runtime.onMessage.hasListener(this.onboardingUpload)) window.browser.runtime.onMessage.removeListener(this.onboardingUpload);
  }

  togglePopup(isCompleted) {
    this.setState({
      showPopup: !this.state.showPopup,
    });

    if (isCompleted === false) this.refs.notify.handleNotification('The configuration file could not be exported', 'error');
    else if (isCompleted === true) this.refs.notify.handleNotification('The configuration file is exported successfully', 'success');
  }

  copyToClipboard(e, element) {
    element.select();
    document.execCommand('copy');
    element.blur();
    this.refs.notify.handleNotification('Copied successfully', 'success');
  }

  render() {
    let excludeTableDataRows = this.state.filters.map((row) => {
      return (
        <tr key={row.value} className="table-row">
          <td className="table-text disabled-url-td">
            <input type="text" value={row.value} disabled className="disabledUrl" />
          </td>
          <td className="table-text disabled-matching-type-td">
            <input type="text" value={row.type} disabled className="disabledMatchingType" />
          </td>
          <td className="table-text delete-matching-type-td">
            <button className="linkbutton" onClick={() => this.deleteFilterRecord(row.value)}>
              Delete
            </button>
          </td>
          <td className="table-text delete-matching-type-td-small">
            <RDropdownMenu
              className="button more-button2"
              items={[{text: 'Delete', callback: () => this.deleteFilterRecord(row.value)}]}
              ref="filterItem"
            />
          </td>
        </tr>
      );
    });

    let selectItems = [
      {description: 'Exact', value: 'exact'},
      {description: 'Wildcard', value: 'wildcard'},
      {description: 'Regex', value: 'regex'},
    ];
    let addXType = (
      <div>
        <div className="form-caption">Matching Type</div>

        <CustomSelect items={selectItems} ref="matchingTypeSelect" />
      </div>
    );
    let AddXButton = (
      <button className="linkbutton add-link-button" onClick={() => this.addFilter()}>
        Add
      </button>
    );

    let maskTableDataRows = this.state.masks.map((row) => {
      return (
        <tr key={row.value} className="table-row">
          <td className="table-text disabled-masked-text-td">
            <input type="text" value={row.value} disabled className="disabledMaskedText" />
          </td>
          <td className="table-text delete-masked-text-td">
            <button
              className="linkbutton"
              onClick={() => {
                this.deleteMaskRecord(row.value);
              }}>
              Delete
            </button>
          </td>
        </tr>
      );
    });
    let addMaskText = (
      <div>
        <div className="form-caption">Add a text mask</div>
        <div>
          <input
            type="text"
            id="maskValue"
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.addMask();
            }}
            placeholder="Peter"
            className="form-input mask-input"
          />
        </div>
      </div>
    );
    let AddMaskButton = (
      <button className="linkbutton" onClick={() => this.addMask()}>
        Add
      </button>
    );

    return (
      <div id="settings" className="swash-col">
        <React.Fragment>
          <div id="advanced-page">
            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">Invite a friend</div>
                <div className="swash-p">
                  Refer a friend to Swash and earn a 1 DATA bonus for any new installation of Swash that is made by your referral URL and 1 DATA when
                  the invited user balance reaches her first 10 DATA.
                </div>
                <div className="transfer-row">
                  <div className="transfer-column referral-column">
                    <div className="form-caption">Your referral link</div>
                    <div>
                      <input type="text" id="referral-link" value={this.state.referralLink} readOnly={true} className="form-input  filter-input" />
                    </div>
                  </div>
                  <div className="transfer-column button-column" style={{marginRight: '0px'}}>
                    <button
                      id="transfer-button"
                      className="transfer-link-button"
                      onBlur={(e) => {
                        e.target.innerText = 'Copy Link';
                      }}
                      onClick={(e) => {
                        this.copyToClipboard(e, document.getElementById('referral-link'));
                        e.target.focus();
                        e.target.innerText = 'Copied';
                      }}>
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="swash-col">
              <div className="setting-part">
                <div className="swash-head">Text masking</div>
                <div className="swash-p2">
                  You can mask specific sensitive text data before it is sent to Streamr Marketplace. Your sensitive data is transformed based on the
                  privacy level setting. Examples of text you might want to mask could be your name, email address and phone number.
                </div>

                <div>
                  <MDBTable>
                    <MDBTableHead>
                      <tr className="table-head-row">
                        <th className="table-text table-head-text add-mask-text-th">{addMaskText}</th>
                        <th className="table-text table-head-text add-mask-button-th">{AddMaskButton}</th>
                      </tr>
                    </MDBTableHead>

                    <MDBTableBody>{maskTableDataRows}</MDBTableBody>
                  </MDBTable>
                </div>
              </div>
            </div>
          </div>

          <div className="swash-col">
            <div className="setting-part">
              <div className="swash-head">Export the configuration</div>
              <div className="swash-p">
                You can maintain a consistent configuration across systems. After you configure settings in Swash on your browser, export those
                settings to a configuration file using one of these methods and then import the configuration into new installations.
              </div>

              <div style={{display: 'inline-block', width: '100%'}}>
                <div className="onbording-export-div">
                  <div className="onbording-export-option">
                    <button
                      className="onbording-export-button"
                      onClick={() => {
                        window.helper.saveConfig().then();
                      }}>
                      <figure>
                        <img src={LocalFileImg} alt={''} />
                      </figure>
                      <div className="onbording-export-button">Local file</div>
                    </button>
                  </div>

                  <div className="onbording-export-option">
                    <button
                      className="onbording-export-button"
                      onClick={() => {
                        this.onboardingOAuth('GoogleDrive');
                      }}>
                      <figure>
                        <img src={GoogleDriveImg} alt={''} />
                      </figure>
                      <div className="onbording-export-button">Google Drive</div>
                    </button>
                  </div>

                  <div className="onbording-export-option">
                    <button
                      className="onbording-export-button"
                      onClick={() => {
                        this.onboardingOAuth('DropBox');
                      }}>
                      <figure>
                        <img src={DropboxImg} alt={''} />
                      </figure>
                      <div className="onbording-export-button">Dropbox</div>
                    </button>
                  </div>

                  <div className="onbording-export-option">
                    <button className="onbording-export-button" onClick={this.togglePopup}>
                      <figure>
                        <img src={ThreeBoxImg} alt={''} />
                      </figure>
                      <div className="onbording-export-button">3Box</div>
                    </button>
                  </div>
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
                <PassphraseModal page={'export'} closePopup={this.togglePopup.bind(this)} />
              </div>
            </div>
          ) : (
            ''
          )}
        </React.Fragment>
        <CustomSnackbar ref="notify" />
      </div>
    );
  }
}

export default SettingsPage;
