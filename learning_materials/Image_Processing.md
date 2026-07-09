# Image Processing

Xử lý ảnh cung cấp các nền tảng về ách máy tính hiểu, thao tác và biến đổi dữ liệu hình ảnh, vốn là bowcs chuẩn bị quan trọng trong các hệ thống xác thực sinh trắc học. 


## Biểu diễn ảnh số (Digital Image Representaion)

- Ma trận điểm ảnh: Máy tính nhìn nhận hình ảnh như một ma trận các điểm ảnh (pixels). Một ảnh kích thước NxN sẽ là một ma trận tương ứng, trong đó mỗi pixel mang một giá trị cường độ.

-  Các lọai ảnh chính:
	- Ảnh nhị phân (Binary): Mỗi pixel chỉ có 2 giá trị {0,1} tương ứng với 1 bit.
	- Ảnh xám (Gray): Cường độ pixel nằm trong khoảng (8bits/1byte), với 0 là đen và 255 là trắng.
	- Ảnh màu: Thường biểu diện trong không gian RGB (3 bytes mỗi pixel), ngoài ra còn các không gian màu khác như HSV, Lab, YUV.

## Các phép biến đổi ảnh (Point Processing)

Đây là các phép biến đổi cô lập (isolated), nghĩa là giá trị pixel mới chỉ phụ thuộc vào chính giá trị của nó tại vị trí đó mà không phụ thuộc vào các pixel lân cận.

**Ứng dụng**: Tăng cường độ tương phản, cân bằng lược đồ xám (histogram equalization) và đặc biệt là phân ngưỡng (thresholding) để chuyển ảnh xám sang ảnh nhị phân dựa trên một giá trị ngưỡng (t).

## Lọc không gian và Phép cuộn (Spatial Filtering & Convolution)

- Nguyên lý: Giá trị mới của một pixel được tính toán dựa trên giá trị của chính nó và các pixel lân cận thông qua một ma trận trọng số gội là Kernel (hoặc Mask/Filter)
- Công thức: Giá trị pixel mới là tổng trọng số của các pixel lân cận: `(I' = I * K)`
- Mục đích: Dùng để làm mịn ảnh (smoothing), làm sắc nét (sharpening), đo cấu trúc bề mặt (texture) hoặc khử nhiễu (denoising). Ví dụ, lọc Gabor là một phương pháp lọc theo ngữ cảnh hiệu quả để tăng cường chất lượng ảnh vân tay.

## Các phép toán số học và Logic trong ảnh

- Phép toán số học: Bao gồm cộng ảnh (để chồng ảnh) và trừ ảnh (để phát hiện chuyển động và sự thay đổi). Giá trị pixel sau khi cộng được giới hạn tối đa là 255: `(R(x,y) = Min(f(x,y) + g(x,y); 255)`
- Phép toán loic: Sử dụng cấc phép AND, OR kết hợp với mặt nạ (mask) để trích xuất hoặc đánh dấu vùng quan tâm (Region of Interest - ROI).

## Xử lý hình thái học (Morphological Operations)

Đây là các phép toán dựa trên hình dạng, sử dụng một phần tử cấu trúc (structuring elemenet) để quét qua ảnh nhị phận:

- Dilation (Giãn): Mở rộng các thành phân liên thông, làm đầy các lỗ hổng và phát triển các đặc trưng.
- Erosion (Co): Thu nhỏ các đặc trưng, laoij bỏ các nhánh nhỏ, cầu nối hoặc nhiễu.
- Các phép toán kết hợp khác bao gồm Opening (mở) và Closing (đóng).

## Biến đổi ảnh trong miền tần số (Image Transform)

Sử dụng biến đổi Fourier (FFT) để chuyển ảnh từ miền không gian ((x,y)) sang miền tần số ((u,v)).

- Ưu điểm: Phép cuộn (convolution) phực tạp trong miền không gian sẽ trở thành phép nhân đơn giản trong miền tàn số.

- Bộ lọc tần số:
	- Low-pass filter: Giữ lại tần số thấp (trung tâm), là mờ ảnh.
	- High-pass filter: Giữ lại tần số cao, giúp trích xuất các đường biên và chi tiết sắc nét.