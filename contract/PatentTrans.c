#include "vntlib.h"

typedef struct patent Patent;  // 专利
struct patent
{
    address applier;  // 申请者
    address owner;  // 持有者
    uint64 time;  // 上链时间 
    uint64 state;   // 0是空闲状态，1是正在出售，2是正在被拍卖
    uint256 price;  // 若正在交易，当前的价格
    string PatentName;  // 专利名称
    uint64 PatentType;  // 专利类型
};

typedef struct singletrunc SingleTrunc; // 普通交易
struct singletrunc
{
    address owner;  // 专利持有者
    address buyer;  // 专利买方
    string patentid;  // 专利id
    uint256 price; // 持有者确定的价格   
    bool ownerAllowed; // 持有者是否允许交易
    bool buyerAllowed; // 买方是否允许交易
};

typedef struct auction Auct;
struct auction
{
    address owner;  // 专利持有者
    address buyer;  // 专利买方
    string patentid;  // 专利id
    uint256 startPrice;  // 拍卖底价
    uint256 maxPrice; // 当前拍卖最高价  
    bool bidden;    // 是否有人出过价  
    bool ownerAllowed; // 持有者是否允许交易
    bool buyerAllowed; // 买方是否允许交易
};

// 所有参与过交易的用户地址
KEY array(address) accounts;

// 某用户是否在我们的记录当中
KEY mapping(address, bool) AccountState;

// 某专利是否被记录在册
KEY mapping(string, bool) PatentState;

// id与专利对应关系
KEY mapping(string, Patent) patents;

// 专利持有信息，第一个参数是账户地址，第二个参数是专利id的数组
KEY mapping(address, array(string)) info;

// 专利出售交易信息
KEY mapping(string, SingleTrunc) SinTrans;

// 专利拍卖交易信息
KEY mapping(string, Auct) Auction;

// 专利数量
KEY uint64 patentCount;

// 历史交易累计额
KEY uint256 vntCount;

// 当前交易需求
KEY uint256 transCount;

// 合约主人
KEY address host;

EVENT EVENT_REGISTER(indexed address owner, string patentID, uint64 time);
EVENT EVENT_SALE(indexed address owner, string patentID, uint256 price, uint64 time);
EVENT EVENT_CHANGEPRICE(indexed address owner, string patentID, uint256 price, uint64 time);
EVENT EVENT_BUY(indexed address owner, string patentID, address buyer, uint256 price, uint64 time);
EVENT EVENT_SUCCESS(indexed address owner, string patentID, address buyer, uint256 price, uint64 time);
EVENT EVENT_STARTAUCTION(indexed address owner, string patentID, uint256 startprice, uint64 time);
EVENT EVENT_AUCBUY(indexed address owner, string patentID, address buyer, uint256 startPrice, uint256 price, uint64 time);
EVENT EVENT_AUCSUCCESS(indexed address owner, string patentID, address buyer, uint256 startPrice, uint256 price, uint64 time);

constructor SingleTrans()
{
    patentCount = 0;
    vntCount = 0;
    transCount = 0;
    host = GetSender();
}

// 获取区块高度
UNMUTABLE
uint64 BlockHeight()
{
    return GetBlockNumber();
}

//  获取所有专利数量
UNMUTABLE
uint64 PatentCount()
{
    return patentCount;
}

//  判断某个专利是否在我们的记录中
void checkPatentState(string user)
{
    PatentState.key = user;
    bool patstate = PatentState.value;
    Require(patstate, "The patent is not in our record");
} 

//  判断某个用户是否在我们的记录中
void checkAccountState(address user)
{
    AccountState.key = user;
    bool accstate = AccountState.value;
    Require(accstate, "The account is not in our record");
}

//  获取某个账户下的持有专利数量
UNMUTABLE
uint64 LengthOfPatent(address user)
{
    checkAccountState(user);
    info.key = user;
    uint64 res = info.value.length;
    return res;
}

// 获取某个账户的第i个专利id
UNMUTABLE
string PatentInSite(address user, uint64 i)
{
    uint64 len = LengthOfPatent(user);
    Require(U256_Cmp(U256FromU64(i), U256FromU64(len)) == -1, "The account has not enough patents");
    info.key = user;
    info.value.index = i;    
    string res = info.value.value;
    return res;
}



// 获取记录用户个数
UNMUTABLE
uint64 LengthOfAddress()
{
    return accounts.length;
}

// 获取第i个address
UNMUTABLE
address AddressInSite(uint64 i)
{
    uint64 len = LengthOfAddress();
    Require(U256_Cmp(U256FromU64(i), U256FromU64(len)) == -1, "There are not so many accounts");
    accounts.index = i;
    return accounts.value;
}

