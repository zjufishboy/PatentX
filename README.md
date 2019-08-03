# [PatentX](https://github.com/zjufishboy/PatentX) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![Coverage Status](https://img.shields.io/coveralls/facebook/react/master.svg?style=flat)](https://coveralls.io/github/facebook/react?branch=master) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)
本项目是一个基于区块链3.0项目（VNTChain）的专利交易系统，旨在取代原有的专利交易环境，做到打造完全公开透明的专利交易环境，以促进专利交易的流通性，以提高专利交易的速度与安全性。


## 项目技术

### 区块链
* [VNTChain](http://www.vntchain.io/)

### 部署环境 
* 腾讯云 1vCPU 2G内存 
* Ubuntu `18.10`
* Docker `19.03.1`
* npm `6.9.0`

### 前端
* [React](https://github.com/facebook/react) `^16.8.6`
* [Antd](https://ant.design) `^3.20.7`
* [ethereumjs-account]() `^3.0.0`,
* [ethereumjs-tx](): `^2.1.0`,

## 前端开发
* 下载项目

` git clone https://github.com/zjufishboy/PatentX.git`
* 安装依赖

`npm install`
* 运行开发

`npm start`
* 项目构建

`npm build`



## 本项目部署具体细节

- 前端
  - 前端服务器：腾讯云服务器（只提供页面显示和相关组件的调用，不涉及中心化服务器的数据提供）
  - 下载或者clone本项目

    ```cmd
        git clone https://github.com/zjufishboy/PatentX.git
    ```

  - 进入本项目front-end文件夹

    ```cmd
        cd ./PatentX/front-end
    ```

  - 安装node.js(此处请自行查询自己系统下node的安装方式)
  - 预览页面(需要先安装依赖，并且有两个插件需要本地编译，需要g++,python2.7支持)
  
    ```cmd
       npm i
       npm start
    ```

  - 打包项目上传服务器对应文件夹/或者从项目文件夹远程拉取
  
    ```cmd
        npm build
    ```

  - ngnix技术栈的后端配置需要加上下面的代码定向到固定文件（react单页面知识请自行查询）
  
  ```cmd
     location / {
      try_files $uri /index.html;
     }
  ```

- 后端
  - 合约在本项目contract文件夹下
  
  ```cmd
    cd ./PatentX/contract
  ```

  - 安装vnt相关编译环境（ubuntu 18.10,这里如何安装docker请自行查询）
  
  ```cmd
  docker pull vntchain/bottle:0.6.1
  docker run --rm -v <your contract directory>:/tmp vntchain/bottle:0.6.0 compile -code /tmp/<your contract file name> 
  ```

  - 编译后使用deploy文件夹下的脚本部署（此处请自行修改函数调用）
  
  ```js
  node contract_deploy.js
  ```

  - 相关查询可以在脚本中自行修改查看
