import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GPC =(address,i)=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r
    try{
        r = contract.PatentInSite.call(address,i,{from: ""});
    }
    catch(e){
        return "233"
    }
    return r.toString()
    
}

const GetPatentInSite=(address,i)=>{    
    return (()=>{ 
        return GPC(address,i)
    }).call()
}
export default GetPatentInSite