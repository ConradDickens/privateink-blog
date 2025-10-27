# PrivateInk - FHEVM Blog dApp 需求文档

## 📋 项目概述

**项目名称**：PrivateInk  
**项目定位**：基于 FHEVM 的隐私保护博客平台  
**核心特性**：加密点赞/点踩、付费解锁、访问令牌控制  
**技术栈**：FHEVM + Next.js + TypeScript + Tailwind CSS  
**目标网络**：Sepolia 测试网 + 本地 Hardhat 节点  

---

## 🎯 核心价值主张

### 与传统博客的差异化

| 传统博客 | PrivateInk |
|---------|-----------|
| 点赞数公开，用户行为可追踪 | **加密点赞/点踩，保护用户隐私** |
| 付费金额链上透明 | **加密支付金额，仅授权可见** |
| 内容完全公开或私有 | **细粒度访问控制，付费解锁** |
| 收益记录公开可查 | **作者收益加密，仅本人可解密** |

---

## 🏗️ 功能模块清单（MVP）

### 1. 欢迎页（Landing Page）

#### 功能需求
- **品牌展示**
  - [ ] 项目 Logo 和名称：PrivateInk
  - [ ] Slogan：_"Write in Privacy, Read with Permission"_
  - [ ] 简介：基于 FHEVM 的隐私博客平台
  
- **核心特性展示**
  - [ ] 3-4 个特性卡片：
    - 🔐 加密点赞/点踩
    - 💰 付费解锁内容
    - 👤 隐私保护
    - ⚡ 基于 FHEVM
  
- **行动召唤（CTA）**
  - [ ] "Launch App" 按钮 → 跳转到博客列表页
  - [ ] "Connect Wallet" 快速入口

#### 设计要求
- 响应式布局（移动端/桌面端）
- 动效：页面加载渐入、按钮悬停效果
- 采用确定性随机设计系统（基于项目 seed）

---

### 2. 导航栏（Navigation Bar）

#### 功能需求
- **Logo 区域**
  - [ ] 点击返回欢迎页
  
- **导航链接**
  - [ ] "Explore" - 所有博客列表
  - [ ] "My Blogs" - 我的博客（需连接钱包）
  - [ ] "Create" - 创建新博客（需连接钱包）
  
- **钱包连接区域**
  - [ ] 未连接状态：显示 "Connect Wallet" 按钮
  - [ ] 已连接状态：显示地址缩写（0x1234...5678）+ 断开按钮
  - [ ] 网络指示器：显示当前网络（Localhost / Sepolia）

#### 交互要求
- 固定在顶部（sticky）
- 钱包地址点击可复制
- 支持暗色模式切换（可选）

---

### 3. 钱包连接（Wallet Connection）

#### 功能需求
- **连接方式**
  - [ ] 支持 EIP-6963（MetaMask Injected Provider）
  - [ ] 显示可用钱包列表（如有多个）
  
- **连接流程**
  - [ ] 点击 "Connect Wallet" → 弹出钱包选择对话框
  - [ ] 用户授权后获取账户地址
  - [ ] 检测当前网络（chainId）
  - [ ] 自动初始化 FHEVM 实例（Mock 或 Relayer）
  
- **持久化与自动重连**
  - [ ] 刷新页面后静默恢复连接（`eth_accounts`）
  - [ ] 存储 `wallet.connected` / `wallet.lastConnectorId`
  - [ ] 监听 `accountsChanged` / `chainChanged` / `disconnect` 事件
  
- **网络切换**
  - [ ] 检测到非支持网络时提示切换
  - [ ] 提供 "Switch to Sepolia" 按钮（调用 `wallet_switchEthereumChain`）

#### 错误处理
- [ ] 未安装 MetaMask：提示安装链接
- [ ] 用户拒绝连接：友好提示
- [ ] 网络错误：显示错误信息并提供重试

---

### 4. 创建博客（Create Blog）

#### 功能需求
- **表单字段**
  - [ ] 标题（Title）：必填，最多 100 字符
  - [ ] 内容（Content）：必填，富文本编辑器或 Markdown
  - [ ] 摘要（Summary）：必填，最多 200 字符
  - [ ] 是否公开：
    - [ ] 公开（Free）- 所有人可读
    - [ ] 付费解锁（Paid）- 需要输入解锁价格（ETH）
  - [ ] 标签（Tags）：可选，逗号分隔
  
