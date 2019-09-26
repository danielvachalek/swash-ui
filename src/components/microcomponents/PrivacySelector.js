import React from 'react';

class PrivacySelector extends React.Component {

    render() {
        const navs=['Low', 'Medium', 'High'];
        const handleClick = (id)=>{
            if(this.props.handleClick){
                this.props.handleClick(id)
            }
        };



        return (
            <div className={'privacy-selector-wrapper'}>
                {navs.map((ob, id) => <>
        {id !== navs.length-1 ? <div className={'privacy-nav-bar-line '+(this.props.activeNav>id?'active':'')}
                            style={{top: 0, left: (id * 100 / (navs.length-1))+"%", width: (100 / (navs.length-1)) + "%" }}
        />: ''}
        

        <div onClick={()=>handleClick(id)} 
            className={'privacy-nav-h '+(this.props.activeNav > id? 'ok':'') + (this.props.activeNav===id?' privacy-nav-selected':'')}
            style={{top: 0, left: (id * 100 / (navs.length-1))+"%" }}

            ></div>
        
        <div className={`privacy-label ${this.props.activeNav === id ? 'privacy-label-selected':''}`}
            style={{position: "absolute", top: 32, left: (id * 100 / (navs.length-1) - 2) +"%" }}

        >{ob}</div>
                    </>)
                }
            </div>)
    }
}

export default PrivacySelector;