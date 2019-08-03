import React from 'react';
import './Lm.css';
import {Link} from 'react-router-dom'
import { Input, Button } from 'antd';
import { Modal,notification} from 'antd';
var vntKit=require("vnt-kit")

class Lm extends React.Component{
    constructor(){
        super()
        let userState=JSON.parse(localStorage.getItem("userState"))
        this.state={
            tableLogin:{
                modalVisible:false,
                userName:'',
                password:''
            },
            userState:userState
        }
        notification.config({
          placement: "bottomRight",
        });

    }
    handleInfoChangeLoginUserName=(e)=>{
        this.state.tableLogin.userName=e.target.value
    }
    handleInfoChangeLoginPassword=(e)=>{
        this.state.tableLogin.password=e.target.value
    }
    handleLoginModal = ()=>{
      if(window.vnt!==undefined){
        window.vnt.getNetworkUrl((err,res)=>{
          console.log(err,res)
          console.log(res.chainId)
          let userState=JSON.parse(localStorage.getItem("userState"));
          userState.chainId=res.chainId;
          localStorage.setItem("userState",JSON.stringify(userState))
        })
        window.vnt.requestAuthorization((err,res)=>{
          if(res){
            let userState=JSON.parse(localStorage.getItem("userState"));
            userState.isLogin=true;
            this.setState({userState:userState})
            localStorage.setItem("userState",JSON.stringify(userState))
            notification['success']({
              message: '登录成功',
              description:
                '亲爱的'+("用户")+",欢迎回来",
              duration:2
            });
            window.vnt.core.getCoinbase((err, result)=>{
              if (err) {
              } else {
                this.props.handleRefresh()
              }
            })
          }
          else{
            notification['error']({
              message: '您拒绝了授权',
              description:
                "无法在未授权情况下进行交易，请授权登陆",
              duration:1
            });
          }
        })
        return;
        }
        let tL = this.state.tableLogin
        tL.modalVisible=true
        this.setState({tableLogin:tL})
      }
      handleLoginCancel = ()=>{
        let tL = this.state.tableLogin
        tL.modalVisible=false
        this.setState({tableLogin:tL})
      }
      handleLogIn = ()=>{
        let tL = this.state.tableLogin
        tL.modalVisible=false
        let account;
        try{
          account = vntKit.account.decrypt(tL.userName.toString("utf-8"), tL.password, false);
        }
        catch(e){
          notification['error']({
            message: '登录失败',
            description:
              "无法解锁，请检查KeyStore和Password",
            duration:2
          });
          this.setState({tableLogin:tL})
          return ;
        }
        notification['success']({
          message: '登录成功',
          description:
            '亲爱的'+("用户")+",欢迎回来",
          duration:2
        });

        this.state.userState.userName=tL.userName;
        this.state.userState.password=tL.password;
        localStorage.setItem("userState",JSON.stringify(this.state.userState))
        tL.userName=''
        tL.password=''
        this.setState({tableLogin:tL})
        this.props.handleRefresh()
      }
      handleLogOut=()=>{
        window.location.reload()
      }

    render(){
        return (
            <div className="pxIndexPageTopBarLogin">
             <Modal
                title="登录界面(但我们还是推荐您使用钱包登陆)"
                visible={this.state.tableLogin.modalVisible}
                onOk={this.handleLogIn}
                onPressEnter={this.handleLogIn}
                onCancel={this.handleLoginCancel}
                okText="登录"
                cancelText="取消"
                closable={false}
            >
                <Input defaultValue=""  placeholder="请输入KeyStore" addonBefore={<div style={{width:"60px"}}>KeyStore</div>} onChange={this.handleInfoChangeLoginUserName}/>
                <Input.Password defaultValue="" visibilityToggle={false} placeholder="请输入密码"  addonBefore={<div style={{width:"60px"}}>Password</div>} onChange={this.handleInfoChangeLoginPassword} />
            </Modal>
            
            {this.state.userState.isLogin?<div style={{color:"#222",fontWeight:"bold",fontSize:"1rem",marginRight:"20px",display:"flex",flexDirection:"row",justifyContent:"center"}}><Link to={"/userPage/"+this.props.address}>{"用户中心"}</Link></div>:null}
            {this.state.userState.isLogin?<Button onClick={()=>{this.handleLogOut()}}>取消授权</Button>:<Button onClick={this.handleLoginModal/* ()=>{window.vnt.requestAuthorization(console.log)} */}>解锁钱包</Button>}

          </div>
        )
    }
}

export default Lm;