import React from 'react';
//mytools
import Lm from '../LoginModal/Lm'
import Rm from '..//RegisterModal/Rm'
//tools
import {Link} from 'react-router-dom'
//css file
import './TopBar.css';
//component
class TopBar extends React.Component{
    constructor(props){
        super()
        let userState=JSON.parse(localStorage.getItem("userState"))
        this.state={
          userState:userState
        }
      }
      //按钮响应
      handleChoice = (i)=>{
        let tP=this.state.tablePost;
        tP.txType=i
        this.setState({tablePost:tP})
      }
    render(){
      //todo:客服电话这里可以加一个浮窗显示相关联系人信息
        return <div className="pxIndexPageTopBar">
        <div className="pxIndexPageTopBarPhone">
        <Link to={"/"}><span style={{fontWeight:"bold",marginRight:20}}>首页</span></Link>客服热线：188888922347(开发者id:游鱼星)
        </div>
        <div className="pxIndexPageTopBarLandR">
          <Lm 
            handleRefresh={this.props.handleRefresh}
            address={this.props.address}
          />
          <Rm/>
        </div>
      </div>
    }
}
export default TopBar;