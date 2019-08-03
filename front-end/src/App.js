import React from 'react';
//tools
import {Modal, Button, Icon} from 'antd'
import { BrowserRouter as Router,Route} from 'react-router-dom';
//pages
import IndexPage from'./page/IndexPage/IndexPage'
import UserPage from './page/userPage/userPage'
import TxHandler from './page/TxHandler/TxHandler'
import TopBar from './page/tools/TopBar/TopBar'
import TxInfo from './page/TxInfo/TxInfo'
//css file
import './App.css';
//component
class App extends React.Component {
  constructor(props){
    super()
    this.state={
      address:""
    }
    localStorage.setItem(
      "userState",
      JSON.stringify({
        isLogin:false,
        userName:'',
        password:'',
        address:"",
        PrivateKey:"",
        chainId:0
      }))
    this.check()
  }
  check =()=>{
    if(window.vnt!==undefined){
      window.vnt.getNetworkUrl((err,res)=>{console.log(err,res)})
      window.vnt.logout((err,res)=>{
        if(res){
          localStorage.setItem(
            "userState",
            JSON.stringify({
              isLogin:false,
              userName:'',
              password:'',
              address:"",
              PrivateKey:"",
              chainId:0
            }))
          }
      })
    }
  }
  handleRefresh =()=>{
    let user
    let userState=JSON.parse(localStorage.getItem("userState"))
    if(!userState.isLogin)user="";
    else{
      if(window.vnt!==undefined){
        user=window.vnt.core.coinbase
      }
      else{
        user=userState.address
      }
    }
    this.setState({refresh:user})
  }
  render(){
    return (
      <Router >
        <div className="PxOutSide">
        {<Modal
            title={<span style={{color:"red",fontSize:"1rem",fontWeight:"bolder"}}><Icon type="warning" theme="filled"/>缺少插件</span>}
            visible={window.vnt==undefined}
            closable={false}
            footer={
              <Button 
                type="primary" 
                onClick={()=>{window.location.href="https://chrome.google.com/webstore/search/vnt%20wallet"}}>
                  确认
              </Button>}>
          <p>本Dapp需要VNT钱包支持使用，请点击<span style={{color:"#f00",fontWeight:"bolder"}}>确认</span>，前往谷歌商店安装对应插件</p>
          </Modal>}
          <div className="PxInSide">
            <TopBar handleRefresh={this.handleRefresh} address={this.state.refresh}/>
            <Route exact path="/" component={IndexPage} />
            <Route exact path="/UserPage" component={UserPage} />
            <Route exact path="/UserPage/:userAddress" component={UserPage} />
            <Route exact path="/TxHandler" component={TxHandler} />
            <Route exact path="/TxInfo" component={TxInfo} />
            <Route exact path="/TxInfo/:id" component={(routeProps)=><TxInfo {...routeProps} address={this.state.refresh}/>} />
          </div>
          <div className="PxUnderBar">
              个人网站备案号：<a href="http://www.miitbeian.gov.cn/">浙ICP备19002880号</a>[本页面仅供项目测试使用，不代表最终产品，如有合作意向请联系管理员]
          </div>
        </div>
		</Router>
    );
  }
}
export default App;
