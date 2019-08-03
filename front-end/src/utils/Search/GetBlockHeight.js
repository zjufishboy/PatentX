import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GBH =()=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r
    try{
        r =  contract.BlockHeight.call({from: ""});
    }
    catch(e){
        return "-"
    }
    return r.toString()
    
}

const GetBlockHeight =()=>{    
    return (()=>{ 
        return GBH()
    }).call()
}
export default GetBlockHeight;