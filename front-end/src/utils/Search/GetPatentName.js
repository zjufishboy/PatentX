import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GPC =(id)=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r 
    try{
        r = contract.GetPatentName.call(id,{from: ""});
    }
    catch(e){
        return "一种基于区块链的专利交易系统"
    }
    return r.toString()
    
}

const GetPatentName =(id)=>{    
    return (()=>{ 
        return GPC(id)
    }).call()
}
export default GetPatentName;