// 检验是否是合约主人
void checkHost()
{
    address sender = GetSender();
    Require(Equal(sender, host) == true, "Only the owner can operate");
}

// 注册专利，只有合约主人有权限
MUTABLE
void Register(string ownPatentID, address applier,string PatentName,uint64 PatentType)
{
    checkHost();
    PatentState.key = ownPatentID;
    bool patstate = PatentState.value;
    Require(patstate == false, "The patent is already in our record");
    patentCount = patentCount + 1;
    AccountState.key = applier;
    bool applierState = AccountState.value;
    if(applierState == false)
    {
      AccountState.value = true;
      uint64 i = accounts.length;
      accounts.length = i + 1;
      accounts.index = i;
      accounts.value = applier;
    }
    PatentState.key = ownPatentID;
    PatentState.value = true;
    patents.key = ownPatentID;
    patents.value.applier = applier;
    patents.value.owner = applier;
    patents.value.price = 0;
    patents.value.state = 0;
    patents.value.PatentName = PatentName;
    patents.value.PatentType = PatentType;
    patents.value.time = GetTimestamp();
    info.key = applier;
    uint64 i = info.value.length;
    info.value.length = i + 1;
    info.value.index = i;
    info.value.value = ownPatentID;
    EVENT_REGISTER(applier, ownPatentID, GetTimestamp());
}

// 判断是否是专利持有者
void checkPatentOwner(string ownPatentID)
{
    checkPatentState(ownPatentID);
    patents.key = ownPatentID;
    address owner = patents.value.owner;
    Require(Equal(GetSender(), owner) == true, "You are not the owner of the patent");
}

// 判断专利状态，是否可以出售
void checkSaleOrNot(string ownPatentID)
{
    patents.key = ownPatentID;
    uint64 state = patents.value.state;
    Require(state == 0, "The sale is not allowed");
}

// 出售专利
MUTABLE
void StartTx(string ownPatentID, uint256 price)
{
    checkPatentOwner(ownPatentID);
    checkSaleOrNot(ownPatentID);
    patents.key = ownPatentID;
    patents.value.state = 1;
    patents.value.price = price;
    SinTrans.key = ownPatentID;
    SinTrans.value.owner = GetSender();
    SinTrans.value.ownerAllowed = true;
    SinTrans.value.buyerAllowed = false;
    SinTrans.value.patentid = ownPatentID;
    SinTrans.value.price = price;
    transCount = U256SafeAdd(transCount, U256(1));
    uint64 time = GetTimestamp();
    EVENT_SALE(GetSender(), ownPatentID, price, time);
}

// 修改出价
MUTABLE
void  ChangPrice(string ownPatentID, uint256 newprice)
{
    checkPatentOwner(ownPatentID);
    patents.key = ownPatentID;
    uint64 state = patents.value.state;
    Require(state == 1, "The sale is not in progress");
    patents.key = ownPatentID;
    patents.value.price = newprice;
    SinTrans.key = ownPatentID;
    SinTrans.value.ownerAllowed = true;
    SinTrans.value.buyerAllowed = false;
    SinTrans.value.price = newprice;
    uint64 time = GetTimestamp();
    EVENT_CHANGEPRICE(GetSender(), ownPatentID, newprice, time);
}

// 售卖结束
void SingleFinishTrans(string ownPatentID)
{
    checkPatentState(ownPatentID);
    patents.key = ownPatentID;
    uint64 state = patents.value.state;
    Require(state == 1, "The sale is not in progress");
    SinTrans.key = ownPatentID;
    bool ownerAllowed = SinTrans.value.ownerAllowed;
    bool buyerAllowed = SinTrans.value.buyerAllowed;
    address owner = SinTrans.value.owner;
    address buyer = SinTrans.value.buyer;
    uint256 amount = SinTrans.value.price;

    Require(ownerAllowed == true, "The transaction is not allowed by the owner");
    Require(buyerAllowed == true, "The transaction is not allowed by the buyer");
    Require(Equal(buyer, owner) == false, "The owner can't by his own patent");
    SendFromContract(owner, amount);
    uint64 time = GetTimestamp();
    vntCount = U256SafeAdd(vntCount, amount);
    transCount = U256SafeSub(transCount, U256(1));
    
    patents.key = ownPatentID;
    patents.value.owner = buyer;
    patents.value.price = 0;
    patents.value.state = 0;
    AccountState.key = buyer;
    bool applierState = AccountState.value;
    if(applierState == false)
    {
      AccountState.value = true;
      uint64 i = accounts.length;
      accounts.length = i + 1;
      accounts.index = i;
      accounts.value = buyer;
    }
    info.key = buyer;
    uint64 i = info.value.length;
    info.value.length = i + 1;
    info.value.index = i;
    info.value.value = ownPatentID;
    info.key = owner;
    i = info.value.length;
    uint64 j = 0;
    for(j=0; j<i-1; j=j+1)
    {
      info.value.index = j;
      string testPatent = info.value.value;
      if(Equal(ownPatentID, testPatent) == true)
        break;
    }
    for( ; j<i-1; j=j+1)
    {
      info.value.index = j + 1;
      string testPatent = info.value.value;
      info.value.index = j;
      info.value.value = testPatent;
    }
    info.value.length = i - 1;

    EVENT_SUCCESS(owner, ownPatentID, buyer, amount, time);
}