- **提交流程**
  - [ ] 前端验证：字段完整性、价格格式
  - [ ] 上传内容到 Pinata IPFS：
    - [ ] 使用 Pinata API 上传博客内容（JSON 格式）
    - [ ] 获取 IPFS CID（Content Identifier）
  - [ ] 如果是付费内容：
    - [ ] 使用 FHEVM 加密解锁价格（`euint64`）
  - [ ] 调用合约 `publishBlog(contentCID, title, summary, ...)`
  - [ ] 等待交易确认
  - [ ] 成功后跳转到博客详情页

#### 交互要求
- [ ] 实时字数统计
- [ ] 草稿自动保存（localStorage）
- [ ] 发布前预览
- [ ] 加载状态：显示骨架屏或进度条

---

### 5. 查看博客（View Blog / Explore）

#### 5.1 博客列表页（Blog List）

**功能需求**
- [ ] 展示所有博客的卡片列表
- [ ] 每个卡片显示：
  - [ ] 标题
  - [ ] 摘要
  - [ ] 作者地址（缩写）
  - [ ] 发布时间
  - [ ] 加密的点赞/点踩数（需解密后显示）
  - [ ] 访问类型：🆓 Free / 💰 Paid
  
- [ ] 排序选项：
  - [ ] 最新发布（Default）
  - [ ] 最多点赞
  
- [ ] 分页或无限滚动

**交互要求**
- [ ] 点击卡片 → 跳转到博客详情页
- [ ] 悬停效果：卡片阴影加深

---

#### 5.2 博客详情页（Blog Detail）

**功能需求**
- **内容展示**
  - [ ] 标题、作者、发布时间
  - [ ] 内容区域：
    - [ ] 如果是公开文章：直接显示全文
    - [ ] 如果是付费文章且未解锁：显示摘要 + "Unlock to Read" 按钮
    - [ ] 如果是付费文章且已解锁：显示全文
  
- **解锁功能（付费文章）**
  - [ ] 显示解锁价格（需先解密 `euint64`）
  - [ ] "Unlock" 按钮：
    - [ ] 点击后调用合约 `unlockBlog(blogId, payment)`
    - [ ] 支付金额使用 FHEVM 加密
    - [ ] 交易确认后授予访问令牌
    - [ ] 刷新页面显示全文
  
- **互动功能**
  - [ ] 点赞按钮（👍）
    - [ ] 点击后调用 `likeBlog(blogId)`
    - [ ] 使用 FHEVM 加密增量（`FHE.add`）
    - [ ] 更新本地点赞数显示
  - [ ] 点踩按钮（👎）
    - [ ] 点击后调用 `dislikeBlog(blogId)`
    - [ ] 使用 FHEVM 加密增量（`FHE.add`）
  - [ ] 显示总点赞数/点踩数（需解密）
  - [ ] 防止重复点赞/点踩（合约层 `mapping(address => ebool)`）
  
- **作者操作（仅限作者本人）**
  - [ ] "Edit" 按钮（暂不实现，留作扩展）
  - [ ] "Delete" 按钮（暂不实现，留作扩展）

**交互要求**
- [ ] 解锁过程显示 loading 状态
- [ ] 点赞/点踩动画效果
- [ ] 错误提示：余额不足、交易失败等

---

### 6. 我的博客（My Blogs）

#### 功能需求
- **博客列表**
  - [ ] 显示当前钱包发布的所有博客
  - [ ] 卡片布局，展示：
    - [ ] 标题、摘要
    - [ ] 发布时间
    - [ ] 加密的点赞/点踩数
    - [ ] 加密的解锁次数（`euint32`）
    - [ ] 加密的总收益（`euint64`）
  
- **解密统计数据**
  - [ ] 点击 "Decrypt Stats" 按钮
  - [ ] 调用 FHEVM 解密：
    - [ ] 点赞数（`fhevmInstance.decrypt()`）
    - [ ] 点踩数
    - [ ] 解锁次数
    - [ ] 总收益（ETH）
  - [ ] 显示解密后的数据
  
- **收益管理**
  - [ ] 显示总收益（加密）
  - [ ] "Withdraw" 按钮：提取收益到钱包
  - [ ] 调用合约 `withdrawEarnings()`

#### 状态显示
- [ ] 空状态：未发布博客时显示 "No blogs yet. Create your first one!"
- [ ] 需连接钱包：未连接时显示 "Connect wallet to view your blogs"

