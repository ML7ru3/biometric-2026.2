# Biometric Overview

## Khái niệm và phân loại

- **Định nghĩa**: Sinh trắc học là khoa học và công nghệ đo lường, phân tích các dữ liệu sinh học. Nó sử dụng các điểm vật lý hoặc hành vi để nhận dạng hoặc xác minh danh tính cá nhân.

- **Phân loại:**
    - Sinh trắc học vật lý (Physiological): Dựa trên cấu trúc cơ thể như vân tay, khuôn mặt, mống mắt, hình học bàn tay, võng mạc, DNA.
    - Sinh trắc học hành vi (Behavioral): Dựa trên cách thức hoạt động như dáng đi (gait), cách gõ phím (keystroke), giọng nói, chữ ký.
    - Các loại khác: Mùi cơ thể (body odor), cấu trúc tai, các đặc điểm sinh trắc học bềm (soft biometrics).

- **Ưu điểm so với xác thực truyền thống**: 
    - Độ tin cậy cao và gắn liền với cá nhân
    - Không thể bị quên hay làm mất
    - Khả năng xác thực tiêu cực
    - Ngăn chặn trộm cắp danh tính và vấn đề chối b
    - Sự tiện lợi và tính tự nhiên.
    - Khả năng chống giả mạo mạnh mẽ

## Các yếu tố lựa chọn đặc trưng sinh trắc học (cho Hệ thống)

Khi thiết kế hệ thống, cần cân nhắc 7 yếu tố nền tảng:
- Tính phổ biến (Universality): Mọi người đều phải có đặc điểm đó.
- Tính độc nhất (Uniqueness): Đặc điểm phải đủ khắc biệt giữa mọi người.
- Tính bất biến (Permanence): Không thay đổi đáng kể theo thời gian.
- Khả năng thu nhập (Measurability): Dễ dàng đo lường bằng thiết bị.
- Hiệu suất (Performace): Độ chính xác và tốc độ xử lý.
- Sự chấp nhận (Acceptability): Người dùng sẵn lòng sử dụng
- Khả năng giả mạo (Circumvention): Độ khó khi bị làm giả bằng các công cu nhân tạo.

## Đánh giá hiệu suât và Sai số (cho Authentication)

Hiệu suất hệ số thường được đo lường qua các chỉ số sai số:
- FAR (False Accept Rate): Tỉ lệ chấp nhận sai 
- FRR (False Reject Rate): Tỉ lệ từ chối sai
- EER (Equal Error Rate); Điểm mà tại đó FAR = FRR. Chỉ số EER càng thấp, hệ thống càng thấp.


### Lỗi trong các hệ thống sinh trắc học

Lỗi trong các hệ thống nhận dạng sinh trắc học xuất phát từ việc hai tiền đề cơ bản là tính duy nhất (uniqueness) và tính ổn định (permanence) không bao giờ đạt được mức tuyệt đối trong thực tế.

Nguyên nhân phổ biến nhất là biến đổi nội lớp (Intra-user variations), khi dữ liệu cùng một cá nhân thu nhập tại các thời điểm khác nhau lại không khác nhau do:
- Điều kiện cảm biến không hoàn hảo.
- Sự thay đổi đặc điểm sinh trắc học
- Thay đổi điều kiện môi trường
- Sự tương tác với cảm biến: Cách người dùng đứng, cách đặt ngón tay, hoặc khoảng cách tới camera không đúng yêu cầu.