import React from 'react';
import './Hot.css';

class Hot extends React.Component{
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
      itemsToDivHot = (item)=>(
        <div className="TxHotItem">
          <img src={item.url} className="TxHotItemImage"/>
          <div className="TxHotInfo">
          <div className="TxHotInfoTitle">
            {item.title}
           </div>
          <div className="TxHotInfoPrice">
            浏览量：{item.view}
          </div>
          </div>
        </div>
      )
    render(){
        return (
            <div className="TxHot">
                <div className="TxHotTitle">
                最热专利
                </div>
                {this.props.hotData?this.props.hotData.map(this.itemsToDivHot):this.itemGet(5).map(this.itemsToDivHot)}
            </div>
        )
    }
}

export default Hot;