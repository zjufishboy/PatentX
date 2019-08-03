import React from 'react';
//tools
import { Comment, Avatar, Button, Input, Icon, notification} from 'antd';
import moment from 'moment';
//css file
import './RC.css';
//eidtor
const { TextArea } = Input;
const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div className="RcE">
        <TextArea rows={4} onChange={onChange} value={value}  style={{width:"90%",height:"60px"}}/>
        <Button onClick={onSubmit} type="primary" className="ButtonSubmitRc">
          {submitting?<Icon type="loading" />:<p className="ButtonSubmitRcP">发布评论</p>}
        </Button>
    </div>
  );
//component
class RC extends React.Component{
    constructor(){
        super()
        this.state = {
            submitting: false,
            value: '',
          };
    }
    handleChange = e => {
        this.setState({
          value: e.target.value,
        });
      };
    handleSubmit = () => {
        if (!this.state.value) {
          return;
        }
        this.setState({
          submitting: true,
        });
    
        setTimeout(() => {
          this.setState({
            submitting: false,
            value: '',
          });
        }, 1000);
        if(window.vnt!==undefined){
          let userState=JSON.parse(localStorage.getItem("userState"));
          if(userState.isLogin){
            this.props.handleReply(window.vnt.core.coinbase,this.state.value,moment().format("YYYY-MM-DD HH:mm:ss"))
          }
          else{
            notification['error']({
              message: '尚未授权',
              description:
                "无法在未授权情况下进行评论",
              duration:1
            });
          }
        }
        else{
          let userState=JSON.parse(localStorage.getItem("userState"));
          if(userState.isLogin){
            this.props.handleReply(userState.address,this.state.value,moment().format("YYYY-MM-DD HH:mm:ss"))
          }
          else{
            notification['error']({
              message: '尚未登录(推荐使用钱包)',
              description:
                "无法在未授权情况下进行评论",
              duration:1
            });
          }
        }
      };
    render(){
        const { comments, submitting, value } = this.state;
        return (
        <div>
            <Comment
                avatar={<Avatar src={this.props.src} alt="zjufishboy"/>}
                content={
                    <Editor
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={value}/>
                }/>
        </div>
        )
    }
}

export default RC;