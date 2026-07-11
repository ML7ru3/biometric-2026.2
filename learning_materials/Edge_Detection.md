# Edge Detection (Chapter 3.1)

Phát hiện biên (Edge Detection) là một kỹ thuật quan trọng trong thị giác máy tính, giúp trích xuất thông tin hình dạng và ngũ nghĩa từ hình ảnh một cách gọn nhẹ hơn so với việc xử lý từng điểm ảnh riêng lẻ.

## Khái niệm và Tầm quan trọng

- Biên (Edges/Contours): Là những vị trí có sự thay đổi cục bộ đột ngột về cường dộ sáng trong ảnh. Chúng thường xuất hiện tại ranh giới giữa các vùng khác nhau.
- Nguồn gốc của biên: Do sự thay đổi về độ sâu, hướng bề mặt, điều kiện chiếu sáng, hệ số phản xạ hoặc màu sắc bề mặt.
- Vai trò: Giúp máy tính nhận diện đối tượng, khôi phục hình học và góc nhìn (viewpoint).

## Nguyên lý tìm biên

Một biên được xác định tại nơi hàm cường độ sáng của ảnh thay đổi nhanh chóng. Để tìm biên, người ta sử dụng các phép toán **đạo hàm**:
- Đạo hàm bậc nhất: Tạo ra các cực trị (peaks) tại vị trí có sự thay đổi cường độ.
- Đạo hàm bậc hai: Tạo ra các điểm gia không (Zero-crossing) tại tâm của biên.

## Các bộ dò phổ biến

Bộ dò biên bậc nhất (Sobel & Prewitt): 
- Sử dụng các Kernel (mặt nạ) để cuộn với ảnh nhằm tính xấp xỉ đạo hàm theo hướng X và Y.
- Sobel: Kết hợp giữa làm mịn Gaussian và đạo hàm, giúp bộ dò này ít nhạy cảm với nhiễu hơn.

Bộ dò biên bậc hai (Laplacian):
- Sử dụng bộ lọc Laplacian để tính đạo hàm bậc hai
- Ưu điểm: Phải hồi đơn nhất (single response) tại tâm biên. 
- Nhược điểm: Rất nhạy cảm với nhiễu.

## Bộ dò biên Canny (Canny Edge Detector)

Đây là bộ dò biên được sử dụng rộng rãi nhất nhờ đáp ứng 3 tiếu chí tối ưu: Phát hiện tốt (giảm thiểu lỗi biên giả/bỏ sót biên). Định vị tốt (biên tìm được gần nhất so với biên thực), và Đáp ứng duy nhất (biên chỉ mỏng 1 pixel)

**Các bước thực hiện của thuật toán Canny**:
1. Lọc Gaussian: Làm mịn ảnh để loại bỏ nhiễu
2. Tính toán Gradient: Sử dụng bộ lọc Sobel để tìm độ lớn (|G|) và hướng của gradient.
3. Làm tròn hướng biên: Chuyển hướng về các bội số của 45 độ.
4. Loại bỏ cá điểm không cực đại (Non-maxima suppresion): Chỉ giữ lại các pixel có độ lớn gradient lớn nhất so với các pixel lân cận theo hướng gradient để làm mảnh biên.
5. Phân ngưỡng trễ (Hysteresis thresholding): Sử dụng hai ngưỡng: Ngưỡng cao (Sh) và Ngưỡng thấp (Sb)
  - Pixel > Sh: Chắc chắn là biên
  - Pixel < Sb: Loại bỏ
  - Còn lại: Chỉ được coi là biên nếu nó kết nối với một pixel biên chắc chắn khác.

## Liên kết biên và Tìm kiếm cấu trúc (Edge Linking)

Sau khi có sơ đồ biên, các kỹ thuật sau được dùng để tìm các hình dạng cụ thể:

### Biến đổi Hough (Hough Transform)

Dùng để phát hiện các đường thẳng, hình tròn hoặc cấu trúc có phương trình tham số cụ thể.
- Cơ chế: Chuyển từ không gian tọa độ `x - y` sang không gian tham số. Mỗi điểm biên sẽ "bình chọn" (vote) cho các tham số tiềm năng; vị trí nhận được nhiều phiếu bầu nhất sẽ xác định cấu trúc thực tế trong ảnh.
- Ưu điểm: Hoạt động tốt ngay cả khi biên bị đứt đoạn hoặc có nhiễu.

### RANSAC (Random SAmple Consensus)

Một phương pháp khớp mô hình bằng cách lấy mẫu ngẫu nhiên dữ liệu quan sát.

Mục tiêu: Loại bỏ tác động của các điểm nhiễu (outliers) và chỉ sử dụng các điểm hợp lệ (inliers) để ước lượng tham số mô hình.

## Ứng dụng trong sinh trắc học

Kỹ thuật dò biên được sử dụng cụ thể trong:
- Nhận dạng mống mắt: Tìm ranh giới giữa mống mắt/củng mạc và mống mắt/đồng tử bằng Biến đổi Hough tròn. Đạo hàm theo hướng ngang giúp tìm mí mắt, đạo hàm hướng dọc giúp tìm biên ngoài của mống mắt.
- Nhận dạng tai
- Vân tay: Trích xuất các đường vân (ridges) và các điểm đặc trưng (minutiae) thông qua việc nhị phân hóa và làm mảnh (thining).