// 购买者转账并且允许交易
MUTABLE
void $BuyPatent(string ownPatentID)
{
    checkPatentState(ownPatentID);
    patents.key = ownPatentID;
    address owner = patents.value.owner;
    uint64 state = patents.value.state;
    uint256 price = patents.value.price;
    address buyer = GetSender();

    AccountState.key = buyer;
    bool applierState = AccountState.value;
    if(applierState == false)
    {
      AccountState.value = true;
      uint64 i = accounts.length;
      accounts.length = i + 1;
      accounts.index = i;
      accounts.value = buyer;
    }

    Require(Equal(buyer, owner) == false, "The owner can't by his own patent");
    Require(state == 1, "The sale is not in progress");

    uint256 amount = GetValue();
    Require(U256_Cmp(amount, price) != -1, "The money is not enough");
    SinTrans.key = ownPatentID;
    SinTrans.value.buyer = buyer;
    SinTrans.value.buyerAllowed = true;

    amount = U256SafeSub(amount, price);
    SendFromContract(buyer, amount);
    uint64 time = GetTimestamp();
    EVENT_BUY(owner, ownPatentID, buyer, price, time);
    SingleFinishTrans(ownPatentID);
}

// 持有者提出专利拍卖
MUTABLE
void StartAuction(string ownPatentID, uint256 price)
{
    checkPatentOwner(ownPatentID);
    patents.key = ownPatentID;
    uint64 state = patents.value.state;
    Require(state == 0, "The auction is not allowed");
    patents.key = ownPatentID;
    patents.value.state = 2;
    patents.value.price = price;
    Auction.key = ownPatentID;
    Auction.value.bidden = false;
    Auction.value.buyerAllowed = false;
    Auction.value.maxPrice = 0;
    Auction.value.owner = GetSender();
    Auction.value.ownerAllowed = true;
    Auction.value.patentid = ownPatentID;
    Auction.value.startPrice = price;
    transCount = U256SafeAdd(transCount, U256(1));
    uint64 time = GetTimestamp();
    EVENT_STARTAUCTION(GetSender(), ownPatentID, price, time);
}


// 购买者转账参与竞拍
MUTABLE
void $AuctionBuyPatent(string ownPatentID)
{
    checkPatentState(ownPatentID);
    patents.key = ownPatentID;
    address owner = patents.value.owner;
    uint64 state = patents.value.state;
    address sender = GetSender();

    AccountState.key = sender;
    bool applierState = AccountState.value;
    if(applierState == false)
    {
      AccountState.value = true;
      uint64 i = accounts.length;
      accounts.length = i + 1;
      accounts.index = i;
      accounts.value = sender;
    }

    Require(Equal(sender, owner) == false, "The owner can't buy his own patent");
    Require(state == 2, "The auction is not in progress");
    uint256 amount = GetValue();
    Auction.key = ownPatentID;
    bool bidden = Auction.value.bidden;
    uint256 startprice = Auction.value.startPrice;
    if(bidden == true)
    {
        Auction.key = ownPatentID;
        uint256 price = Auction.value.maxPrice;
        address buyer = Auction.value.buyer;
        Require(U256_Cmp(amount, price) == 1, "The money is not enough");
        SendFromContract(buyer, price);
    }
    else
    {
        Require(U256_Cmp(amount, startprice) != -1, "The money is not enough");
    }
    Auction.key = ownPatentID;
    Auction.value.bidden = true;
    Auction.value.buyer = sender;
    Auction.value.buyerAllowed = true;
    Auction.value.maxPrice = amount;
    uint64 time = GetTimestamp();
    EVENT_AUCBUY(owner, ownPatentID, sender, startprice, amount, time);
}

