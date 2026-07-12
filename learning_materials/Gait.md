# Gait

Nhận dạng dáng đi (Gait recognition) là một phương thức sinh trắc học hành vi tập trung việc xác định dánh tính cá nhân thông qua cách họ di chuyển. 

## Bản chất và đặc điểm

- Định nghĩa: Dáng đi là cách chúng ta bước đi; nhận dạng dáng đi là nhận diện người qua đặc điểm vận động này.
- Thông tin bổ sung: Ngoài việc định danh, dáng đi còn cung cấp thông tin về tình trạng thể chất, giới tính, độ tuổi và tâm trạng của một người.
- Khái niệm then chốt - Chu kỳ dáng đi (Gait cycle): Được tính từ lúc một bàn chân chạm đất cho đến khi chính bàn chân đó chạm đất lần thứ hai.

## Ưu điểm vượt trội

Dáng đi có những lợi thế độc đáo:
- Nhận dạng từ xa: Có thể thực hiện ở khoảng cách lớn khi các đặc điểm khác bị che khuất hoặc có độ phân giải thấp.
- Không cần sự hợp tác (Uncooperative): Hệ thống có thể nhận diện đối tượng mà không yêu cầu họ phải dừng lại hay tương tác trực tiếp với cảm biến.
- Ít nhạy cảm:  Hoạt động tốt bất kể sự thay đổi về góc nhìn hay điều kiện chiếu sáng.

## Quy trình hệ thống nhận dạng dáng đi

- Trích xuất hình ảnh (Silhousette extraction): Sử dụng kỹ thuật trừ nền (background subtraction) để thu được chuỗi hình ảnh bóng người đen trắng.
- Tạo mẫu đặc trưng (Gait Templates):
    - Gait Energy Image (GEI): Là ảnh trung bình cộng của các khung hình bóng trong một chu kỳ. GEI rất phổ biến vì khả năng khử nhiễu tốt.
    - Chrono Gait Image (CGI): Mã hóa thông tin thời gian bằng màu sắc để nén chuỗi hình ảnh và một ảnh duy nhất mà không mất quá nhiều thông tin về trình tự bước đi.
    - Gait Entropy Image (GEnI): Tính toán độ hỗn loạn (entropy) của từng pixel; các vùng chuyển động mạnh như tay và chân sẽ cso giá trị cường độ cao hơn.
- So khớp (Matching): Sử dụng các thuật toán học máy hoặc mạng thần kinh nhân tạo (CNN) để so sánh mẫu truy vấn với cơ sở dữ liệu và đưa ra định danh.


## Những thách thức và Biến thể (Variation)

Dáng đi của một người có thể bị thay đổi nhiều bởi nhiều yếu tố ngoại cảnh:
- Phụ kiện: Mặc quần áo khác nhau, đeo túi xách hoặc mang các loại giày khác nhau.
- Góc nhìn (Viewpoint): Hướng di chuyển của đối tượng so với camera.
- Tốc độ: Đi bộ nhanh hay chậm làm thay đổi nhịp điệu.
- Tình trạng cá nhân: Lão hóa, chấn thương hoặc thay đổi tâm trạng.

## So sánh và Ứng dụng 

- So sánh: Khi đặt cạnh các phương thức khác, dáng đi có khả năng thu nhập rất cao và sự chấp nhận tốt từ người dùng, nhưng độ chính xác (hiệu suất) và tính duy nhất chỉ ở mức trung bình đến thấp.
- Ứng dụng thực tế:
    - Truy tìm nghi phạm trong đám đông
    - Kiểm soát ra vào và an ninh sân bay.
    - Tương tác người-máy trong robot thông minh và nhà thông minh.


