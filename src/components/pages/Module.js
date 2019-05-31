import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Prompt} from 'react-router-dom'
import ReactCountdownClock from 'react-countdown-clock';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "../../statics/css/react-contextmenu.css"
import {
    MDBCol,
    MDBSwitch,
    MDBRow,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBBtn,
    MDBTooltip,
    MDBCardTitle,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBModal,
    MDBTableBody,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
	MDBPopover, 
	MDBPopoverBody, 
	MDBPopoverHeader,
	MDBIcon,
	MDBNavbar,
	MDBNavbarBrand,
	MDBNavbarNav,
	MDBNavItem,
	MDBNavLink,
	MDBCollapse 
} from "mdbreact";
import NavBar from '../microcomponents/NavBar'

class Module extends React.Component {
	nextLocation = "";
	discardUnsavedChanges = false;
    mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
    salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
	sampleId = "c1edf5cf-25ad-44bf-884a-f0b8416da28d";
    currentDate = new Date();
    privacyData = [{value:"SurfStreamr"}];
	sampleModuleIds = [
		{name:'Amazon', id: "c7f3abdc-8c97-4dcf-8abf-5fb0aee23814", newId:{id: "", expireTime: ""}},
		{name:'Facebook', id: "5ef37a90-cdcf-4e69-8785-e61656522980", newId:{id: "", expireTime: ""}},
		{name:'Search', id: "289b244a-8612-4ef7-8194-7299d2b37afe", newId:{id: "", expireTime: ""}},
		{name:'Surfing', id: "079304c0-d81e-409f-8480-15eff0343b8c", newId:{id: "", expireTime: ""}},
		{name:'Twitter', id: "47361fe5-9563-46f8-81d4-da7dc914c2ea", newId:{id: "", expireTime: ""}},
		{name:'Youtube', id: "eee3037a-d6a8-4ae0-8955-eca0d67460c5", newId:{id: "", expireTime: ""}}
	]
    sampleMessage = {
        header: {
             privacyLevel: 0
        },
        data: {
            out: {
                url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                time: this.currentDate.getTime(),
                timeString: this.currentDate.toString(),
                text: "This is a simple text that contains <b>SurfStreamr</b> as a personal data",
                id: "324242342",
                userInfo: "John Doe",
                userAttr: "male"
            },
            schems: [
                    {jpath:"$.url", type: "url"},
                    {jpath:"$.time", type: "time"},
                    {jpath:"$.timeString", type: "timeString"},
                    {jpath:"$.text", type: "text"},
                    {jpath:"$.id", type: "id"},
                    {jpath:"$.userInfo", type: "userInfo"},
                    {jpath:"$.userAttr", type: "userAttr"},
                ]
        }
    }
    state = {
		collapseID: "dataPrivacyCollapse",
		modal0: false,
        modal1: false,
        modal2: false,
		modal3: false,
        activeNav: 0,
        resource: false,
        connected: false,
		filter_editable: false,
		browsing_filter: [],
        x: false,
        activeNav2: 0,
        pMessage: {
            data: {
                url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                time: this.currentDate.getTime(),
                timeString: this.currentDate.toString(),
                text: "This is a simple text that contains <b>SurfStreamr</b> as a personal data",
                id: "324242342",
                userInfo: "John Doe",
                userAttr: "male"
            }
        },
        
    };
    componentWillUnmount(){
        try {
            clearInterval(this.state.intervalId);
        }
        catch(e){
			
		}
    }
    componentDidMount() {
        if (this.props.resource[0]) {
            let href = window.location.href.substring(window.location.href.indexOf('/apis/') + 6);
            let module;
			let views = {};
            for (let u in this.props.resource) {
                if (href === this.props.resource[u].name) {
                    module = this.props.resource[u];
                    break;
                }
            }
            if (module) {
                document.getElementById('enabled-switch').checked = module.is_enabled;            
				for(let view of module.viewGroups) {
					views[view.name] = {
						name: view.name,
						title: view.title,
						items: []
						}
				}
				let functions = module.functions;
				for(let func of functions) {
					if(module[func]) {
						let index = 0
						for (let item of module[func]) {
							views[item.viewGroup].items.push({
								name: item.name,
								title: item.title,
								description: item.description,
								is_enabled: item.is_enabled,
								func: func,
								index: index
							})
							index++;
						}
					}
				}
			}
            
			if (!module.style) {
				this.generateCss('red')
			} else {
				this.generateCss('#' + module.style.mainColor)
			}
			
			if (module.apiCall) {			  
				let f  = setInterval(()=>{window.helper.isConnected(module.name).then(connected => {
					this.setState({connected:connected})
				});},1000);
				this.setState({intervalId: f});
			}                

			this.setState({
				module: module,
				is_enabled: module.is_enabled,
				page: href,
				url:module.URL[0],
				description:module.description,
				activeNav: module.privacy_level,
                activeNav2: 0,
				filter_editable: module.filter_editable,				
                pMessage: {
                    data: {
                        url:"https://www.test.com/path1/path1-1/sample?var1=val1&var2=val2",
                        time: this.currentDate.getTime(),
                        timeString: this.currentDate.toString(),
                        text: "This is a simple text that contains <b>SurfStreamr</b> as a personal data",
                        id: "324242342",
                        userInfo: "John Doe",
                        userAttr: "male"
                    }
                },
				connected: module.access_token?true:false,
				views: views,
				title: module.title,
				name: module.name,
				icon: module.icons[0],				
			})			

		} else {
			this.setState({x: !this.state.x})
		}
    };