---

### 7. 解密博客数据（Decrypt Blog Data）

#### 功能需求
- **解密入口**
  - [ ] 博客详情页："Decrypt Reactions" 按钮（所有人可见点赞/点踩总数）
  - [ ] 我的博客页："Decrypt Stats" 按钮（作者可见统计数据）
  
- **解密流程**
  - [ ] 检查 FHEVM 解密签名缓存（`fhevm.decryptionSignature.<account>`）
  - [ ] 如无签名：请求用户签名授权（`Sign to decrypt data`）
  - [ ] 缓存签名到 localStorage（与账户绑定）
  - [ ] 调用 `fhevmInstance.decrypt(encryptedValue, userAccount)`
  - [ ] 显示解密后的数值
  
- **解密数据类型**
  - [ ] 点赞数（`euint32`）
  - [ ] 点踩数（`euint32`）
  - [ ] 解锁次数（`euint32`）- 仅作者可见
  - [ ] 总收益（`euint64`）- 仅作者可见
  - [ ] 解锁价格（`euint64`）- 查看详情时自动解密

#### 交互要求
- [ ] 解密过程显示 loading 状态（"Decrypting..."）
- [ ] 解密成功后缓存结果（避免重复解密）
- [ ] 账户切换时清理旧账户的解密缓存

---

## 🔐 智能合约设计（Solidity）

### 合约名称：`PrivateInkBlog.sol`

### 数据结构

```solidity
struct Blog {
    uint256 id;
    address author;
    string contentCID;        // IPFS CID 或中心化服务器 URL
    string title;             // 标题（链上存储，最多 100 字符）
    string summary;           // 摘要（最多 200 字符）
    uint256 timestamp;        // 发布时间
    bool isPaid;              // 是否付费内容
    euint64 price;            // 解锁价格（加密）
    euint32 likeCount;        // 点赞数（加密）
    euint32 dislikeCount;     // 点踩数（加密）
    euint32 unlockCount;      // 解锁次数（加密，仅作者可解密）
    euint64 totalEarnings;    // 总收益（加密，仅作者可解密）
}

// 访问令牌：用户是否已解锁某篇博客
mapping(uint256 => mapping(address => ebool)) public accessTokens;

// 点赞/点踩记录：防止重复
mapping(uint256 => mapping(address => ebool)) public hasLiked;
mapping(uint256 => mapping(address => ebool)) public hasDisliked;
```

### 核心函数

#### 1. 发布博客
```solidity
function publishBlog(
    string calldata contentCID,
    string calldata title,
    string calldata summary,
    bool isPaid,
    inEuint64 calldata encryptedPrice
) external returns (uint256 blogId);
```

#### 2. 解锁博客（付费内容）
```solidity
function unlockBlog(
    uint256 blogId,
    inEuint64 calldata encryptedPayment
) external payable;
```

#### 3. 点赞
```solidity
function likeBlog(uint256 blogId) external;
```

#### 4. 点踩
```solidity
function dislikeBlog(uint256 blogId) external;
```

#### 5. 检查访问权限
```solidity
function checkAccess(uint256 blogId, address user) 
    external view returns (ebool);
```

#### 6. 提取收益
```solidity
function withdrawEarnings(uint256 blogId) external;
```

#### 7. 获取博客信息
```solidity
function getBlog(uint256 blogId) 
    external view returns (Blog memory);
```

### 访问控制逻辑

- **公开文章**：所有人可读，`accessTokens[blogId][user]` 自动为 true
- **付费文章**：
  - 作者自动有访问权
  - 其他用户需调用 `unlockBlog()` 并支付正确金额
  - 支付后 `accessTokens[blogId][user] = true`
  - 使用 `FHE.allow` 授权用户解密访问令牌

---

## 🎨 设计系统（确定性随机）

### Seed 计算
```typescript
seed = sha256("PrivateInk" + "sepolia" + "202510" + "PrivateInkBlog.sol")
```

### 设计维度选择（示例）

| 维度 | 选择 | 说明 |
|-----|------|------|
| 设计体系 | Glassmorphism | 毛玻璃效果，半透明背景 |
| 色彩方案 | E 组（Purple/Deep Purple/Indigo） | 奢华神秘，适合隐私主题 |
| 排版系统 | Sans-Serif (Inter) | 现代清晰，1.25 倍率 |
| 布局模式 | Sidebar | 左侧边栏导航 + 主内容区 |
| 组件圆角 | lg (12px) | 中等圆角 |
| 阴影 | md | 中等阴影 |
| 动效时长 | 200ms | 标准过渡 |

