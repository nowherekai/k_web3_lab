一个ERC721 实现

## 展示
[https://k-web3-lab-erc721.vercel.app/](https://k-web3-lab-erc721.vercel.app/)

## blockend
安装依赖
```sh
cd blockend
npm install
```

编译
```sh
npx hardhat compile
```

测试
```sh
npx hardhat test
```

运行hardhat自带的本地测试网络
```sh
npx hardhat node
```

部署合约到本地测试网络
```sh
npx hardhat run scripts/deploy.js --network localhost
```

使用console和合约交互
```sh
npx hardhat console --network localhost
```

## 前端
```sh
cd webapp
yarn install
yarn dev
```
