import React from 'react';
//tools
import {Link} from 'react-router-dom'
//css file
import './PxCard.css';
//default data 
const Default ={
    url:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=396832103,4147223065&fm=26&gp=0.jpg",
    id:"PX0000000000",
    name:"一种基于区块链的专利交易系统",
    time:"1234567890"
}
//component
class PxCard extends React.Component{
    constructor(props){
        super()
    }
    render(){
        return <div className="userTxInfo" >
                    <img src={this.props.item.url?this.props.item.url:Default.url} className="PxCardOutSide"/>
                    <div className="userPageTxInfoCard">
                        <div className="userPageTxInfoCardTitle">
                            <Link to={"/TxInfo/"+(this.props.item.id?this.props.item.id:Default.id)}>{this.props.item.name?this.props.item.name:Default.name}</Link>
                        </div>
                        <div className="userPageTxInfoCardContent">
                        {this.props.item.type==2?
                                    ("外观设计专利"):
                                    (this.props.item.type==1?
                                        ("实用新型专利"):
                                        ("发明专利"))}
                                
                        </div>
                        <div className="userPageTxInfoCardBottom">
                            <div className="userPageTxInfoCardTime">
                                发布时间戳：{this.props.item.time?this.props.item.time:Default.time}
                            </div>
                            <div className="userPageTxInfoCardMax">
                                {this.props.item.state==2?
                                    ("拍卖底价："+this.props.item.price+"VNT/"+(this.props.item.maxPrice==0?"暂时无人竞拍":"最高拍卖价："+this.props.item.maxPrice+"VNT")):
                                    (this.props.item.state==1?
                                        ("目前出售价："+this.props.item.price+"VNT"):
                                        ("暂未售卖"))}
                                
                            </div>
                        </div>
                    </div>
                </div>
    }
}
export default PxCard;