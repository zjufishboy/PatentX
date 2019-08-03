import React from 'react';
import './AR.css';

class AR extends React.Component{
    constructor(){
        super()
    }
    render(){
      const item = this.props.item
        return (
          <div className="userPageCommentContent" style={{borderBottom:item.underLine?"0px":"1px"}}>
            <a href={item.url}>{item.content}</a>
            <div className="userPageCommentContentBottom" >
                <div className="userPageCommentContentTime">
                    {item.time}
                </div>
                <div className="userPageCommentContentPrice">
                    {item.maxPrice}
                </div>
            </div>
        </div>
        )
    }
}

export default AR;