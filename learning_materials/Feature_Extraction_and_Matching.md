# Feature Extraction and Matching (Chapter 3.2)

Trích xuất đặc trưng (Feature Extraction) và So khớp (Matching) là bước then chốt để chuyển đổi dữ liệu hình ảnh thô thành thông tin định danh có thể so sánh được trong các hệ thống sinh trắc học.

## Trích xuất đặc trưng

Mục tiêu của bước này là tạo ra một vector đặt trưng (feature vector) từ dữ liệu đã qua tiền xử lý, sau đó lưu trữ dưới dạng khuôn mẫu (template) trong quá trình đăng ký.

Các loại đặc trưng: 
- Đặc trưng toàn cục (Global feaures): Mô tả toàn bộ đối tượng trên các thuộc tính như màu sắc, hình dạng hoặc cấu trúc bề mặt (texture). Ví dụ: Moment bất biến (Hu, Zernike), HOG (Histogram Oriented Gradients).
- Đắc trưng cục bộ (Local features): Tập trung mô tả vùng ảnh nhỏ xung quanh các điểm chính (key points) của đối tượng. Ví dụ tiêu biểu gồm: SIFT, SURF, LBP, BRISK.

Tính chất yêu cầu: Các bộ mô tả cục bộ cần phải bất biến (invariant), nghĩa là không thay đổi trước các phép biến đổi hình học (xoay, dịch chuyển, thu phóng), thay đổi góc nhìn camera hoặc điều kiện chiếu sáng.

Phân tích cấu trúc bề mặt (Texture features): Thường được dụng trong nhận dạng khuôn mặt và mống mắt. Các phương pháp bao gồm thống kê histogram (trung bình, phương sai, entropy), ma trận đồng xuất mức xám (GLCM) với các tham số Haralick, hoặc bộ lọc Gabor.

## So khớp đặc trưng (Feature Matching)

Đây là quá trình xác định độ tương đồng giữa đặc trưng của mẫu truy vấn và mẫu đã lưu trong cơ sở dữ liệu
- Các phép đo khoảng cách: Để só sánh hai bộ mô tả, hệ thống thường sử dụng các hàm khoảng cách như L1, L2 (Euclidean), Cosine hoặc Mahalanobis.
- Chiến lược so khớp phổ biến:
  - Brute-force matching: Thử tất cả các cặp đặc trưng để tìm cặp có khoảng cách nhỏ nhất.
  - Tỉ lệ khoảng cách (Ratio of distance): So sánh khoảnh cách của điểm khớp tốt nhất với điểm khớp tốt thứ hai. Nếu tỉ lệ này thấp (gần 0), cặp khớp đó được coi là đáng tin cậy; nếu gần bằng 1, đó là một cặp khớp mơ hồ và bị loại bỏ.
  - RANSAC: Kỹ thuật dùng để tinh chỉnh kết quả bằng cách loại bỏ các điểm khớp sia (outliers) thông qua việc ước lượng mô hình biến đổi hình học giữa hai ảnh.
- Đánh giá: Hiệu suất phụ thuộc vào việc chọn ngưỡng (threshold) để tối ưu số lượng khớp đúng (TP) và giảm thiểu khớp sai (FP).

## Ví dụ ứng dụng trong sinh trắc học

- Vân tay: Trích xuất các điểm chi tiết (minutiae) như nơi đường vân kết thúc hoặc chia nhánh (Level 2)
- Mống mắt: Dùng bộ lọc Gabor để trích xuất thoongn tin pha và mã hóa thành Iris Code nhị phân. So khớp bằng khoảng cách Hamming, kết hợp với các phép dịch chuyển bit để xử lý sai lệch do xoay mắt.
- Khuôn mặt: Sử dụng thuật toán PCA (Eigenfaces) để biểu diễn mặt trong không gian ít chiều hơn hoặc dùng các bộ mô tả texture như SIFT và LBP.
- Đa sinh trắc học:  Có thể kết hợp (fusion) ở mức trích xuất đặc trưng (nối các vector) hoặc mức điểm số so khớp (kết hợp các điểm tương đồng từ nhiều nguồn).
