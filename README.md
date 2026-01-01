# Market Ecosystem Frontend

## Tổng quan

**Market Ecosystem Frontend** là giao diện DApp được xây dựng bằng **Next.js (App Router)**, phục vụ cho hệ sinh thái Blockchain bao gồm:

* Bán Token theo mô hình **ICO (FLP Token Sale)**
* **NFT Marketplace** cho các vật phẩm Hero (ERC-721)

Ứng dụng cho phép người dùng kết nối ví, thực hiện giao dịch mua bán token và NFT trực tiếp trên Blockchain thông qua các Smart Contract đã triển khai.

Dự án tập trung vào tính **trực quan**, **dễ sử dụng** và **tách biệt rõ ràng giữa Frontend và Smart Contract**.

---

## Chức năng chính

### 1. FLP Token Sale (ICO)

* **Trang chủ**

  * Hiển thị thông tin bán FLP Token
  * Hiển thị trạng thái kết nối ví và số dư

* **Mua FLP Token**

  * Hỗ trợ thanh toán bằng **ETH** hoặc **USDT**
  * Số lượng token nhận được được tính toán tự động dựa trên tỷ giá trong Smart Contract

* **Tương tác Blockchain**

  * Gửi giao dịch mua token trực tiếp từ ví người dùng
  * Người dùng xác nhận giao dịch thông qua ví (MetaMask, WalletConnect, ...)

---

### 2. NFT Marketplace

Marketplace được chia thành ba khu vực chính:

#### 2.1. Store (Mint NFT)

* Cho phép admin **mint Hero NFT mới** từ hệ thống
* Các Hero được phân loại theo **Hero Type**
* Thanh toán bằng token trong hệ sinh thái

#### 2.2. Market (Chợ mua bán)

* Hiển thị danh sách NFT do người chơi khác treo bán
* Người dùng có thể mua NFT trực tiếp với giá đã niêm yết

#### 2.3. Inventory (Túi đồ)

* Hiển thị danh sách NFT người dùng đang sở hữu
* Cho phép:

  * Treo bán NFT lên Marketplace
  * Nhập giá và xác nhận giao dịch list NFT

---

### 3. Kết nối ví (Wallet)

* Tích hợp **RainbowKit** để hỗ trợ nhiều loại ví:

  * MetaMask
  * WalletConnect
  * Các ví EVM phổ biến khác

* Hiển thị:

  * Địa chỉ ví
  * Trạng thái kết nối

---

## Công nghệ sử dụng

* **Framework:** Next.js (App Router)
* **Ngôn ngữ:** TypeScript
* **Styling:** Tailwind CSS v4
* **Blockchain Client:** Viem
* **Web3 Hooks:** Wagmi
* **Wallet UI:** RainbowKit
* **State Management / Data Fetching:** TanStack Query

---

## Cài đặt và chạy dự án

### 1. Yêu cầu tiên quyết

* Node.js >= 18.17.0
* Một trong các package manager sau:

  * npm
  * yarn
  * pnpm
  * bun

---

### 2. Cài đặt thư viện

Tại thư mục gốc của dự án, chạy:

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

---

### 3. Chạy môi trường phát triển

```bash
npm run dev
```

Sau khi khởi chạy thành công, truy cập:

```
http://localhost:3000
```

---

## Cấu hình Smart Contract

Các thông tin liên quan đến Smart Contract (địa chỉ contract và ABI) được cấu hình tập trung tại:

```
src/constants/index.ts
```

### Lưu ý quan trọng

* Đảm bảo **ABI** trong file constants **khớp hoàn toàn** với Smart Contract đã deploy
* Khi deploy contract lên mạng khác (Localhost, Sepolia, BSC Testnet, v.v.), cần cập nhật lại toàn bộ địa chỉ

---

## Cấu trúc thư mục

```
market-ecosystem-frontend/
├── app/
│   ├── layout.tsx          # Layout chính, khai báo Providers (Wagmi, RainbowKit)
│   ├── page.tsx            # Trang chủ – ICO Dashboard
│   └── marketplace/
│       └── page.tsx        # Trang NFT Marketplace
├── public/                 # Tài nguyên tĩnh (ảnh, icon)
├── src/
│   ├── components/         # Các component tái sử dụng
│   └── constants/          # Địa chỉ và ABI Smart Contract
├── package.json
├── next.config.ts
└── tailwind.config.ts
```

---

## Kịch bản sử dụng (User Flow)

1. Người dùng truy cập website và **kết nối ví**
2. Tại trang chủ:

   * Nhập số lượng ETH hoặc USDT
   * Thực hiện mua FLP Token
3. Truy cập Marketplace:

   * Mint Hero NFT từ Store
4. Vào Inventory:

   * Xem NFT đang sở hữu
   * Treo bán NFT lên Marketplace
5. Tại Market:

   * Mua NFT do người chơi khác niêm yết
