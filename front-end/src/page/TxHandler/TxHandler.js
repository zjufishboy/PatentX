import React from 'react';
//tools
import { notification} from 'antd';
//mytools
import Qmb from '../tools/QuickModalBar/Qmb'
import Hot from '../tools/Hot/Hot'
//function-api
import GetBlockHeight from '../../utils/Search/GetBlockHeight'
import GetVntCount from '../../utils/Search/GetVntCount'
//css fils
import './TxHandler.css';
//component
//todo:其实这个模块还没有开发完成，目前交易大厅相关的接口函数仍然在设计中
class TxHandler extends React.Component{
    constructor(props){
      super()
      let userState=JSON.parse(localStorage.getItem("userState"))
      this.state={
        tablePost:{
          txType:0,
          pxType:1,
          pxName:'',
          phone:'',
          userName:'',
          content:''
        },
        TxType:0,
        userState:userState,
        todayState:{
          sell:1128,
          buy:945,
          today:12345,
          block:1234
        }
      }
      this.handleDataChange(GetBlockHeight(),GetVntCount())
      setInterval(()=>{this.handleDataChange(GetBlockHeight(),GetVntCount())},10000)
    }
    //点击响应
    handleChoice = (i)=>{
        let tP=this.state.tablePost;
        tP.txType=i
        this.setState({tablePost:tP})
      }
    //填充响应
    handleInfoChangePostUserName= (e)=>{
        let tP= this.state.tablePost;
        tP.userName = e.target.value;
        this.setState({tableLogin:tP})
      }
      handleInfoChangePostPxName= (e)=>{
        let tP= this.state.tablePost;
        tP.pxName = e.target.value;
        this.setState({tableLogin:tP})
      }
      handleInfoChangePostPhone= (e)=>{
        let tP= this.state.tablePost;
        tP.phone = e.target.value;
        this.setState({tableLogin:tP})
      }
      handleInfoChangePostContent= (e)=>{
        let tP= this.state.tablePost;
        tP.content= e.target.value;
        this.setState({tableLogin:tP})
      }
      handleInfoChangePostPxType= (e)=>{
        let tP= this.state.tablePost;
        tP.pxType= parseInt(e)
        this.setState({tableLogin:tP})
      }
      handleSubmitPost = ()=>{
        notification['success']({
          message: '发布成功',
          description:
            '亲爱的'+(this.state.userState.userName?this.state.userState.userName:"用户")+",发布信息如下：\n"
            +`[${this.state.tablePost.txType===0?"购买":"出售"}]`
            +`[${this.state.tablePost.pxType===0?"发明专利":(this.state.tablePost.pxType===1?"实用新型专利":"外观设计专利")}]`
            +`[${this.state.tablePost.pxName}]`
            +`[${this.state.tablePost.userName}]`
            +`[${this.state.tablePost.phone}]`
            +`[${this.state.tablePost.content}]`,
          duration:2
        });
      }
      handleChoiceTx=(i)=>{
          this.setState({TxType:i})
      }
      itemGet = (s)=>{
        let itemsArray=[]
        let item  = {}
        for(let i = 0; i<s; i++){
          item.url="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          item.title="一种基于区块链的专利交易系统"
          item.price="10000"
          item.view = "100000"
          itemsArray.push(item)
        }
        return itemsArray
      }
      itemsToDiv = (item)=>(
        <div className="TxItem">
          <img src={item.url} className="TxItemImage" alt={"PatentX"}/>
          <div className="TxInfo">
          <div className="TxInfoTitle">
            {item.title}
           </div>
          <div className="TxInfoPrice">
            {item.price}VNT
          </div>
          </div>
        </div>
      )
      handleDataChange=(i,j)=>{
        let tS=this.state.todayState;
        tS.block=i;
        tS.today=j;
        this.setState({todayState:tS})
      }
    render(){
        return (
            <div className="TxHandlerInSide">
              <div className="TxHandlerBar">
                <Qmb
                  number={this.state.todayState} 
                  tablePost={this.state.tablePost} 
                  handleInfoChangePostContent={this.handleInfoChangePostContent}
                  handleInfoChangePostPhone={this.handleInfoChangePostPhone}
                  handleInfoChangePostPxName={this.handleInfoChangePostPxName}
                  handleInfoChangePostPxType={this.handleInfoChangePostPxType}
                  handleInfoChangePostUserName={this.handleInfoChangePostUserName}
                  handleChoice={this.handleChoice}
                  handleSubmitPost={this.handleSubmitPost}/>
              </div>
                <div className="TxDisplayer">
                  <div className="TxContent">
                    <div className="TxChoiceBar">
                      <div className="TxTitle">
                        最新交易信息
                      </div>
                      <span 
                        className="TxTitleSmall" 
                        onClick={()=>{this.handleChoiceTx(0)}} 
                        style={{color:(this.state.TxType===0?"#00a1d6":"#222"),cursor:"pointer"}}>
                        卖方消息
                      </span>
                      <span 
                          className="TxTitleSmall" 
                          onClick={()=>{this.handleChoiceTx(1)}} 
                          style={{color:(this.state.TxType===1?"#00a1d6":"#222"),cursor:"pointer"}}>
                        买方消息
                      </span>
                    </div>
                    <div className="TxContentSum">
                      {this.itemGet(12).map(this.itemsToDiv)}
                    </div>
                  </div>
                  <Hot/>
                </div>
            </div>
        )
    }
}
export default TxHandler;