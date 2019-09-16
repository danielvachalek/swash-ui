import React from 'react'
import 'react-widgets/dist/css/react-widgets.css';
import 'react-notifications/lib/notifications.css';
import NumberPicker from 'react-widgets/lib/NumberPicker'
import simpleNumberLocalizer from 'react-widgets-simple-number';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import remove from '../../assets/close-50.png'
import {
    MDBCard,
    MDBCol,
    MDBRow,
    MDBView,MDBModalBody,MDBModalHeader,
    MDBMask,MDBTable, MDBTableBody,
    MDBTableHead,MDBModalFooter,
    MDBCardImage,MDBModal,
    MDBCardBody,MDBContainer,
    MDBCardTitle,
    MDBCardText, MDBInput,
    MDBCardFooter,
    MDBBtn,
    MDBIcon
} from 'mdbreact';
import src1 from '../../assets/img-1.jpg';

simpleNumberLocalizer();

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {			
			email: "",
			walletId: "",
			delay: 0
		};
    }

    componentDidMount() {
        this.loadSettings()
    }
      
    loadSettings() {
		// window.helper.load().then(db => {
		// 	//document.getElementById('push').checked = db.configs.pushStatus;
		// 	document.getElementById('email').setAttribute('valuex','1') ;
		// 	document.getElementById('wallet').setAttribute('valuex','1') ;
		// 	let email = db.profile.email;
		// 	let walletId = db.profile.walletId;
		// 	let that = this;			
  //           this.setState({email:email, walletId:walletId, delay:db.configs.delay})
		// });
    }
	handleChange(delay) {
		this.setState({delay: delay});
	}
    
    render() {
        const settings = {};
        const saveSettings = () => {
            let pushStatus = false; //document.getElementById('push').checked;
            let delay = this.state.delay;
            let email = document.getElementById('email').value;
            let wallet = document.getElementById('wallet').value;
            let data = {
                email: email,
                walletId: wallet
            };
            window.helper.saveProfile(data).then(() => {
                window.helper.saveConfigs({pushStatus: pushStatus, delay: delay}).then(() => {
                    if (pushStatus)
                        window.helper.subscribe();
                    else
                        window.helper.unsubscribe();
                    NotificationManager.success('Configuration is updated successfully', 'Update Configuration');
                })
            })
        };
       
       
        const changeInput = (e) => {
            if (e.target.id === 'wallet') {
                this.setState({walletId: e.target.value})
            }
            if (e.target.id === 'email') {
                this.setState({email: e.target.value})
            }
        };
        const toggle = (x) => {
            if (x === '1')
                this.setState({
                    modal1: !this.state.modal1
                });
            if (x === '2')
                this.setState({
                    modal2: !this.state.modal2
                });
            if (x === '3')
                this.setState({
                    modal3: !this.state.modal3
                });
            if (x === 'addModal')
                this.setState({
                    addModal: !this.state.addModal
                });
        };
        let currentBalance1 = "48.92";
        let currentBalance2 = "36.67";
        let privacyTableData = [
            {
                type: "URL",
                data: "www.test.com",
                refreshed: "-"
            },{
                type: "Time",
data: "Thu 15 Aug 2019",
refreshed: "-"
            },{
                type: "Text",
data: "A sentence containing *****",
refreshed: "-"
            },{
                type: "Id",
data: "e0ede487Xc0a2",
refreshed: "Every Hour"
            },{
                type: "Name",
data: "Cx53eeApH63xV2LqP0x33",
refreshed: "-"
            },{
                type: "Gender",
data: "zp93jY7eXcQsW8mNh33tY",
            refreshed: "-"
            }
        ];
        let privacyTableDataRows =  privacyTableData.map( (row) => { return (<tr className="table-row">                                    
                                                <td className="table-text table-head-text">{row.type}</td>
                                                <td className="table-text">{row.data}</td>
                                                <td className="table-text">{row.refreshed}</td>
                                            </tr>)});
        // let privacyTableDataRows = privacyTableData.map((row) => {
        //                             (<tr>                                    
        //                                 <td>{row.type}</td>
        //                                 <td>{row.data}</td>
        //                                 <td>{row.refreshed}</td>
        //                             </tr>)
        //                         });

        return (
            <div id="settings-page" className="swash-col">
                <React.Fragment>
                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Earnings</div>
                            <div className="swash-p">Once your data is being purchased on the Streamr Marketplace, your earnings will appear here. 
                            New earnings are frozen for 48 hours as an anti-fraud measure. Balance available to withdraw is shown below. 
                            See the <a href="#/Help">docs</a> to learn more about private keys, balances and withdrawing. </div>
                            <div className="balance-block block-top-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{currentBalance1}</span> DATA balance</div> 
                            </div>
                            <div className="balance-block withdraw-block block-bottom-corner-radius">
                                <div className="balance-text"><span className="balance-text-bold">{currentBalance2}</span> DATA available</div> 
                            </div>
                            <div className="form-caption">Wallet address</div>
                            <div>
                                <input type="text" className="form-input"/>
                                <button className="form-input-button">Copy</button>
                            </div>
                            <div className="form-caption">Private key </div>
                            <div>
                                <input type="password" className="form-input"/>
                                <button className="form-input-button">...</button>
                            </div>
                        </div>
                    </div>


                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Choose data to capture</div>
                            <div className="swash-p">To stream your web browsing behaviour, Swash uses a modular approach. By default, only 
the Browse module is on. You can also optionally enable other modules in order to capture specific data from a variety of other popular sites. Click any module to adjust settings.</div>
                        </div>
                    </div>


                    <div className="swash-col">
                        <div className="setting-part">
                            <div className="swash-head">Set global privacy level</div>
                            <div className="swash-p">
This allows you to set privacy levels across all your modules. Adjust them to choose
the types of data you’d like to share and what to obscure or remove. You can also use the Advanced settings to block specific text (eg your name or address), sites and domains.</div>
                        </div>

                        <div>
                        <MDBTable>
                        
                            <MDBTableHead>
                                <tr className="table-head-row">                               
                                    <th className="table-text table-head-text">Type</th>
                                    <th className="table-text table-head-text">Data to be sent</th>
                                    <th className="table-text table-head-text">Refreshed</th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                {privacyTableDataRows}                                
                            </MDBTableBody>
                        </MDBTable>
                        </div>
                    </div>


                </React.Fragment>
                <NotificationContainer/>
            </div>
        );
    }
}

export default SettingsPage;