---

## 📦 IPFS 存储配置（Pinata）

### 服务商选择
- **提供商**：Pinata（https://pinata.cloud）
- **用途**：存储博客内容（标题、正文、元数据）
- **访问方式**：公共网关 + CID

### 环境变量配置

#### 前端 `.env.local`
```bash
# Pinata API 配置
NEXT_PUBLIC_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PINATA_API_KEY=c02bc9312d1f884a6679
PINATA_API_SECRET=48db881154d0e3e5367955ff0691e9e4670df498bdd15d8ccc4f8a13c404be22

# Pinata 网关（用于读取）
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

⚠️ **安全提示**：
- `.env.local` 文件必须添加到 `.gitignore`
- JWT 和 API Secret 不得硬编码在前端代码中
- 上传操作应通过 Next.js API Route 处理（服务端）

### 数据结构

#### 上传到 IPFS 的 JSON 格式
```json
{
  "title": "博客标题",
  "content": "博客正文内容...",
  "summary": "博客摘要",
  "tags": ["tag1", "tag2"],
  "author": "0x1234...5678",
  "timestamp": 1698765432,
  "version": "1.0"
}
```

#### 返回的 CID 示例
```
QmX7Zv9h8KqY3nBfPmW2Ln4Rd5Tc6Ux8Vp9Jw7Ks2Fg3M
```

### API 集成

#### 前端调用流程
1. 用户填写博客表单
2. 点击发布按钮
3. 前端调用 `/api/ipfs/upload` API Route
4. 服务端使用 Pinata SDK 上传内容
5. 返回 CID 给前端
6. 前端调用智能合约 `publishBlog(CID, ...)`

#### 读取流程
1. 从合约读取博客的 CID
2. 检查访问权限（FHEVM 访问令牌）
3. 如果有权限：通过 Pinata Gateway 获取内容
4. 解析 JSON 并渲染

### 依赖包

```json
{
  "dependencies": {
    "@pinata/sdk": "^2.1.0"
  }
}
```

或使用 Fetch API 直接调用 Pinata REST API。

### 文件结构

```
privateink-frontend/
├── app/
│   └── api/
│       └── ipfs/
│           ├── upload/
│           │   └── route.ts      # 上传到 Pinata
│           └── fetch/
│               └── route.ts      # 从 Pinata 读取（可选）
├── lib/
│   └── pinata.ts                 # Pinata 客户端封装
└── .env.local                     # Pinata 密钥配置
```

---

## 📁 项目结构

```
/Users/galaxy/Coding/zama_patch_2/zama_blog_0001/
├── fhevm-hardhat-template/        # 智能合约目录
│   ├── contracts/
│   │   └── PrivateInkBlog.sol     # 主合约
│   ├── deploy/
│   │   └── deploy.ts              # 部署脚本
│   ├── test/
│   │   └── PrivateInkBlog.ts      # 合约测试
│   └── tasks/
│       └── PrivateInkBlog.ts      # Hardhat 任务
│
├── privateink-frontend/           # 前端目录（新创建）
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # 欢迎页
│   │   ├── api/
│   │   │   └── ipfs/
│   │   │       ├── upload/
│   │   │       │   └── route.ts   # Pinata 上传 API
│   │   │       └── fetch/
│   │   │           └── route.ts   # Pinata 读取 API（可选）
│   │   ├── explore/
│   │   │   └── page.tsx           # 博客列表
│   │   ├── blog/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # 博客详情
│   │   ├── create/
│   │   │   └── page.tsx           # 创建博客
│   │   ├── my-blogs/
│   │   │   └── page.tsx           # 我的博客
│   │   └── providers.tsx          # Context Providers
│   │
│   ├── components/
│   │   ├── Navbar.tsx             # 导航栏
│   │   ├── WalletConnect.tsx      # 钱包连接
│   │   ├── BlogCard.tsx           # 博客卡片
│   │   ├── BlogDetail.tsx         # 博客详情
│   │   ├── BlogForm.tsx           # 创建博客表单
│   │   ├── LikeButton.tsx         # 点赞按钮
│   │   ├── UnlockButton.tsx       # 解锁按钮
│   │   └── DecryptButton.tsx      # 解密按钮
│   │
│   ├── hooks/
│   │   ├── usePrivateInkBlog.tsx  # 合约交互 Hook
│   │   ├── useWallet.tsx          # 钱包管理 Hook
│   │   └── useDecrypt.tsx         # 解密管理 Hook
│   │
│   ├── fhevm/
│   │   ├── fhevm.ts               # FHEVM 实例管理
│   │   ├── loader.ts              # Relayer SDK 动态加载
│   │   └── constants.ts           # 网络配置
│   │
│   ├── lib/
│   │   └── pinata.ts              # Pinata 客户端封装
│   │
│   ├── abi/
│   │   ├── PrivateInkBlogABI.ts   # 合约 ABI
│   │   └── PrivateInkBlogAddresses.ts # 合约地址
│   │
│   ├── scripts/
│   │   ├── genabi.mjs             # ABI 生成脚本
│   │   └── check-node.mjs         # 节点检测脚本
│   │
│   ├── design-tokens.ts           # 设计系统 tokens
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # 参考目录（只读）
└── PRIVATEINK_REQUIREMENTS.md     # 本文档
```

---

## 🚀 开发流程与验收标准

### 执行前自检清单

- [ ] 根路径 a 确认（当前：`/Users/galaxy/Coding/zama_patch_2/zama_blog_0001/`）
- [ ] `fhevm-hardhat-template` 目录存在
- [ ] `frontend` 参考目录存在
- [ ] 新前端目录命名：`privateink-frontend`
- [ ] 部署产物可用或可生成
- [ ] `dev:mock` / `dev` 两入口配置
- [ ] Relayer/Mock 动态切换逻辑
- [ ] 合约编译/测试通过
- [ ] 前端 `npm run build` 通过
- [ ] 加密→解锁→解密闭环打通

---

### 阶段 1：智能合约开发

**任务**：
1. 编写 `PrivateInkBlog.sol` 合约
2. 实现所有核心函数（发布/解锁/点赞/点踩/提取收益）
3. 编写单元测试（覆盖率 > 80%）
4. 本地部署测试

**验收标准**：
```bash
cd fhevm-hardhat-template
npx hardhat compile
npx hardhat test
# ✅ 所有测试通过