// 完成拍卖
MUTABLE
void AuctionFinishTrans(string ownPatentID)
{
    checkPatentState(ownPatentID);
    patents.key = ownPatentID;
    uint64 state = patents.value.state;
    Require(state == 2, "The auction is not in progress");
    Auction.key = ownPatentID;
    bool ownerAllowed = Auction.value.ownerAllowed;
    bool buyerAllowed = Auction.value.buyerAllowed;
    address owner = Auction.value.owner;
    address buyer = Auction.value.buyer;
    address bidden = Auction.value.bidden;
    uint256 startprice = Auction.value.startPrice;
    Require(ownerAllowed == true, "The transaction is not allowed by the owner");
    Require(buyerAllowed == true, "The transaction is not allowed by the buyer");
    Require(Equal(buyer, owner) == false, "The owner can't by his own patent");
    Require(bidden == true, "None has bidden");
    Auction.key = ownPatentID;
    uint256 amount = Auction.value.maxPrice;
    SendFromContract(owner, amount);
    uint64 time = GetTimestamp();
    vntCount = U256SafeAdd(vntCount, amount);
    transCount = U256SafeSub(transCount, U256(1));

    patents.key = ownPatentID;
    patents.value.owner = buyer;
    patents.value.price = 0;
    patents.value.state = 0;
    AccountState.key = buyer;
    bool applierState = AccountState.value;
    if(applierState == false)
    {
      AccountState.value = true;
      uint64 i = accounts.length;
      accounts.length = i + 1;
      accounts.index = i;
      accounts.value = buyer;
    }
    info.key = buyer;
    uint64 i = info.value.length;
    info.value.length = i + 1;
    info.value.index = i;
    info.value.value = ownPatentID;
    info.key = owner;
    i = info.value.length;
    uint64 j = 0;
    for(j=0; j<i-1; j=j+1)
    {
      info.value.index = j;
      string testPatent = info.value.value;
      if(Equal(ownPatentID, testPatent) == true)
        break;
    }
    for( ; j<i-1; j=j+1)
    {
      info.value.index = j + 1;
      string testPatent = info.value.value;
      info.value.index = j;
      info.value.value = testPatent;
    }
    info.value.length = i - 1;

    EVENT_AUCSUCCESS(owner, ownPatentID, buyer, startprice, amount, time);
}

// 获取交易底价
UNMUTABLE
uint256 MinPrice(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    uint64 state = patents.value.state;
    uint256 price = patents.value.price;
    switch(state)
    {
      case 1:
      case 2:
        return price;
        break;
      default:
        Require(false, "The state is not correct");
        break;
    }
    
}

// 查询拍卖最高价
UNMUTABLE
uint256 MaxPrice(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    uint64 state = patents.value.state;
    Require(state == 2, "The state is not correct");
    Auction.key = patentID;
    uint256 price = Auction.value.maxPrice;
    return price;
}

// 查询最高出价者
UNMUTABLE
address MaxPriceOwner(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    uint64 state = patents.value.state;
    Require(state == 2, "The state is not correct");
    Auction.key = patentID;
    address buyer = Auction.value.buyer;
    return buyer;
}

// 查询专利状态
UNMUTABLE
uint64 GetPatentState(string patentID)
{
    patents.key = patentID;
    return patents.value.state;
}

UNMUTABLE
uint64 GetPatentOwner(string patentID)
{
    patents.key = patentID;
    return patents.value.owner;
}

UNMUTABLE
address GetPatentApplier(string patentID)
{
    patents.key = patentID;
    return patents.value.applier;
}

UNMUTABLE
uint64 GetPatentTime(string patentID)
{
    patents.key = patentID;
    return patents.value.time;
}
//查询对应id专利名称
UNMUTABLE
string GetPatentName(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    return patents.value.PatentName;
}

//查询对应id专利类型
UNMUTABLE
uint64 GetPatentType(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    return patents.value.PatentType;
}

// 查询VNT历史累计交易额
UNMUTABLE
uint256 GetvntCount()
{
  return vntCount;
}

// 查询当前交易需求总量
UNMUTABLE
uint256 GettransCount()
{
  return transCount;
}

// 查询拍卖时专利是否有人出价
UNMUTABLE
bool GetBidden(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    uint64 state = patents.value.state;
    Require(state == 2, "The state is not correct");
    Auction.key = patentID;
    return Auction.value.bidden;
}

// 根据专利查询所有者
UNMUTABLE
address GetUser(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    return patents.value.owner;
}

// 根据专利查询申请者
UNMUTABLE
address GetApplier(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    return patents.value.applier;
}

// 根据专利查专利申请时间
UNMUTABLE
uint64 GetTime(string patentID)
{
    checkPatentState(patentID);
    patents.key = patentID;
    return patents.value.time;
}
