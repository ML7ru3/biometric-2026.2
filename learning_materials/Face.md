# Face

Nhận dạng khuôn mặt là một trong những phương thức sinh trắc học tự nhiên và phổ biến nhất, được ứng dụng rỗng rãi từ bảo mất điện thoại đến kiểm soát biên giới.

## Đặc điềm và Ưu nhược điểm

**Tính tự nhiên**: Là đặc điểm dễ quan sát nhất và là cách con người thường dùng để nhận biết nhau. Khuôn mặt không chỉ định danh mà còn biểu thị cảm xúc, tình trạng sức khỏe, giới tính, sắc tộc và độ tuổi.

Ưu điểm:
- Sự chấp nhận cao: Do tính chất không xâm lấn
- Khả năng thu nhập từ xa: Có thể chụp ảnh khuôn mặt từ khoảng cách xa hơn nhiều so với vân tay hay mống mắt.
- Tính ứng dụng rộng: Từ xác thực danh tính tĩnh đến nhận diện đối tượng không kiểm soát qua video .

Nhược điểm:
- Hiệu suất trung bình đến thấp: Độ chính xác không cao bằng mống mắt hay vân tay (tỉ lệ nhận dạng sai khoảng 1/100).
- Không duy nhất tuyệt đối: Các cặp song sinh cùng trứng có khuôn mặt giống nhau.
- Tác động thời gian: Bị ảnh hưởng mạnh bởi sự lão hóa, phẫu thuật thẩm mỹ hoặc trang điểm.

## Các đặc điểm đặc trưng khuôn mặt (Feature Levels)

- Cấp độ 1: Các đặc điểm thô dễ quan sát như hình học tổng thể của khuôn mặt và màu da toàn cục. 
- Cấp độ 2: Thông tin cục bộ như cấu trúc của các thành phần (mắt, mũi, miệng), mối quan hệ giữa chúng và hình dáng chính xác của khuôn mặt.
- Cấp độ 3: Các đặc trưng vi mô không cấu trúc như sẹo, tàn nhang, nốt ruồi và các vùng da biến màu.

## Quy trình thiết kế hệ thống nhận dạnh

Một hệ thống gồm 3 thành phần chính:

### Thu nhận ảnh (Image Acquisition)

- Cảm biến 2D: Phổ biến những dễ bịnh ảnh hưởng bởi thay đổi ánh sáng và tư thế.
- Cảm biến 3D: Có lợi thế là bất biến với ánh sáng và tư thế, nhưng tốn thời gian thu nhận hơn và nhạy cảm với biểu cảm khuôn mặt.
- Video: Cho phép lựa chọn khung hình chất lượng tốt nhất và cung cấp thêm thông tin về chuyển dộng, thời gian.

### Phát hiện khuôn mặt (Face Detection)

- Thuật toán phổ biến nhất là **Viola-Jones**, sử dụng các bộ lọc hình chữ nhật (Hear-like features) và hình ảnh tích phân (Integral image) để tính toán cực nhanh.
- Nó sử dụng AdaBoost để chọn lọc các đặc trưng hữu ích và cấu trúc Phân tầng (Cascading) để lọai bỏ nhanh các vùng không chứa mặt, giúp nhận diện trong thời gian thực.

### Trích xuất đặc trưng và So khớp (Matching)

- Dựa trên hình dáng (Appearance-based): Ví dụ như thuật toán PCA
- Dựa trên cấu trúc bề mặt (Texture-based): Sử dụng các bộ mô tả như SIFT hoặc LBP (Local Binary Patterns).
- Dựa trên mô hình (Model-based): Ví dụ như phương pháp Elastic Bunch Graph Mathicng (EGGM).

## Những thách thức chính

- Biến đổi nộ lớp (Intra-class variation): Cùng một người nhưng ảnh chụp khác nhau do ánh sáng, góc chụp, biểu cảm hoặc phụ kiện
- Tương đồng ngoại lớp (Inter-class similarity): Những người khác nhau nhưng có khuôn mặt rất giống nhau (anh em, cha con, song sinh).