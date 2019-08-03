import GetPatentName from './GetPatentName'
import GetPatentType from './GetPatentType'
import GetUser from './GetUser'
import GetApplier from './GetApplier'
import GetTime from './GetTime'
import GetPatentState from './GetPatentState'
import GetMinPrice from'./GetMinPrice'
import GetMaxPrice from'./GetMaxPrice'
//import GetBidden from'./GetBidden'
//import GetMaxPriceOwner from'./GetMaxPriceOwner'
const GetPatentInfo =(id)=>{    
    return (
        JSON.parse("{"+
            '"id"'          +':'    +'"'    +id                                                     +'"'+','+
            '"name"'        +':'    +'"'    +GetPatentName(id)                                      +'"'+','+
            '"type"'        +':'    +'"'    +GetPatentType(id)                                      +'"'+','+
            '"owner"'       +':'    +'"'    +GetUser(id)                                            +'"'+','+
            '"applier"'     +':'    +'"'    +GetApplier(id)                                         +'"'+','+
            '"time"'        +':'    +'"'    +GetTime(id)                                            +'"'+','+
            '"price"'       +':'    +'"'    +parseInt(GetMinPrice(id)/1000000000000000000)          +'"'+','+
            '"maxPrice"'    +':'    +'"'    +parseInt(GetMaxPrice(id)/1000000000000000000)          +'"'+','+
            '"state"'       +':'    +'"'    +GetPatentState(id)                                     +'"'+
    "}")
    )
}
export default GetPatentInfo;