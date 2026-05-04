# JSON Web Token (JWT)

**JSON Web Token (JWT)** là một chuẩn mở (RFC 7519) định nghĩa một cách an toàn để truyền thông tin giữa các bên dưới dạng một đối tượng JSON. JWT thường được sử dụng để xác thực và ủy quyền trong các ứng dụng web và API.

JWT là sự kết hợp của `(JWS hoặc JWE) sử dụng thuật toán từ JWA`.

JWT có thể được ký (JWS) để đảm bảo tính toàn vẹn và xác thực nguồn gốc của dữ liệu, hoặc có thể được mã hóa (JWE) để bảo vệ tính bảo mật của dữ liệu.

## JWA (JSON Web Algorithms)

JWA là danh sách các "thuật toán" được phép sử dụng. Không có JWA, JWS và JWE không biết phải dùng cách nào để ký hay mã hóa.

- **Với JWS**: JWA cung cấp các thuật toán ký như: HMAC (HS256, HS384, HS512), RSA (RS256, RS384, RS512), ECDSA (ES256, ES384, ES512).
- **Với JWE**: JWA cung cấp các thuật toán mã hóa khóa như: RSA-OAEP, RSA1_5, A128KW, A256KW, v.v. và các thuật toán mã hóa nội dung như: A128GCM, A256GCM, v.v.

## JWS (JSON Web Signature)

JWS là một chuẩn để ký dữ liệu JSON, đảm bảo tính toàn vẹn và xác thực nguồn gốc của dữ liệu. JWS sử dụng các thuật toán từ JWA để tạo chữ ký số.

Khi một JWT được ký bằng JWS, nó sẽ có cấu trúc gồm 3 phần: Header, Payload và Signature. Header chứa thông tin về thuật toán ký, Payload chứa các claims (thông tin người dùng, quyền hạn, v.v.), và Signature là kết quả của việc ký Header và Payload bằng một khóa bí mật hoặc cặp khóa công khai/riêng tư.

- **Cấu trúc**: `BASE64URL(UTF8(JWS Header)) + '.' + BASE64URL(UTF8(JWS Payload)) + '.' + BASE64URL(JWS Signature)`.
- **Cơ chế**: Dữ liệu trong Payload là "mở" (ai cũng đọc được bằng cách decode Base64). Tuy nhiên, phần Signature (được tạo từ JWA) đảm bảo rằng nếu Payload bị sửa đổi, token sẽ bị vô hiệu hóa ngay lập tức.
- **Mục đích**: *Tôi là ai và dữ liệu này chưa bị ai sửa*.

## JWE (JSON Web Encryption)

Nếu JWS là một tấm bưu thiếp (ai cũng có thể đọc được), thì JWE là một cái két sắt.

- **Cấu trúc**: `BASE64URL(UTF8(JWE Header)) + '.' + BASE64URL(JWE Encrypted Key) + '.' + BASE64URL(JWE Initialization Vector) + '.' + BASE64URL(JWE Ciphertext) + '.' + BASE64URL(JWE Authentication Tag)`.
- **Cơ chế**: JWE dùng thuật toán JWA để **mã hóa hoàn toàn** Payload. Nếu không có khóa giải mã, chúng ta nhìn vào chỉ thấy một đống ký tự rác.
- **Mục đích**: *Chỉ người có khóa mới được phép biết tôi viết gì bên trong*.

| Thành Phần | JWT đóng vai trò là JWS | JWT đóng vai trò là JWE |
| ---------------------- | -------------------- | -------------------- |
| Bảo mật | Chống giả mạo (Integrity) | Bảo mật (Confidentiality) |
| Payload | Mở (Anyone can read) | Mã hóa (Only authorized can read) |
| Thuật toán (JWA) | HMAC, RSA, ECDSA | RSA-OAEP, AES-GCM, PBES2, v.v. |
| Định dạng phổ biến | `header.payload.signature` | `header.key.iv.ciphertext.tag` |

Chi tiết: [JWA](jwa.md) | [JWS](jws.md) | [JWE](jwe.md)