npx hardhat node  # 终端 1
npx hardhat deploy --network localhost  # 终端 2
# ✅ 部署成功，获得合约地址
```

---

### 阶段 2：前端基础搭建

**任务**：
1. 创建 `privateink-frontend` 目录
2. 配置 Next.js + TypeScript + Tailwind
3. 实现设计系统（`design-tokens.ts`）
4. 生成 ABI 和地址映射（`genabi.mjs`）
5. 配置 `dev:mock` 和 `dev` 脚本

**验收标准**：
```bash
cd privateink-frontend
npm install
npm run build
# ✅ 构建成功，无 TypeScript 错误
```

---

### 阶段 3：核心功能实现

**任务**：
1. 实现钱包连接（EIP-6963 + 持久化）
2. 实现 FHEVM 集成（Mock/Relayer 双模式）
3. 实现导航栏和路由
4. 实现创建博客功能
5. 实现博客列表和详情页
6. 实现点赞/点踩功能
7. 实现解锁功能
8. 实现解密功能
9. 实现我的博客页面

**验收标准**：
- [ ] 钱包连接：刷新页面静默恢复连接
- [ ] 创建博客：完整流程打通，内容上链
- [ ] 点赞/点踩：加密计数，防止重复
- [ ] 解锁功能：支付后授予访问权限
- [ ] 解密功能：正确解密并显示数据
- [ ] 响应式：移动端/桌面端正常显示

---

### 阶段 4：测试与优化

**任务**：
1. 端到端测试（E2E）
2. 错误处理完善
3. 加载状态优化
4. 性能优化（代码分割、图片优化）
5. 无障碍支持（WCAG AA）

**验收标准**：
- [ ] 所有功能模块正常工作
- [ ] 错误提示友好明确
- [ ] 加载状态清晰
- [ ] 首屏加载时间 < 3s
- [ ] Lighthouse 评分 > 85

---

### 阶段 5：Sepolia 部署（可选）

**任务**：
1. 配置 Sepolia 网络（INFURA/ALCHEMY API Key）
2. 准备部署账户（私钥 + 测试 ETH）
3. 部署合约到 Sepolia
4. 前端切换到 Sepolia 网络
5. 完整流程测试

**验收标准**：
```bash
cd fhevm-hardhat-template
npx hardhat deploy --network sepolia
# ✅ 部署成功

