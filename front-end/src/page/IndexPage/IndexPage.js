import React from 'react';
//logo
import logo from '../../logo.svg';
//mytools
import Qmb from '../tools/QuickModalBar/Qmb'
//tools
import {Link} from 'react-router-dom'
import { Carousel,Input,notification} from 'antd';
//function-api
import GetBlockHeight from '../../utils/Search/GetBlockHeight'
import GetVntCount from '../../utils/Search/GetVntCount'
import GetPatentCount from '../../utils/Search/GetPatentCount'
import GettransCount from '../../utils/Search/GettransCount'
//css file
import './IndexPage.css';

const { Search } = Input;

const functGet = () =>{
  return [
        {
          title:"首页",
          link:"/"
        },
        {
          title:"出售专利",
          link:"/TxHandler"
        },
        {
          title:"购买专利",
          link:"/TxHandler"
        },
        {
          title:"相关咨询（待开发）",
          link:"/"
        },
        {
          title:"平台介绍（待开发）",
          link:"/"
        }
        ]
}
const FunctBarGet = (item)=>{
  return (<div className="pxIndexPageFunct" key={item.title}><Link to={item.link} ><span className="titleFunct">{item.title}</span></Link></div>)
}

//component
class IndexPage extends React.Component {
  constructor(props){
    super()
    let userState=JSON.parse(localStorage.getItem("userState"))
    this.state={
      tablePost:{
        txType:0,
        pxType:0,
        pxName:'',
        phone:'',
        userName:'',
        content:''
      },
      userState:userState,
      todayState:{
        sell:1128,
        buy:945,
        today:12345,
        block:1234
      },
      search:""
    }
  }
  componentDidMount(){
    this.handleDataChange(GetBlockHeight(),GetVntCount(),GetPatentCount(),GettransCount())
    setInterval(()=>{this.handleDataChange(GetBlockHeight(),GetVntCount(),GetPatentCount(),GettransCount())},10000)
  }
  //按钮响应
  handleChoice = (i)=>{
    let tP=this.state.tablePost;
    tP.txType=i
    this.setState({tablePost:tP})
  }
  //发布
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
      message: '[测试功能，待开发]发布成功',
      description:
        '亲爱的'+(this.state.userState.userName?this.state.userState.userName:"用户")+",发布信息如下："
        +`[${this.state.tablePost.txType===0?"购买":"出售"}]`
        +`[${this.state.tablePost.pxType===0?"发明专利":(this.state.tablePost.pxType===1?"实用新型专利":"外观设计专利")}]`
        +`[${this.state.tablePost.pxName}]`
        +`[${this.state.tablePost.userName}]`
        +`[${this.state.tablePost.phone}]`
        +`[${this.state.tablePost.content}]`,
      duration:2
    });
  }
  handleDataChange=(i,j,k,l)=>{
    let tS=this.state.todayState;
    tS.block=i;
    tS.today=parseInt(j/1000000000000000000);
    tS.sell=k;
    tS.buy=l;
    this.setState({todayState:tS})
  }
  handleChangeSearch = (e)=>{
    this.setState({search:e.target.value})
  }
  render() {
    return (
      <div className="pxIndexPageInSide">
        <div className="pxIndexPageSearchBar">
          <img className="pxIndexLogo" src={logo} alt="logo"/>
          <div className="pxIndexPageSearch">
          <Search placeholder="输入专利查找专利" onChange={this.handleChangeSearch} enterButton={<Link to={this.state.search?"/TxInfo/"+this.state.search.toUpperCase():"/"}>搜索</Link>} />
          </div>
        </div>
        <div className="pxIndexPageFunctBar">
          {functGet().map(FunctBarGet)}
        </div>
        <Carousel autoplay effect="scrollx">
        <div className="pxIndexPageAd">
        </div>
        <div className="pxIndexPageAd">
        </div>
        </Carousel>
        <Qmb
            number={this.state.todayState}
            tablePost={this.state.tablePost} 
            handleInfoChangePostContent={this.handleInfoChangePostContent}
            handleInfoChangePostPhone={this.handleInfoChangePostPhone}
            handleInfoChangePostPxName={this.handleInfoChangePostPxName}
            handleInfoChangePostPxType={this.handleInfoChangePostPxType}
            handleInfoChangePostUserName={this.handleInfoChangePostUserName}
            handleChoice={this.handleChoice}
            handleSubmitPost={this.handleSubmitPost}
            />
    </div>
    )
    
  }
}

export default IndexPage;
