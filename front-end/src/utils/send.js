import CommonData from './common'
import {notification} from 'antd'
import Vnt from "vnt"
import vntKit from "vnt-kit"
import {Transaction  as Tx} from "ethereumjs-tx"

let Cm=require("ethereumjs-common").default
let vnt = new Vnt();
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc
async function SendData(funct,list,value)
{
    let contract = vnt.core.contract(JSON.parse(CommonData.abi));
    let data = contract.packFunctionData(funct,list);
    if(window.vnt!==undefined){
        window.vnt.core.sendTransaction({
            from: window.vnt.core.coinbase,
            to: CommonData.cAddr,
            gasPrice: 30000000000000,
            gasLimit: 4000000,
            data: data,
            value: vnt.toWei(value)
          },function(err,txHash){
              if (err) {
                console.log("err happedned: ",err);
                notification['error']({
                    message: '发送失败',
                    description:
                      "请在插件上通过交易",
                    duration:2
                  });
              } else {
                 
                  notification['success']({
                    message: '发送成功',
                    description:
                      `交易号：${txHash}`,
                    duration:2
                  });
              }
    
          })
        return;
    }
    let userState=JSON.parse(localStorage.getItem("userState"))
    let account
    try{
        account=vntKit.account.decrypt(userState.userName,userState.password, false);
    }
    catch(e){
        console.log("send::SendData:unlock fail")
        notification['error']({
            message: '发送失败',
            description:
              "账户尚未解锁，请解锁后再试",
            duration:2
          });
        return
    }
    let nonce = vnt.core.getTransactionCount(account.address);
    let options = {
        to: CommonData.cAddr,
        nonce: vnt.toHex(nonce),
        gasPrice: vnt.toHex(30000000000000),
        gasLimit: vnt.toHex(4000000),
        value: vnt.toWei(value),
        data: data,
        chainId:2
     }
    let chain=Cm.forCustomChain(1,{name:'testnet',networkId:2,chainId:2,url:CommonData.url},'petersburg'); 
    let tx = new Tx(options,{common: chain});
    tx.sign(Buffer.from(account.privateKey.substring(2,),"hex"));
    let serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'),(err,txHash)=>{ 
        if(err) {
            console.log("err happedned: ",err);
            notification['error']({
                message: '发送失败',
                description:
                  "不定错误，请联系客服处理",
                duration:2
              });
        }  
        else { 
            console.info("err:",err,"txHash:",txHash)
            notification['success']({
                message: '发送成功',
                description:
                  `交易号：${txHash}`,
                duration:2
              });
        }
    })
   
}

const send=(funct,list,value)=>{
    (()=>{ 
    SendData(funct,list,value)
    }).call()
}
export default send;