import React from 'react';
//tools
import { Select, Input, Button } from 'antd';
//css file
import './Qm.css';
const { Option } = Select;
const ButtonGroup = Button.Group;
//component
class Qm extends React.Component{
    constructor(props){
        super()
    }
    render(){
        return(
            <div className="pxIndexPageInfoQuick">
                <ButtonGroup className="pxIndexPageInfoQuickButtonBar">
                    <Button 
                        className="pxIndexPageInfoQuickButton"
                        type={this.props.tablePost.txType===0?"primary":"default"}
                        style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:0}}
                        onClick={()=>{this.props.handleChoice(0)}}>
                            购买专利
                    </Button>
                    <Button 
                        className="pxIndexPageInfoQuickButton"
                        type={this.props.tablePost.txType===1?"primary":"default"}
                        style={{borderTopRightRadius:'0px',borderBottomRightRadius:0}}
                        onClick={()=>{this.props.handleChoice(1)}}>
                            出售专利
                    </Button>
                </ButtonGroup>
                <div className="pxIndexPageInfoQuickContent">
                    <Select defaultValue="0" style={{ width: "80%" }} onChange={this.props.handleInfoChangePostPxType} >
                        <Option value="0">发明专利</Option>
                        <Option value="1">实用新型专利</Option>
                        <Option value="2">外观设计专利</Option>
                    </Select>
                    <Input placeholder="请输入专利名称" className="pxIndexPageInfoQuickInput" onChange={this.props.handleInfoChangePostPxName}/>
                    <div className="pxIndexPageInfoQuickInput">
                        <Input placeholder="您的姓名" className="pxIndexPageInfoQuickInputHalf" onChange={this.props.handleInfoChangePostUserName}/>
                        <Input placeholder="联系方式" className="pxIndexPageInfoQuickInputHalf" onChange={this.props.handleInfoChangePostPhone}/>
                    </div>
                    <Input placeholder="需求简介" className="pxIndexPageInfoQuickInput" onChange={this.props.handleInfoChangePostContent} />
                    <Button style={{ width: "80%" }} onClick={()=>{this.props.handleSubmitPost()}}>提交需求</Button>
                </div>
            </div>
        )
    }
}

export default Qm;