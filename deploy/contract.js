//deploy file
//author:zjufishboy
//project:PatentX
//All right reserved

var Vnt=require("vnt")
var vntKit=require("vnt-kit")
var Tx=require("ethereumjs-tx").Transaction
var Cm=require("ethereumjs-common").default
var fs=require("fs")
var vnt = new Vnt();
var url='https://hubscan.vnt.link/rpc'; 

//以下三个请使用者自行输入，并且保存好对应的密钥信息
var from1 = '';
var from1Keystore = '';
var pass1 = '';

var testAddress="";
var from2KeyStore =''
var pass2=""

var from3Address =''
var from3KeyStore = ''
var pass3=""

//定义代码路径(需要修改)
var codeFile = '/home/fishstar/blockchainLearning/contract/output/SingleTrans.compress'

//定义abi路径(需要修改)
var abiFile = '/home/fishstar/blockchainLearning/contract/output/SingleTrans.abi'
var wasmabi=fs.readFileSync(abiFile);
var abi=JSON.parse(wasmabi.toString("utf-8"));
vnt.setProvider(new vnt.providers.HttpProvider(url)); //链接到rpc地址
var account = vntKit.account.decrypt(from1Keystore, pass1, false);
var account2=vntKit.account.decrypt(from2KeyStore,pass2, false);
var account3=vntKit.account.decrypt(from3KeyStore,pass3, false);


function deployWasmContract(){ //部署合约
    var contract = vnt.core.contract(abi).codeFile(codeFile);
    var data = contract.packContructorData(); 
    var gas = vnt.core.estimateGas({data:data});
    var nonce = vnt.core.getTransactionCount(account.address);
    var options = {
        nonce: vnt.toHex(nonce),
        gasPrice: vnt.toHex(10000000000000),
        gasLimit: vnt.toHex(gas),
        value: "0x00",
        data: data,
    }
    var chain=Cm.forCustomChain(1,{name:'testnet',networkId:2,chainId:2,url:url},'petersburg'); 
    var tx = new Tx(options,{common: chain});
    tx.sign(Buffer.from(account.privateKey.substring(2,),"hex")); //用账户签名
    var serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'),(err,txHash)=>{ //发送交易
        if(err) {
            console.log("err happedned: ",err);
        }  
    })
}
//合约地址请到VNT官网查询（不影响部署）
var contractAddr = "";
//测试获取信息
function GetInfo(i)
{
    var contract = vnt.core.contract(abi).at(contractAddr); 
    let r;
    switch(i){
        case 1:{
            r = contract.MinPrice.call("PX0000000001",{from:account.address});
            break;
        }
        case 2:{
            r = contract.AddressInSite.call(1,{from:account.address});
            break;
        }
        case 3:{
            r = contract.GetPatentState.call("PX00001",{from:account.address});
            break;
        }
        case 4:{
            r = contract.LengthOfPatent.call(account3.address,{from:account.address});
            break;
        }
        case 5:{
            r = contract.MaxPrice.call("PX00001",{from:account.address});
            break;
        }
        case 6:{
            r = contract. MaxPriceOwner.call("PX00001",{from:account.address});
            break;
        }
        case 7:{
            r = contract.  GetPatentName.call("PX0000000001",{from:account.address});
            break;
        }
        case 8:{
            r=contract. GetPatentType.call("PX00001",{from:account.address});
            break;
        }
        case 9:{
            r=contract. GetBidden.call("PX00002",{from:account.address});
            break;
        }
        case 10:{
            r=contract. GettransCount.call({from:account.address});
            break;
        }
        case 11:{
            r=contract.GetvntCount.call({from:account.address});
            break;
        }
        case 12:{
            r=contract. GetBidden.call("PX0000000001",{from:account.address});
            break;
        }
        default:{
            console.log("enjoy it")
            break;
        }
    }
    console.log("result:", r.toString());
}
//测试发送信息
async function send(funct,list,Account,value)
{
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData(funct ,list);
    
    var nonce = vnt.core.getTransactionCount(Account.address);
    var options = {
        to: contractAddr,
        nonce: vnt.toHex(nonce),
        gasPrice: vnt.toHex(30000000000000),
        gasLimit: vnt.toHex(4000000),
        value: vnt.toHex(value),
        data: data
     }
    var chain=Cm.forCustomChain(1,{name:'testnet',networkId:2,chainId:2,url:url},'petersburg'); 
    var tx = new Tx(options,{common: chain});
    tx.sign(Buffer.from(Account.privateKey.substring(2,),"hex")); //用账户签名
    var serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'),(err,txHash)=>{ //发送交易
        if(err) {
            console.log("err happedned: ",err);
        }  
    })
}
(()=>{ //在这里改你需要执行哪个函数
    //deployWasmContract();
  // GetInfo(1)
   //send("Register",["PX0000000001",account2.address,"InitialPatent",0],account,0)
   send("$BuyPatent",["PX0000000001"],account3,25)
   //send("StartAuction",["PX00001",24],account3,0)
  //send("$AuctionBuyPatent",["PX00001"],account2,200)
    //send("AuctionFinishTrans",["PX00001"],account3,0)
}).call();