import React from 'react';
import { MDBListGroup, MDBListGroupItem} from 'mdbreact';
import { NavLink } from 'react-router-dom';

class SideNavigation extends React.Component {
    


    render(){
    return <div className="sidebar-fixed position-fixed">
            
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to="/Settings" activeClassName="activeClass">
                <MDBListGroupItem className="side-bar-text">
                        Settings
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/Data" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Data
                    </MDBListGroupItem>
                </NavLink>
                
                <NavLink to="/Advanced" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Advanced
                    </MDBListGroupItem>
                </NavLink>
                
                <NavLink to="/Help" activeClassName="activeClass">
                    <MDBListGroupItem className="side-bar-text">
                        Help
                    </MDBListGroupItem>
                </NavLink>
                
            </MDBListGroup>
        </div>

}}

export default SideNavigation;