cd ../privateink-frontend
npm run dev  # 使用真实 Relayer SDK
# ✅ 前端连接 Sepolia 正常工作
```

---

## 📊 技术选型总结

| 层级 | 技术栈 | 说明 |
|-----|--------|------|
| 智能合约 | Solidity 0.8.x + FHEVM | 加密类型：`euint32/euint64/ebool` |
| 部署工具 | Hardhat + Hardhat Deploy | 支持多网络部署 |
| 前端框架 | Next.js 15 + App Router | 服务端渲染 + 静态生成 |
| 样式方案 | Tailwind CSS | 基于 `design-tokens.ts` 配置 |
| 状态管理 | React Context + Hooks | 轻量级状态管理 |
| 钱包连接 | EIP-6963 | 支持多钱包检测 |
| FHEVM 集成 | `@fhevm/mock-utils` (本地) + `@zama-fhe/relayer-sdk` (测试网) | 动态切换 |
| 内容存储 | Pinata IPFS | 方案 2：访问令牌模式 + IPFS 去中心化存储 |
| 类型安全 | TypeScript 5.x | 严格模式 + 生成的合约类型 |

---

## 🔒 安全考虑

### 智能合约安全
- [ ] 使用 `require` / `revert` 检查输入参数
- [ ] 防止重入攻击（Checks-Effects-Interactions 模式）
- [ ] 访问控制：仅作者可提取收益
- [ ] 防止重复点赞/点踩（`mapping` 记录）
- [ ] 加密金额验证（`FHE.gte` 比较）

### 前端安全
- [ ] 敏感数据不存储在明文 localStorage
- [ ] 解密签名与账户绑定
- [ ] 账户切换时清理缓存
- [ ] XSS 防护：用户输入转义
- [ ] CORS 配置正确

### 密钥管理
- [ ] 私钥存储在 `.env` 文件（不提交到 Git）
- [ ] Pinata API 密钥存储在 `.env.local`（不提交到 Git）
- [ ] 解密签名缓存在 localStorage（前缀：`fhevm.decryptionSignature.<account>`）
- [ ] 钱包连接使用标准 EIP-6963

---

## 📈 扩展功能（后续版本）

### V2 功能规划
- [ ] 富文本编辑器（Markdown 或 WYSIWYG）
- [ ] 评论系统（加密评论）
- [ ] 作者主页（展示所有博客）
- [ ] 关注/订阅功能
- [ ] 标签系统与筛选
- [ ] 搜索功能（标题/作者）
- [ ] 博客编辑功能
- [ ] 博客删除功能（仅作者）

### V3 功能规划
- [ ] 升级到混合加密（AES + FHEVM，内容端到端加密）
- [ ] IPFS Pinning 优化（多节点备份）
- [ ] 加密评分系统（1-5 星）
- [ ] NFT 勋章系统
- [ ] 多语言支持（i18n）
- [ ] 社交分享功能

---

## 🎯 成功指标

### 技术指标
- [ ] 合约测试覆盖率 > 80%
- [ ] 前端构建无错误
- [ ] Lighthouse 性能评分 > 85
- [ ] 无障碍评分 > 90

### 功能指标
- [ ] 钱包连接成功率 > 95%
- [ ] 博客发布成功率 > 98%
- [ ] 解锁流程完成率 > 90%
- [ ] 解密成功率 > 99%

### 用户体验指标
- [ ] 首屏加载时间 < 3s
- [ ] 交互响应时间 < 100ms
- [ ] 错误恢复时间 < 5s

---

## 📞 联系与支持

**开发团队**：FHEVM Development Team  
**项目仓库**：（待创建）  
**技术文档**：
- [FHEVM 官方文档](https://docs.zama.ai/fhevm)
- [Hardhat 文档](https://hardhat.org/docs)
- [Next.js 文档](https://nextjs.org/docs)

---

## 📝 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0 | 2025-10-23 | 初始需求文档，定义 MVP 范围 |
| v1.1 | 2025-10-23 | 移除封面图功能，集成 Pinata IPFS |

---

**文档结束**

_PrivateInk - Write in Privacy, Read with Permission_ 🖋️🔐

