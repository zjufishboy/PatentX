
import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GPC =()=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r 
    try{
        r = contract.GettransCount.call({from: ""});
    }
    catch(e){
        return "-"
    }
    return r.toString()
    
}

const GettransCount =()=>{    
    return (()=>{ 
        return GPC()
    }).call()
}
export default GettransCount;