import React from 'react';
//tools
import {Breadcrumb, Divider,Comment, Tooltip, List ,Card,Icon,Avatar, Popover, notification, Statistic, Select, Input, Button } from 'antd'
import {Link} from 'react-router-dom';
import moment from 'moment';
//mytools
import Pm from '../tools/PictureModal/Pm'
import RC from '../tools/Reply/RC'
import AR from '../tools/AuctionRanking/AR'
//function-api
import GetPatentName from '../../utils/Search/GetPatentName'
import GetPatentType from '../../utils/Search/GetPatentType'
import GetUser from '../../utils/Search/GetUser'
import GetApplier from '../../utils/Search/GetApplier'
import GetTime from '../../utils/Search/GetTime'
import GetPatentState from '../../utils/Search/GetPatentState'
import GetMinPrice from'../../utils/Search/GetMinPrice'
import GetMaxPrice from'../../utils/Search/GetMaxPrice'
import GetBidden from'../../utils/Search/GetBidden'
import GetMaxPriceOwner from'../../utils/Search/GetMaxPriceOwner'
import send from '../../utils/send'
//css file
import './TxInfo.css';

const { Option } = Select;
const { Meta } = Card;

class TxInfo extends React.Component{
    constructor(props){
        super()
        this.state={
            content:"",
            pictureUrl:"",
            data :[] ,
            seller:{
                type:0,
                price:0
            },
            buyer:{
                price:0
            },
            refresh:1
        }
    }
    componentDidMount(){
        this.getContent();
        console.log(GetBidden(this.props.match.params.id.toString()))
    }
    handleTypeChangeSeller=(e)=>{
        let seller = this.state.seller;
        seller.type=parseInt(e)
        this.setState({seller:seller})
    }
    handlePriceChangebuyer=(e)=>{
        let buyer = this.state.buyer;
        buyer.price=parseInt(e.target.value)
        this.setState({buyer:buyer})
    }
    handlePriceChangeSeller=(e)=>{
        let seller = this.state.seller;
        seller.price=parseInt(e.target.value)
        this.setState({seller:seller})
    }
    CommentGet = (item,index)=>(<AR item={item} key={index}/>)
    content= () =>(
        <Link 
        to={"/userPage/"+
            (this.props.match.params.id?
                GetApplier(this.props.match.params.id.toString())
                :"游鱼星")}>
        {this.props.match.params.id?GetApplier(this.props.match.params.id.toString()):"游鱼星"}
        </Link>   
    )
    content2= () =>(
        <Link 
        to={"/userPage/"+
            (this.props.match.params.id?
                GetMaxPriceOwner(this.props.match.params.id.toString()):"游鱼星")}>
        {this.props.match.params.id?GetMaxPriceOwner(this.props.match.params.id.toString()):"游鱼星"}
        </Link>   
    )
    async getContent (){
        let id=this.props.match.params.id
        await fetch("http://api.zjugoa.club/PatentInfo/?id="+"PX0000000001" /*this.props.match.params.id.toString() */)
        .then(Reponse=>Reponse.json())
        .then(json=>{this.setState({content:json.content,pictureUrl:json.picture})})
    }
    handleReply =(name,contents,time)=>{
        let {data}=this.state;
        data.push({
            author: name,
            avatar: 'http://i2.hdslb.com/bfs/face/572e79eda505d8a9b508913692a856ee6d19d72e.jpg',
            content: (<p>[测试功能，请期待开发]{contents}</p>),
            datetime: (
              <Tooltip title={moment(time,"YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment(time,"YYYY-MM-DD HH:mm:ss").fromNow()}</span>
              </Tooltip>
            ),
          })
          this.setState({data:data})
    }
    isOwner=()=>{
        let owner=GetUser(this.props.match.params.id.toString())
        let userState=JSON.parse(localStorage.getItem("userState"))
        if(!userState.isLogin)return false;
        else{
            if(window.vnt!==undefined){
                return owner===window.vnt.core.coinbase
            }
            else{
                return owner===userState.address
            }
        }

    }
    handleSubmitSellerPost=()=>{
        notification['success']({
            message: '发布成功',
            description:
              '亲爱的'+"用户"+",发布信息如下："
              +`[${this.state.seller.type===0?"出售":"拍卖"}]`
              +`[${this.state.seller.price}VNT]`,
            duration:2
          });
        send(this.state.seller.type===0?"StartTx":"StartAuction",[this.props.match.params.id.toString(),parseInt(this.state.seller.price*1000000000000000000)],0)
        this.setState({refresh:this.state.refresh+1})
    }
    handleSubmitSellerPost2=()=>{
        notification['success']({
            message: '发布成功',
            description:
              '亲爱的'+"用户"+",发布信息如下："
              +`[修改出售价格]`
              +`[${this.state.seller.price}VNT]`,
            duration:2
          });
        send("ChangPrice",[this.props.match.params.id.toString(),parseInt(this.state.seller.price*1000000000000000000)],0)
        this.setState({refresh:this.state.refresh+1})
    }
    handleSubmitSellerEndPost=()=>{
        if(GetBidden(this.props.match.params.id.toString())==="true"){
            notification['success']({
                message: '发布成功',
                description:
                  '亲爱的'+"用户"+",发布信息如下："
                  +`[结束拍卖]`,
                duration:2
              });
            send("AuctionFinishTrans",[this.props.match.params.id.toString()],0)
            this.setState({refresh:this.state.refresh+1})
        }
        else{
            notification['error']({
                message: '结束失败',
                description:
                  "尚未有人出价，目前规则不允许结束拍卖",
                duration:2
              });
        }


    }
    handleSubmitBuyerPost=()=>{
        let userState=JSON.parse(localStorage.getItem("userState"))
        if(!userState.isLogin){
            notification['error']({
                message: '尚未登录',
                description:
                  "尚未获取授权，请解锁钱包或账户",
                duration:2
              });
        }
        notification['success']({
            message: '发布成功',
            description:
              '亲爱的'+"用户"+",发布信息如下："
              +`[购买]`
              +`[${this.state.buyer.price}VNT]`,
            duration:2
          });
          let funct =GetPatentState(this.props.match.params.id.toString())==1?"$BuyPatent":"$AuctionBuyPatent"
          //console.log("funct:",funct)
          send(funct,[this.props.match.params.id.toString()],parseInt(this.state.buyer.price))
        this.setState({refresh:this.state.refresh+1})

    }
    getMaxPricerPop=(v)=>(<Popover placement="top" title={"申请人地址"} content={this.content2()}>{v}</Popover>)
    render(){
        let userState=JSON.parse(localStorage.getItem("userState"))
        let id =this.props.match.params.id.toString()
        return (
        <div className="TxInfoInSide">
            <div className="TxInfoBoard">
                <div className="TxInfoBoardBC">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/TxHandler">交易大厅</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {this.props.match.params.id?"专利编号："+this.props.match.params.id:"PX0000000000"}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="TxInfoBoardTandT">
                    <div className="TxInfoBoardTag">
                        {this.props.match.params.id?
                            (GetPatentType(id)==0?
                                "发明专利":
                                (GetPatentType(id)==1?
                                    "实用新型专利":
                                    "外观设计专利")):
                            "某种专利"}
                    </div>
                    <div className="TxInfoBoardTitle">
                        {GetPatentName(id)}
                    </div>
                </div>
                <div className="TxInfoBoardStatics">
                    <div className="TxInfoBoardStatic">
                    <Popover placement="top" title={"申请人地址"} content={this.content()}>
                        申请者：{this.props.match.params.id?GetApplier(id):"游鱼星"}
                    </Popover>
                    </div>
                    <div className="TxInfoBoardStatic">
                        上链时间戳：{this.props.match.params.id?GetTime(id):"20190101"}
                    </div>
                    <div className="TxInfoBoardStatic">
                        状态：
                        {this.props.match.params.id?
                            (GetPatentState(id)==0?
                                "未开启拍卖/售卖":
                                (GetPatentState(id)==1?
                                    "售卖":
                                    "拍卖")):
                            "不定状态"}
                    </div>
                </div>
                <div className="TxInfoBoardContent">
                    <div className="TxInfoBoardContentWord">
                        <span style={{fontWeight:"bold"}}>简介：</span>{this.state.content}
                    </div>
                    <div className="TxInfoBoardContentImage">   
                        <Pm 
                            src={this.state.pictureUrl?
                                    this.state.pictureUrl:
                                    "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}/>
                    </div>
                    <div className="TxInfoBoardContentImageTitle">   
                        点击图片查看详情
                    </div>
                </div>
                <Divider orientation="left">
                    <span style={{fontSize:"1rem",fontWeight:"bolder"}}>
                        评论（待开发）
                    </span>
                </Divider>
                <div className="TxInfoComment">
                <List
                    className="comment-list"
                    header={`一共${this.state.data.length} 条回复`}
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                    <li>
                        <Comment
                        actions={item.actions}
                        author={item.author}
                        avatar={item.avatar}
                        content={item.content}
                        datetime={item.datetime}
                        />
                    </li>
                    )}
                />
                </div>
                <div >
                    <RC 
                        src={"http://i2.hdslb.com/bfs/face/572e79eda505d8a9b508913692a856ee6d19d72e.jpg"}
                        handleReply={this.handleReply}
                    />
                </div>
            </div>
            <div className="TxInfoBoardSmall">
                <div className="TxInfoUserInfo">
                <Card
                    style={{ width: "100%"}}
                    actions={[<Link to={"/userPage/"+(this.props.match.params.id?GetUser(id):"游鱼星")}><Icon type="eye" /></Link>]}>
                    <Meta
                        avatar={<Avatar src="http://i2.hdslb.com/bfs/face/572e79eda505d8a9b508913692a856ee6d19d72e.jpg" />}
                        title={
                            <Link to={"/userPage/"+(this.props.match.params.id?GetUser(id):"游鱼星")}>
                                {this.props.match.params.id?GetUser(id):"游鱼星"}
                            </Link>
                        }
                        description="这里是个未成熟的签名档"/>
                </Card>
                </div>
                    {this.props.match.params.id?
                        (GetPatentState(id)==0?
                            null:
                            (GetPatentState(id)==1?
                                <div className="TxInfoHistory">
                                    <Statistic 
                                        title="卖方标价" 
                                        valueStyle={{ color: '#cf1322' }} 
                                        value={GetMinPrice(id)/1000000000000000000} 
                                        suffix="VNT" />
                                </div>:
                                <div className="TxInfoHistory">
                                    <Statistic title="竞拍底价" valueStyle={{ color: '#cf1322' }} value={GetMinPrice(id)/1000000000000000000} suffix="VNT" />
                                    {GetBidden(id)==="true"?
                                        <Statistic 
                                            title="最高出价" 
                                            formatter={this.getMaxPricerPop}
                                            valueStyle={{ color: '#cf1322' }} 
                                            value={GetMaxPrice(id)/1000000000000000000} 
                                            suffix="VNT" />
                                        :<Statistic 
                                            title="最高出价" 
                                            valueStyle={{ color: '#cf1322' }} 
                                            value={0} suffix="VNT[无人竞拍状态]" />}
                                </div>))
                        :null
                    }

                    {this.isOwner()?
                        (this.props.match.params.id?
                            (GetPatentState(id)==0?
                                (<div className="TxInfoHistory">
                                    <div className="TxHistoryTitle">
                                        卖家操作
                                    </div>
                                    <div className="TxSellerOperator">
                                        <Select defaultValue="0" style={{ width: "80%" }} onChange={this.handleTypeChangeSeller}  >
                                            <Option value="0">出售专利</Option>
                                            <Option value="1">拍卖专利</Option>
                                        </Select>
                                        <Input 
                                            placeholder="请输入专利底价" 
                                            className="pxIndexPageInfoQuickInput" 
                                            onChange={this.handlePriceChangeSeller}/>
                                        <Button style={{ width: "80%" }} onClick={()=>{this.handleSubmitSellerPost()}}>发布</Button>
                                    </div>
                                </div>):
                                (GetPatentState(id)==2?
                                    (<div className="TxInfoHistory" >
                                        <div className="TxHistoryTitle" >
                                            卖家操作
                                        </div>
                                        <div className="TxSellerOperator" style={{minHeight:100}}>
                                            <Button style={{ width: "80%" }} onClick={()=>{this.handleSubmitSellerEndPost()}}>结束拍卖</Button>
                                        </div>
                                    </div>):
                                    (<div className="TxInfoHistory" >
                                        <div className="TxHistoryTitle" >
                                            卖家操作
                                        </div>
                                        <div className="TxSellerOperator" style={{minHeight:100}}>
                                        <Input placeholder="请输入专利新价格" className="pxIndexPageInfoQuickInput" onChange={this.handlePriceChangeSeller}/>
                                            <Button style={{ width: "80%" }} onClick={()=>{this.handleSubmitSellerPost2()}}>修改</Button>
                                        </div>
                                    </div>))):
                            null):
                        ((!userState.isLogin)?
                            null
                            :(<div className="TxInfoHistory">
                                <div className="TxHistoryTitle">
                                    买家操作
                                </div>
                                <div className="TxSellerOperator" style={{minHeight:100}}>
                                    <Input 
                                        placeholder={"请输入专利出价"+
                                            (GetPatentState(id)==1?"(多余金额会退回)"
                                            :""
                                        )} 
                                        className="pxIndexPageInfoQuickInput" 
                                        onChange={this.handlePriceChangebuyer}
                                    />
                                    <Button style={{ width: "80%" }} onClick={()=>{this.handleSubmitBuyerPost()}}>发布</Button>
                                </div>  
                            </div>))}
            </div>
        </div>
        )
    }
}

export default TxInfo;