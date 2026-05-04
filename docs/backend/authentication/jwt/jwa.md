# JSON Web Algorithms (JWA)

**JSON Web Algorithms (JWA)** là một đặc tả (specification) định nghĩa tập hợp các thuật toán dùng để **ký (signing)**, **mã hóa (encrypting)** và **băm (Hashing)** cho **JSON Web Token (JWT)**. Nó cung cấp một cách tiêu chuẩn để bảo mật JWT bằng nhiều thuật toán mật mã khác nhau.

Dưới đây là 3 nhóm thuật toán được dùng phổ biến khi làm việc với JWT:

**Nhóm HMAC (Symmetric Key)**:

Sử dụng một khóa bí mật duy nhất (Secret Key) cho cả hai việc: Tạo chữ ký và kiểm tra chữ ký.

- Phân loại:
  - HS256: HMAC với SHA-256
  - HS384: HMAC với SHA-384
  - HS512: HMAC với SHA-512
- Đặc điểm: Nhanh, nhẹ, dễ cấu hình. Tuy nhiên, cả bên gửi và bên nhận đều phải giữ chung một secret key. Nếu lộ secret key, bất kỳ ai cũng có thể mạo danh token.
- Khi nào dùng: Khi hệ thống của chúng ta tự cấp và tự xác thực token (ví dụ: cùng một server Spring Boot làm cả hai việc).

**Nhóm RSA (Asymmetric Key)**:

Sử dụng cặp khóa công khai (Public Key) và khóa riêng tư (Private Key). Khóa riêng tư dùng để ký token, trong khi khóa công khai dùng để xác thực chữ ký.

- Phân loại:
  - RS256: RSA với SHA-256
  - RS384: RSA với SHA-384
  - RS512: RSA với SHA-512
- Đặc điểm: Bảo mật cao, phù hợp cho các hệ thống phân tán. Tuy nhiên, quá trình ký và xác thực chậm hơn HMAC.
- Khi nào dùng: Khi hệ thống cần bảo mật cao và có nhiều dịch vụ hoặc máy chủ cần xác thực token.

**Nhóm ECDSA (Elliptic Curve Digital Signature Algorithm)**:

Sử dụng cặp khóa công khai và khóa riêng tư dựa trên thuật toán đường cong elliptic. Đây là một lựa chọn nhẹ hơn so với RSA.

- Phân loại:
  - ES256: ECDSA với SHA-256
  - ES384: ECDSA với SHA-384
  - ES512: ECDSA với SHA-512
- Đặc điểm: Nhẹ hơn RSA, phù hợp cho các hệ thống cần hiệu suất cao và bảo mật tốt.
- Khi nào dùng: Khi hệ thống cần bảo mật cao nhưng muốn giảm tải cho quá trình ký và xác thực token.

## Usage

Để sử dụng JWA cho việc ký hoặc mã hóa JWT, chúng ta cần chỉ định thuật toán trong **JWT Header**.

Ví dụ, nếu chúng ta muốn ký JWT bằng thuật toán **HS256**, phần header của JWT sẽ trông như sau:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Khi tạo JWT, bạn sẽ sử dụng thuật toán đã chỉ định để ký token với **khóa bí mật (Secret Key)** của mình.

Tương tự, khi mã hóa JWT, bạn sẽ chỉ định thuật toán mã hóa trong header và sử dụng nó để mã hóa token.
