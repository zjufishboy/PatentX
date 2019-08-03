import React from 'react';
//tools
import { Modal} from 'antd';
//css file
import './Pm.css';
//component
class Pm extends React.Component{
    constructor(){
        super()
        this.state={
            modalVisible:false
        }
    }
    handleClick=()=>{
        this.setState({modalVisible:true})
    }
    handleCancel=()=>{
        this.setState({modalVisible:false})
    }
    render(){
        return (
            <div className="PictureModal">
             <Modal
                title=""
                visible={this.state.modalVisible}
                onOk={()=>{}}
                onCancel={this.handleCancel}
                okText=""
                cancelText=""
                footer={null}
                closable={false}
            >
                 <img src={this.props.src} style={{width:"100%"}}/>
            </Modal>
            <img src={this.props.src} style={{width:"100%",height:"100%",objectFit:"cover"}} onClick={this.handleClick}/>
          </div>
        )
    }
}

export default Pm;