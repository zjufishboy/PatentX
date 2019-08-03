import GetLengthOfPatent from'./GetLengthOfPatent'
import GetPatentInSite from'./GetPatentInSite'
const GetPatentInfo =(address,index)=>{    
    let num = parseInt(GetLengthOfPatent(address))
    let i=index-1
    if(i*3>num)return {}
    else {
        let re=[]
        for(let j=0;(j+i*3)<num&&j<3;j++){
            re.push(GetPatentInSite(address,i*3+j))
        }
        return re;
    }
}
export default GetPatentInfo;