    componentDidUpdate() {		
    }

	getLastSettings(settings) {
		settings.privacy_level = this.state.module.privacy_level;
		settings.is_enabled = this.state.module.is_enabled;
		if(this.state.module.filter_editable) {
			settings.browsing_filter = {};
			settings.browsing_filter.urls = this.state.module.browsing_filter.urls;
		}
		for(let func of this.state.module.functions) {
			settings[func] = {};
		}
		let views = this.state.views
		for (let viewName in views) {
			{
				for (let itemId in views[viewName].items) {
					let f = this.state.module[views[viewName].items[itemId].func][views[viewName].items[itemId].index].is_enabled;
					settings[views[viewName].items[itemId].func][views[viewName].items[itemId].name] = f;
				}
			}				
		}
	}
	
	getSettings(settings) {
		settings.privacy_level = this.state.activeNav;
		settings.is_enabled = document.getElementById('enabled-switch').checked;
		if(this.state.filter_editable) {
			let urlsString = document.getElementById("matchingUrls").value;
			let urls = urlsString.split("\n").map((ob,id) => ob.trim(" \r"));
			settings.browsing_filter = {};
			settings.browsing_filter.urls = urls;
		}
		for(let func of this.state.module.functions) {
			settings[func] = {}
		}			
		let views = this.state.views
		for (let viewName in views) {
			{
				for (let itemId in views[viewName].items) {
					let f = document.getElementById(viewName + "-" + itemId).checked;
					settings[views[viewName].items[itemId].func][views[viewName].items[itemId].name] = f;
				}
			}				
		}
	}
	
	isEqual(obj1, obj2) {
		let str1 = JSON.stringify(obj1);
		let str2 = JSON.stringify(obj2);
		if(str1 != str2)
			return false;
		return true;
	};

	
	handleUnsavedChanges = (nextLocation) => {
		this.nextLocation = nextLocation;
		let currentSettings = {}
		this.getSettings(currentSettings)
		let lastSettings = {}
		this.getLastSettings(lastSettings)
		if(this.discardUnsavedChanges) {
			return true;
		}
		if(!this.isEqual(currentSettings, lastSettings)) {
			this.toggle('0');
			return false;
		}
		return true;
	}
	
	
    generateCss(style) {
        if (!style) {
            style = 'red'
        }
        let i = `
        #general-api-wrapper .btn-secondary{
        background: ` + style + `!important;
        }
        #general-api-wrapper .nav-h.ok{
                 box-shadow:0 0 7px 2px ` + style + `!important;
 background: ` + style + `!important;
 }
        #general-api-wrapper .nav-bar-line.active{
                border-bottom: 3px solid ` + style + `;
        }
        #general-api-wrapper .nav-selected{
            border: 5px solid ` + style + `;
        }
        #general-api-wrapper input[type="checkbox"].switch:checked + div{
                background-color: ` + style + `!important;
        }
        .btn-indigo {
    background-color:` + style + ` !important;
    color: #fff !important;
}
#general-api-wrapper .form-check-input[type=checkbox].filled-in:checked+label:after, label.btn input[type=checkbox].filled-in:checked+label:after {
  top: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  background-color: ` + style + `;
  z-index: 0;
}
.save-bt-fix .fa-save, .save-bt-fix .fa-save:hover{
    background-color: ` + style + `;
}
.save-bt-fix .fa-caret-left, .save-bt-fix .fa-caret-left:hover{
    color: ` + style + `;
}

.text-highlight {
	color: #585252;
}
        `
        document.getElementById('theme').innerHTML = i
    };
		
