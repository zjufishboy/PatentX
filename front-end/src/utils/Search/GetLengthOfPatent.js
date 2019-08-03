import CommonData from '../common'
import Vnt from 'vnt'
let vnt = new Vnt();
const abi=JSON.parse(CommonData.abi);
vnt.setProvider(new vnt.providers.HttpProvider(CommonData.url)); //链接到rpc

const GBH =(id)=>{
    let contract = vnt.core.contract(abi).at(CommonData.cAddr); 
    let r
    try{
        r =  contract.LengthOfPatent.call(id,{from: ""});
    }
    catch(e){
        return 0
    }
    return parseInt(r)
    
}

const GetLengthOfPatent =(id)=>{    
    return (()=>{ 
        return GBH(id)
    }).call()
}
export default GetLengthOfPatent;