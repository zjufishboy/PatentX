import React from 'react';
//tools
import {Input,Button,notification,Modal,Select} from 'antd';
//function-api
import send from '../../../utils/send'
//css file
import './Rm.css';

const { Option } = Select;
//component
class Rm extends React.Component {
  constructor() {
    super()
    let userState = JSON.parse(localStorage.getItem("userState"))
    this.state = {
      tableRegister: {
        modalVisible: false,
        Patentid: '',
        PatentName: '',
        userAddress: '',
        type: 0
      },
      userState: userState
    }
  }
  handleRegisterModal = () => {
    let tR = this.state.tableRegister
    tR.modalVisible = true
    this.setState({
      tableRegister: tR
    })
  }
  handleRegisterCancel = () => {
    let tR = this.state.tableRegister
    tR.modalVisible = false
    this.setState({
      tableRegister: tR
    })
  }
  handleRegisterIn = () => {
    let tR = this.state.tableRegister
    tR.modalVisible = false
    notification['success']({
      message: '注册成功',
      description: '尊敬的管理员，信息传递成功：' ,
      duration: 2
    });
    this.setState({
      tableRegister: tR
    })
    send("Register", [tR.Patentid, tR.userAddress, tR.PatentName, tR.type], 0)
  }
  handleInfoChangeRegisterID = (e) => {
    this.state.tableRegister.Patentid= e.target.value
  }
  handleInfoChangeRegisterAddress = (e) => {
    this.state.tableRegister.userAddress = e.target.value
  }
  handleInfoChangeRegisterName = (e) => {
    this.state.tableRegister.PatentName = e.target.value
  }
  handleInfoChangeRegisterType = (e) => {
    console.log(e)
    this.state.tableRegister.type = parseInt(e)
  }
  render() {
    let userState=JSON.parse(localStorage.getItem("userState"))
    return ( <div className = "pxIndexPageTopBarRegister" >
      <Modal title = "注册界面（只有官方唯一账户可以注册，请勿随意尝试）"
        visible = {this.state.tableRegister.modalVisible}
        onOk = {this.handleRegisterIn}
        onCancel = {this.handleRegisterCancel}
        okText = "注册"
        cancelText = "取消"
        closable = {false} >
        <Input 
          placeholder = "请输入专利编号[PX+10位数字]，例如：PX0000000001"
          addonBefore = "专利编号"
          onChange = {this.handleInfoChangeRegisterID}/> 
        <Input
          placeholder = "请输入专利名称"
          addonBefore = "专利名称"
          onChange = {this.handleInfoChangeRegisterName}/> 
        <Input 
          placeholder = "请输入申请者地址，例如0x1ccca6032d...46d0fb6dfb48439f9ba21"
          addonBefore = "分配地址"
          onChange = {this.handleInfoChangeRegisterAddress}/> 
        <Select 
          defaultValue="0" 
          style={{ width: "100%" }} 
          onChange={this.handleInfoChangeRegisterType} >
          <Option value="0">发明专利</Option>
          <Option value="1">实用新型专利</Option>
          <Option value="2">外观设计专利</Option>
        </Select>
      </Modal> 
      {userState.isLogin&&window.vnt.core.coinbase==="0x9a4cd341f86cdbf8b4cd623ac7c109930de0a496"?<Button onClick = {this.handleRegisterModal} > 注册 </Button> :null}
      </div>
    )
  }
}

export default Rm;