    toggle = (x) => {
		if (x === '0')
            this.setState({
                modal0: !this.state.modal0
            });
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
    };

	
    render() {
		
        const handleClick = (id) => {
            this.setState({activeNav: id})
        };
        
        const handleClick2 = (id) => {
            this.sampleMessage.header.privacyLevel = id;
            identityPrivacyEnforcement(id).then(() => {
                window.helper.enforcePolicy(this.sampleMessage, this.mSalt, this.salt, this.privacyData).then((message)  => {
                    this.setState({pMessage: message, activeNav2: id});            
                })
            })
        };
        
        const identityPrivacyEnforcement = async (id) => {
            for(let module of this.sampleModuleIds) {
                module.newId = await window.helper.identityPrivacy(this.sampleId, module.id, id);
            }            
        }

        const changeCheckBox = (e) => {
			let viewName = e.target.id.split("-")[0];
			let id = e.target.id.split("-")[1];
			let views = this.state.views;
			views[viewName].items[id].is_enabled = e.target.checked;
			this.setState({views: views});
        };
        const switchChange = ()=>{
            this.setState({is_enabled:!this.state.is_enabled})
        };
        const saveAll = ()=>{
            this.setState({
                modal1: !this.state.modal1
            })        
		};
		
        const saveAllConfirm = (tId)=>{
			var settings = {};
			this.getSettings(settings)
			let moduleName = this.state.name;
			return window.helper.config_module(moduleName, settings).then(()=>{
				this.props.reload();
				return window.helper.loadModules().then((modules) => {
					this.toggle(tId);
					this.setState({						
						module: modules[moduleName]
					})				
				})
			});					
        };
		const connect = ()=>{
			window.helper.startAuth(this.state.name).then(x => {
				let moduleName = this.state.name;                                               
                this.setState({connected:'connecting'})				
			});
		}
		const disconnect = ()=>{
			window.helper.removeAuth(this.state.name).then(x => {
				let moduleName = this.state.name;
				window.helper.isConnected(moduleName).then(connected => {
					this.state.connected = connected;
				});
			});
		}
		
		
		const handleContextMenuClick = (e, data) => {			
			let views = this.state.views;
			if(data.all) {
				for (let viewName in views) {
					{
						for (let itemId in views[viewName].items) {
							views[viewName].items[itemId].is_enabled = data.check;							
						}
					}				
				}
				this.setState({views: views});				
			}
			else {
				let viewName = data.attributes.name;
				for (let itemId in views[viewName].items) {
					views[viewName].items[itemId].is_enabled = data.check;					
				}
				this.setState({views: views});				
			}
       }
		
        return (
            <div id="general-api-wrapper">
				<Prompt
					when={true}
					message={this.handleUnsavedChanges}/>
                <div className={'save-bt-fix'}>											
					<i onClick={saveAll} className={'fa fa-save'}/>
				</div>
                <div id='xx' className='col-md-12'>
                    <MDBCard className="d-flex mb-2">
                        <MDBCardBody>
                            <div className={'container-fluid'}>
                                <div className="row">
                                    <div className="col-md-2 back-bt"
                                         onClick={() =>  this.props.history.push('/modules')}>
                                        <i className='fa fa-arrow-left'/>
                                    </div>
                                    <div className="col-md-7 back-bt module-title" id={'api-name'}>
                                        {this.state.name}
                                    </div>
                                    <div className="col-md-3 back-bt">
                                        <div className='row'>

                                            <div className="col-md-6">Status :</div>
                                            <div className="col-md-6">
                                                <input onChange={switchChange} id='enabled-switch' className='switch' type='checkbox'/>
                                                <div className='switch-wrap'>
                                                    <p className="enabled"></p>
                                                    <p className="disabled"></p>
                                                    <div className='enable-circle'></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </div>				
                <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.modal0} toggle={() => this.toggle('0')}>
                        <MDBModalHeader toggle={() => this.toggle('0')}>Unsaved changes</MDBModalHeader>
                        <MDBModalBody>
                            <p>You have unsaved changes made to this module which will be lost if you navigate away. Are you sure you wish to discard these changes?</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn size="md" color="secondary" onClick={() => {
								this.discardUnsavedChanges = true
								this.props.history.push(this.nextLocation.pathname)
							}}>Discard
							</MDBBtn>
                            <MDBBtn size="md" onClick={() => saveAllConfirm('0').then(() => {
									this.props.history.push(this.nextLocation.pathname)
							})}color="secondary">Save</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
				
				 <MDBContainer>
                    <MDBModal size="md" isOpen={this.state.modal1} toggle={() => this.toggle('1')}>
                        <MDBModalHeader toggle={() => this.toggle('1')}>Save Configurations</MDBModalHeader>
                        <MDBModalBody>
                            <p>By clicking on "Confirm" Your changes will take effect immediately.</p>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn size="md" color="secondary" onClick={() => this.toggle('1')}>Close</MDBBtn>
                            <MDBBtn size="md" onClick={() => saveAllConfirm('1')} color="secondary">Confirm Changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModal>
                </MDBContainer>
				
				<MDBContainer>
                    <MDBModal size="fluid" isOpen={this.state.modal2} toggle={() => this.toggle('2')}>
                        <MDBModalHeader toggle={() => this.toggle('2')}>Privacy Enforcement Guide</MDBModalHeader>
                        <MDBModalBody>											
							<p>
								Before each message is sent to Streamr Marketplace, a privacy enforcement mechanism will transform data. The mechanism works based on data type and privacy level. To show you how the privacy mechanism transforms each data type, we have provided some sample data types. Just move the navigation bar to see what happens to each data type.
							</p>
							<div className={'n-v-w mb-3'}>
								<NavBar handleClick={handleClick2} navs={['Lowest', 'Low', 'Medium', 'High', 'Highest']}
								activeNav={this.state.activeNav2}/>
							</div>
							
							
							<MDBNavbar color="white" expand="md" className="mb-3">
								<MDBNavbarBrand>
									<strong className="black-text">Privacy Model</strong>
								</MDBNavbarBrand>
								  <MDBNavbarNav left>
									<MDBNavItem id="dataPrivacyNav" active>
									  <MDBNavLink to="#!" onClick={() => {
                                          document.querySelector("#identityPrivacyNav").classList.remove("active");
                                          document.querySelector("#dataPrivacyNav").classList.add("active");
                                          this.setState({collapseID: "dataPrivacyCollapse"})
                                          }}>Data Privacy</MDBNavLink>
									</MDBNavItem>
									<MDBNavItem id="identityPrivacyNav">
									  <MDBNavLink to="#!" onClick={() => {
                                          document.querySelector("#identityPrivacyNav").classList.add("active");
                                          document.querySelector("#dataPrivacyNav").classList.remove("active");
                                          identityPrivacyEnforcement(this.state.activeNav2).then(() => 
                                          this.setState({collapseID: "identityPrivacyCollapse"}))                                          
                                          }}>Identity Privacy</MDBNavLink>
									</MDBNavItem>																
								  </MDBNavbarNav>								  
							  </MDBNavbar>

							<MDBCollapse id="dataPrivacyCollapse" isOpen={this.state.collapseID}>
								<MDBTable>
								
									<MDBTableHead>
										<tr>
										<th>Data Type</th>
										<th>Data Before Privacy Enforcement</th>
										<th>Data After Privacy Enforcement</th>
										</tr>
									</MDBTableHead>
									<MDBTableBody>
										<tr>
											<td class="text-highlight">URL</td>
											<td>{this.sampleMessage.data.out.url}</td>
											<td>{this.state.pMessage.data.url}</td>
										</tr>
										<tr>
											<td class="text-highlight">Time</td>
											<td>{this.sampleMessage.data.out.time}</td>
											<td>{this.state.pMessage.data.time}</td>
										</tr>
										<tr>
											<td class="text-highlight">TimeString</td>
											<td>{this.sampleMessage.data.out.timeString}</td>
											<td>{this.state.pMessage.data.timeString}</td>
										</tr>
										<tr>
											<td class="text-highlight">Text</td>
											<td dangerouslySetInnerHTML={{__html: this.sampleMessage.data.out.text}}></td>
											<td dangerouslySetInnerHTML={{__html: this.state.pMessage.data.text}}></td>
										</tr>
										<tr>
											<td class="text-highlight">Id</td>
											<td>{this.sampleMessage.data.out.id}</td>
											<td>{this.state.pMessage.data.id}</td>
										</tr>
										<tr>
											<td class="text-highlight">UserInfo</td>
											<td>{this.sampleMessage.data.out.userInfo}</td>
											<td>{this.state.pMessage.data.userInfo}</td>
										</tr>
										<tr>
											<td class="text-highlight">UserAttr</td>
											<td>{this.sampleMessage.data.out.userAttr}</td>
											<td>{this.state.pMessage.data.userAttr}</td>
										</tr>
									</MDBTableBody>
								</MDBTable>
							</MDBCollapse>
							
							<MDBCollapse id="identityPrivacyCollapse" isOpen={this.state.collapseID}>
								<MDBRow>
									<MDBCol className="col-md-6">
										<MDBTable>								
											<MDBTableHead>
												<tr>
												<th>Modules</th>
												<th>Your Identity</th>
												</tr>
											</MDBTableHead>
											<MDBTableBody>
												{this.sampleModuleIds.map((obj, id) =>
													<tr>                                                                                        
														<td class="text-highlight">{obj.name}</td>
														<td>{obj.newId.id}</td>														
													</tr>											
												)}
											</MDBTableBody>
										</MDBTable>
									</MDBCol>									
									{(function(that) {															
														let duration = 0;
														let txt1 = ""
														let txt2 = ""
														switch(that.state.activeNav2) {
															case 0:	
																txt1 = "It is fixed for all data collected by a module"
																txt2 = "It is fixed for all modules"
																break;
															case 1:
																txt1 = "It is fixed for all data collected by a module"
																txt2 = "It is unique per modules"
																break;
															case 2: 
																txt1 = "It is fixed for all data collected by a module in a day"
																txt2 = "There is no correlation between your identities in different modules"
																duration = (that.sampleModuleIds[0].newId.expireTime - (new Date()).getTime())/1000
																break;
															case 3:
																txt1 = "It is fixed for all data collected by a module in an hour"
																txt2 = "There is no correlation between your identities in different modules"
																duration = (that.sampleModuleIds[0].newId.expireTime - (new Date()).getTime())/1000
																break;
															case 4:
																txt1 = "It will be refreshed for every data collection action"
																txt2 = "There is no correlation between your identities in different modules"
																duration = 1;
																break;
															default:
																																																		
														}
														return 	<>
															<MDBCol className="col-md-2 mt-3 ml-2">
																<ReactCountdownClock seconds={duration}
																			 key={Math.random()}
																			 color="#585252"
																			 alpha={0.9}
																			 size={200}
																			 paused={duration==0?true:false}
																			 pausedText="Never Refresh"
																			 fontSize="25px"
																			onComplete={()=>handleClick2(that.state.activeNav2)} />
															</MDBCol>
															<MDBCol className="col-md-3 mt-3 ml-2">																				
																<ul class="fa-ul">
																  <li><i class="fa-li fa fa-check-square"></i>Your identity is a unique random string</li>
																  <li><i class="fa-li fa fa-check-square"></i>{txt1}</li>
																  <li><i class="fa-li fa fa-check-square"></i>{txt2}</li>																					  
																</ul>
															</MDBCol>
														</>
										})(this)
									}									
								</MDBRow>
							</MDBCollapse>
							
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
				
				<MDBContainer>
                    <MDBModal size="lg" isOpen={this.state.modal3} toggle={() => this.toggle('3')}>
                        <MDBModalHeader toggle={() => this.toggle('3')}>Matching URLs Guide</MDBModalHeader>
                        <MDBModalBody>											
							<p>
								All match patterns are specified as strings. Apart from the special &lt;all_urls&gt; pattern, match patterns consist of three parts: <i>scheme</i>, <i>host</i>, and <i>path</i>. The scheme and host are separated by ://.
									<br/>
									[scheme]://[host][path]
							</p>														
							<h5>Examples</h5>
							<MDBTable>
								<MDBTableHead>
									<tr>
									<th>Pattern</th>
									<th>Description</th>
									<th>Example Matches</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td class="text-highlight">
											&lt;all_urls&gt;
										</td>
										<td>
											Match all URLs.
										</td>
										<td>
											http://example.org/
											<br/>
											https://a.org/some/path/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*/*
										</td>
										<td>
											Match all HTTP, HTTPS URLs.
										</td>
										<td>
											http://example.org/
											<br/>
											https://a.org/some/path/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*.streamr.com/*
										</td>
										<td>
											Match all HTTP, HTTPS URLs that are hosted at "streamr.com" or one of its subdomains.
										</td>
										<td>
											http://streamr.com
											<br/>
											https://marketplace.streamr.com
											<br/>
											https://streamr.com/help/api
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://streamr.com/
										</td>
										<td>
											Match all HTTP, HTTPS and WebSocket URLs that are hosted at exactly "streamr.com/".											
										</td>
										<td>
											http://streamr.com/
											https://streamr.com/
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://*/path
										</td>
										<td>
											Match HTTPS URLs on any host, whose path is "path".
										</td>
										<td>
											https://streamr.com/path
											<br/>
											https://marketplace.streamr.com/path
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com/*
										</td>
										<td>
											Match HTTPS URLs only at "streamr.com", with any URL path and URL query string.
										</td>
										<td>
											https://streamr.com/
											<br/>
											https://streamr.com/path
											<br/>
											https://streamr.com/path/to/doc?foo=1
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com/*/b/*/
										</td>
										<td>
											Match HTTPS URLs hosted on "streamr.com", whose path contains a component "b" somewhere in the middle. Will match URLs with query strings, if the string ends in a /.
										</td>
										<td>
											https://streamr.com/a/b/c/
											<br/>
											https://streamr.com/d/b/f/
											<br/>
											https://streamr.com/a/b/c/d/
										</td>
									</tr>
								</MDBTableBody>
                            </MDBTable>
							
							<h5>Invalid match patterns</h5>
							<MDBTable>
								<MDBTableHead>
									<tr>
									<th>Invalid pattern</th>
									<th>Reason</th>
									</tr>
								</MDBTableHead>
								<MDBTableBody>
									<tr>
										<td class="text-highlight">
											https://streamr.com
										</td>
										<td>
											No path.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.*.com/
										</td>
										<td>
											"*" in host must be at the start.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://*reamer.com/
										</td>
										<td>
											"*" in host must be the only character or be followed by ".".
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											http*://streamr.com/
										</td>
										<td>
											 	"*" in scheme must be the only character.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											https://streamr.com:80/
										</td>
										<td>
											Host must not include a port number.
										</td>
									</tr>
									<tr>
										<td class="text-highlight">
											*://*
										</td>
										<td>
											Empty path: this should be "*://*/*".
										</td>
									</tr>									
								</MDBTableBody>
                            </MDBTable>

                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
				
                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">
                        <img className='general-api-logo' src={this.state.icon}/>

                        <MDBCard className="d-flex mb-2" style={{    minHeight: '220px'}}>
                            <MDBCol md="6" lg="6">

                                <MDBCardBody>
									{this.state.filter_editable?<>									
										<MDBCardTitle>Matching URls
											<MDBBtn size="sm" onClick={() => this.toggle('3')} className="btn-primary-outline bg-transparent" color="white ">
												<i class="far fa-question-circle fa-2x"></i>
											</MDBBtn>
										</MDBCardTitle>
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text" id="basic-addon">
													<i className="fas fa-pencil-alt prefix"></i>
												</span>
											</div>
											<textarea className="form-control" id="matchingUrls" defaultValue={this.state.module.browsing_filter.urls.join("\n")} rows="5"></textarea>
										</div>
										</>
									:''}

                                    <p className="input-p">
                                        {this.state.description}
                                    </p>
                                    <h4 className="input-p">
                                        {this.state.url}
                                    </h4>
                                </MDBCardBody>
                            </MDBCol>
                        </MDBCard>

                    </MDBCol>

                </MDBRow>

                <MDBRow className="justify-content-left">
                    <MDBCol md="12" lg="12">

                        <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')} >										
                                <MDBCardBody>
                                    <MDBCardTitle>Privacy Level
											<MDBBtn size="sm" onClick={() => this.toggle('2')} className="btn-primary-outline bg-transparent" color="white ">
												<i class="far fa-question-circle fa-2x"></i>
											</MDBBtn>										
									</MDBCardTitle>

                                    {/*<h2 style={{fontWeight: '600', padding: ' 5px 0 30px 0'}}>{this.state.title}</h2>*/}
                                    <div className={'n-v-w'}>
                                        <NavBar handleClick={handleClick} navs={['Lowest', 'Low', 'Medium', 'High', 'Highest']}
                                                activeNav={this.state.activeNav}/>
                                    </div>
                                </MDBCardBody>                           

                        </MDBCard>

                    </MDBCol>

                </MDBRow>
				

                {this.state.views? Object.keys(this.state.views).map((key,index) =>
					<ContextMenuTrigger id="checkAllContextMenu" collect={(x) => {return(x)}} attributes={{name:key}}>
                    <MDBRow className="justify-content-left">
                        <MDBCol md="12" lg="12">
                            <MDBCard className={"d-flex mb-2 "+(this.state.is_enabled?'':'disabled-card')}>
                                <MDBCardBody>
                                    <MDBCardTitle>{this.state.views[key].title}</MDBCardTitle>
                                    {key=="API" && this.state.connected === false ?
                                        <MDBBtn onClick={connect} color="indigo">                        <img className='general-api-logo-2' src={this.state.icon}/>
 Connect to
                                            {' ' + this.state.module.name}</MDBBtn> : ''
                                    } {key=="API" && this.state.connected === true ?
                                    <MDBBtn onClick={disconnect} color="indigo">                        <img className='general-api-logo-2' src={this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                {key=="API" && this.state.connected === 'connecting' ?
                                    <MDBBtn onClick={disconnect} color="red">                        <img className='general-api-logo-2' src={this.state.icon}/>
Connected</MDBBtn> : ''
                                }
                                </MDBCardBody>
                                <React.Fragment>
                                    <MDBRow className="justify-content-left">
                                        <MDBCol md="12" lg="12">
                                            <MDBCardBody >
                                                <div className={'row'}>

                                                    {this.state.views[key].items.map((ob, id) =>
                                                        <div className="col-md-2 col-lg-4">
															<div style={{ display: "flex" }}>
															<MDBTooltip	placement="top" domElement>
																<div>
																	<MDBInput label={ob.title} onChange={changeCheckBox} filled
																			  checked={ob.is_enabled} type="checkbox"
																			  id={this.state.views[key].name + "-" + id}></MDBInput>
																</div>
																<div>
																	{ob.description}
																</div>
															</MDBTooltip>
															</div>

                                                        </div>)}
                                                </div>

                                            </MDBCardBody>
                                        </MDBCol>

                                    </MDBRow>                                    
                                </React.Fragment>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
					</ContextMenuTrigger>):''}							
				<ContextMenu id="checkAllContextMenu">
					<MenuItem data={{check: true, all: true}} onClick={handleContextMenuClick}>
					  Check all
					</MenuItem>
					<MenuItem data={{check: false, all: true}} onClick={handleContextMenuClick}>
					  Uncheck all
					</MenuItem>
					<MenuItem divider />
					<MenuItem data={{check: true, all: false}} onClick={handleContextMenuClick}>
					  Check this group
					</MenuItem>
					<MenuItem data={{check: false, all: false}} onClick={handleContextMenuClick}>
					  Uncheck this group
					</MenuItem>
				</ContextMenu>
            </div>
        )
    }
}
export default withRouter(Module);
