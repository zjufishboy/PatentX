import React from 'react';
//tools
import {Icon,Pagination,notification} from 'antd';
//mytools
import PxCard from '../tools/PxCard/PxCard'
import AR from '../tools/AuctionRanking/AR'
//function-api
import GetLengthOfPatent from '../../utils/Search/GetLengthOfPatent'
import GetPatentInfo from '../../utils/Search/GetPatentInfo'
import GetItems from '../../utils/Search/GetItems'
//css file
import './userPage.css';
//component
class UserPage extends React.Component{
    constructor(props){
        super()
        this.state={
            data:[]
        }
    }
    componentDidMount(){
        this.refresh(1)
    }
    refresh=(i)=>{
        let data=[]
        let array=GetItems(this.props.match.params.userAddress.toString(),i);
        for(let i = 0; i<array.length;i++){
            data.push(GetPatentInfo(array[i]))
        }
        this.setState({data:data})
    }
    ItemGet = (item)=>{
        return <PxCard item={item} key={item.id}/>
    }
    commentExample = (tag)=>{
        let itemArray=[];
        for(let i = 0;i<3;i++){
            let item={
                url:"",
                content:"",
                time:"",
                maxPrice:"",
                key:""
            } 
            item.key=tag+""+i
            item.url=""
            item.content="评论功能还在测试，敬请期待"
            item.time="2019-7-31"
            item.maxPrice="10000"
            itemArray.push(item)
        }
        return itemArray
    }
    CommentGet = (item)=>{
        return <AR item={item} key={item.key}/>
    }
    handleBuy =()=>{
        notification['error']({
            message: '[测试功能，请待后续开发]',
            description:
              "购买专利",
            duration:2
        });
    }
    handleSell=()=>{
        notification['error']({
            message: '[测试功能，请待后续开发]',
            description:
              "出售专利",
            duration:2
        });
    }
    handleNew =()=>{
        notification['error']({
            message: '[测试功能，请待后续开发]',
            description:
              "最新上架",
            duration:2
        });
    }
    render(){
        return (
            <div className="userPageInSide">
                <div className="userPageAd">
                    <div className="userPageInfo">
                        <div className="userPageInfoAvatar"></div>
                        <div className="userPageInfoIandS">
                            <div className="userPageInfoId">
                                用户地址：{this.props.match.params.userAddress?this.props.match.params.userAddress:"游鱼星"}
                            </div>
                            <div className="userPageInfoSignature">
                                {"这里是一条未成熟的签名档"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userPagefunctBar">
                    <div className="userPagefuncts">
                        <div 
                            className="userPagefunct" 
                            style={{cursor:"pointer"}} 
                            onClick={()=>{this.handleBuy()}}>
                            <Icon type="shopping" theme="filled" />
                            购买专利
                        </div>
                        <div 
                            className="userPagefunct" 
                            style={{cursor:"pointer"}} 
                            onClick={()=>{this.handleSell()}}>
                            <Icon type="money-collect" theme="filled" />
                                出售专利
                        </div>
                        <div 
                            className="userPagefunct" 
                            style={{cursor:"pointer"}} 
                            onClick={()=>{this.handleNew()}}>
                            <Icon type="shop" theme="filled" />
                                最新上架
                        </div>
                    </div>
                    <div className="userPagestatics">
                        <div className="userPagestatic">
                            <div>
                                消费总额(待开发)
                            </div>
                            <div>
                                00VNT
                            </div>
                        </div>
                        <div className="userPagestatic">
                            <div>
                                拥有专利数
                            </div>
                            <div>
                                {this.props.match.params.userAddress?GetLengthOfPatent(this.props.match.params.userAddress.toString()):"-"}件
                            </div>
                        </div>
                        <div className="userPagestatic">
                            <div>
                                出售专利数(待开发)
                            </div>
                            <div>
                                --件
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userPageContent">
                    <div className="userPageContentInside">
                        {this.state.data.map(this.ItemGet)}
                        <div className="userTxInfoSelect">
                        <Pagination
                            defaultPageSize={3}
                            defaultCurrent={1}
                            hideOnSinglePage={true}
                            total={GetLengthOfPatent(this.props.match.params.userAddress.toString())}
                            onChange={(page,pagesize)=>{this.refresh(page)}}
                            />
                        </div>
                    </div>
                    <div className="userPageContentInsideSecond">
                        <div className="userPageCommentTitle">
                            最新评论（待开发）
                        </div>
                        {this.commentExample("tag_comment").map(this.CommentGet)}
                    </div>
                </div>
            </div>
)
    }

}
export default UserPage;