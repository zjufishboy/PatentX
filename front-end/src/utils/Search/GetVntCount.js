import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GVC =()=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r 
    try{
        r = contract.GetvntCount.call({from: ""});
    }
    catch(e){
        return "-233"
    }
    return r.toString()
}

const GetVntCount =()=>{    
    return (()=>{ 
        return GVC()
    }).call()
}
export default GetVntCount;