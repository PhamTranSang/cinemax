# JSON Web Signature (JWS)

**JSON Web Signature (JWS)** là một chuẩn mở (RFC 7515) định nghĩa cách tạo và xác thực chữ ký số cho dữ liệu JSON. JWS thường được sử dụng để bảo vệ tính toàn vẹn của dữ liệu và xác thực nguồn gốc của nó.

## Structure of JWS

Một JWS gồm 3 thành phần chính, được mã hóa Base64URL:

- **Header**: Chứa thông tin về loại token và thuật toán (chọn từ [JWA](jwa.md)).
- **Payload**: Chứa các claims (thông tin người dùng, quyền hạn, v.v.) hoặc dữ liệu khác mà bạn muốn bảo vệ.
- **Signature**: Được tạo ra bằng cách ký phần header và payload bằng một khóa bí mật hoặc cặp khóa công khai/riêng tư.

## Syntax

JWS bảo vệ dữ liệu bằng cách tạo ra một chữ ký từ header và payload.

Khi nhận được JWS, người nhận sẽ giải mã header và payload, sau đó sử dụng thuật toán đã chỉ định trong header để xác thực chữ ký bằng cách sử dụng khóa bí mật hoặc khóa công khai tương ứng. Nếu chữ ký hợp lệ, người nhận có thể tin tưởng rằng dữ liệu chưa bị thay đổi và được gửi từ nguồn đáng tin cậy.

```mermaid
sequenceDiagram
    participant Sender
    participant Receiver
    Sender->>Receiver: Create JWS (Header + Payload + Signature)
    Receiver->>Receiver: Decode Header and Payload
    Receiver->>Receiver: Verify Signature using secret key or public key
    alt Signature valid
        Receiver->>Receiver: Trust the data and proceed
    else Signature invalid
        Receiver->>Receiver: Reject the data and return an error
    end
```

Cấu trúc:

```text
BASE64URL(UTF8(JWS Header)) + '.' +
BASE64URL(UTF8(JWS Payload)) + '.' +
BASE64URL(JWS Signature)

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Usage

Dù chúng ta thường thấy dạng chuỗi (Compact), JWS thực tế có 2 cách đóng gói:

| Đặc điểm | Compact Serialization (Phổ biến) | JSON Serialization (Ít gặp) |
| ---------------------- | -------------------- | -------------------- |
| Cấu trúc | Header.Payload.Signature | { "payload": "BASE64URL(UTF8(JWS Payload))", "signatures": [ { "protected": "BASE64URL(UTF8(JWS Header))", "signature": "BASE64URL(JWS Signature)" } ] } |
| Số lượng chữ ký | Chỉ hỗ trợ 1 chữ ký | Hỗ trợ nhiều chữ ký |
| Ứng dụng | Truyền qua HTTP Header, URL | Dùng trong các luồng nghiệp vụ cần nhiều bên xác nhận |

## Implementation

Trong thư viện jjwt, khi chúng ta gọi lệnh `.compact()`, chúng ta đang ra lệnh cho nó tạo ra một **JWS dạng Compact**.

```java
String jws = Jwts.builder()
    .setSubject("1234567890")
    .setIssuedAt(new Date())
    .signWith(key, SignatureAlgorithm.HS256)
    .compact();
```

## Summary

- **JWS (Signature)**: Dữ liệu được CÔNG KHAI nhưng KHÔNG THỂ SỬA. Nó giống như một tấm bằng khen treo trên tường: Ai đi ngang qua cũng đọc được tên bạn (Public), nhưng họ không thể sửa tên bạn thành tên họ vì có con dấu của hiệu trưởng (Signature).
- **JWE (Encryption)**: Dữ liệu được BÍ MẬT. Nó giống như một bức thư bỏ trong phong bì dán kín: Chỉ người có chìa khóa mới biết bên trong viết gì.

**Tóm lại**: Khi dùng JWSm đừng bao giờ để mật khẩu hay thông tin nhạy cảm vào Payload, vì chỉ cần Base64 Decaode là đọc được hết thông tin.
