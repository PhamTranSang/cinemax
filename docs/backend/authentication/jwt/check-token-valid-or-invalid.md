# Check Token Valid or Invalid

Để kiểm tra một JWT là hợp lệ (valid) hay không (invalid), chúng ta cần kiểm tra các thành phần sau:

## 1. Kiểm tra cấu trúc (Check format)

JWT Token thường sẽ có định dang 3 phần được phân tách bằng dấu chấm (.): `header.payload.signature` - Khi chưa dùng JWE hoặc 5 phần được phân tách bằng dấu chấm (.): `header.encryptedKey.iv.ciphertext.tag` - Khi dùng JWE. Từng phần sẽ được mã hóa bằng Base64URL. Nếu token không có định dạng này, hoặc sai định dạng Base64, token đó bị coi là invalid ngay lập tức.

## 2. Kiểm tra chữ ký (Signature Verification)

Đây là bước để xác định xem dữ liệu có bị chỉnh sửa hay không:

- Server sẽ dùng thuật toán (như HS256 hoặc RS256) và Secret key (đối với HS256) hoặc Public key (đối với RS256) để tạo ra chữ ký mới dựa trên Header và Payload của token.
- Sau đó, server sẽ so sánh chữ ký mới tạo ra với phần Signature trong token. Nếu chúng khớp, token được coi là valid. Nếu không khớp, token bị coi là invalid vì có thể đã bị chỉnh sửa.
- Lưu ý: Nếu token được mã hóa (JWE), chúng ta cần giải mã nó trước khi thực hiện bước này.

## 3. Kiểm tra các Claim trong Payload (Validation)

Sau khi đã xác thực chữ ký, chúng ta cần kiểm tra các claim trong Payload để đảm bảo token vẫn còn hợp lệ:

- `exp` **(Expiration Time)**: Kiểm tra xem token đã hết hạn chưa. Nếu thời gian hiện tại đã vượt quá `exp`, token bị coi là invalid.
- `nbf` **(Not Before)**: Kiểm tra xem token đã có hiệu lực chưa. Nếu thời gian hiện tại chưa đến `nbf`, token bị coi là invalid.
- `iat` **(Issued At)**: Kiểm tra xem token có được phát hành trong quá khứ không. Nếu `iat` nằm trong tương lai, token có thể bị coi là invalid.
- Các claim tùy chỉnh khác: Tùy vào ứng dụng, có thể có các claim khác như `aud` (Audience), `iss` (Issuer), `sub` (Subject), v.v. Cần kiểm tra các claim này để đảm bảo token được sử dụng đúng mục đích và đối tượng.
  - `iss` **(Issuer)**: Kiểm tra xem token có được phát hành bởi một nguồn đáng tin cậy không. Nếu `iss` không khớp với giá trị mong đợi, token có thể bị coi là invalid.
  - `aud` **(Audience)**: Kiểm tra xem token có được sử dụng cho đúng đối tượng không. Nếu `aud` không khớp với giá trị mong đợi, token có thể bị coi là invalid.
  - `sub` **(Subject)**: Kiểm tra xem token có chứa thông tin người dùng hợp lệ không. Nếu `sub` không khớp với người dùng hiện tại, token có thể bị coi là invalid.
  - Các claim tùy chỉnh khác: Tùy vào ứng dụng, có thể có các claim khác như `role`, `permissions`, v.v. Cần kiểm tra các claim này để đảm bảo token được sử dụng đúng mục đích và đối tượng.

## 4. Kiểm tra Blacklist/Revocation

Ngay cả khi token còn hạn và chữ ký đúng, nó vẫn có thể bị coi là invalid nếu:

- Người dùng logout
- Token bị đưa vào blacklist trong CSDL do nghi ngờ bị lộ hoặc bị tấn công
- Token đã bị thu hồi (revoked) bởi server vì lý do bảo mật

Trong trường hợp này, server cần kiểm tra token với danh sách blacklist hoặc revocation trước khi chấp nhận token là valid.
