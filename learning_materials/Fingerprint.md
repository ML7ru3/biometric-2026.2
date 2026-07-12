# Fingerprint

Vân tay (Fingerprint) là một trong những đặc điểm sinh trắc học vật lý lâu đời và phổ biến nhất, được sử dụng để xác thực danh tính nhờ tính **duy nhất** và **bất biến**


## Đặc điểm cơ bản và Ý nghĩa sinh học

- Tính duy nhất: Vân tay của mỗi cá nhân là độc nhất, ngay cả đới với các cặp song sinh cùng trứng.
- Tính bất biến: Các đường vân tay không thay đổi theo thời gian.
- Cấu tạo: Bao gồm các đường vân (ridges), rãnh (furrows) và các lỗ chân lông (pores) trên bề mặt ngón tay.
- Mật độ: Trung bình nam giới trẻ tuổi có khoảng 20.7 đường vân/cm2, trong khi nữ giới có khoảng 23.4 đường vân/cm2.


## Ba cấp độ đặc trưng của vân tay (Feature Levels)

Các hệ thống nhận dạng của vân tay phân tích dữ liệu ở ba mức độ từ thô đến tinh:

- Cấp độ 1 (Toàn cục); Phân tích bản đồ và các điểm cực trị (Singular points) như Loop (vòng) và Delta (tam giác). Các mẫu vân chính bao gồm: Arch (vòm), Loop (chiếm 65%), Whorl (xoáy - chiếm 24%) và Twin loop.

- Cấp độ 2 (Chi tiết - Minutiae) (**IMPORTANT**): Tập trung vào các điểm mà đường vân kết thúc hoặc chia nhánh. Đây là cấp độ quan trọng nhất vì hầu hết các thuật toán so khớp hiện nay đều dựa trên **Minutiae**. Các loại điểm chi tiết bao gồm: 
    - Termination (kết thúc)
    - Bifurcation (chia nhánh)
    - Lake (hồ)
    - Spur (nhánh ngắn)

> **Minutiae** là các đặc điểm chi tiết của đường vân tay (ridge characteristic), đánh dấu những vị trí mà các đường vân bắt đầu, kết thúc, chia nhánh hoặc hợp nhất, đóng vai trò quan trọng nhất vì hầu hết các hệ thống nhận dạng vây tay tự động hiện nay đề dựa trên việc so khớp với các điểm này.

- Cấp độ 3 (Vi mô); Yêu cầu hình ảnh độ phân giải cao để thấy các chi tiết cực nhỏ như lỗ chân lông (pores), đường vân chưa trường thành (incipient ridge) hoặc các vết đứt gãy.


## Kỹ thuật thu thập vân tay (Acquisition)

- Ngoại tuyến (Offline): Phương pháp truyền thống dùng mực in trên giấy hoặc thu thập vân tay tiềm ẩn (latent fingerprint) bằng bột hoặc hóa chất tại hiện trường vụ án.
- Trực tuyến (Online): Sử dụng các loại cảm biến hiện đại
    - Quang học (Optical): Sử dụng nguyên lý phản xạ toàn phần (FTIR) để chụp ảnh.
    - Điện dung (Capacitance): Kích thước nhỏ, thường dùng trong laptop và điện thoại di động.
    - Siêu âm (Ultrasound): Có khả năng đọc xuyên qua màn hình điện thoại
    - Nhiệt (Thermal): Đo sự chênh lệch nhiệt độ giữa đường vân và rãnh vân khi tiếp xúc.

## Xử lý ảnh và So khớp (Processing & Matching)

- Tăng cường chất lượng ảnh: Do vân tay có thể bị mờ, khô hoặc có vết cắt. việc sử dụng lọc ngữ cảnh như **Gabor Filtering** là cực kì hiệu quả để làm rõ cấu trúc đường vân.
- Trích xuất đặc trưng: Ảnh sau khi xử lý được nhị phân hóa và thực hiện phép toàn hình thái hoặc làm mảnh (thining) để thu được khung xương (skeleton) của đường vân, từ đó xác định chính xác vị trí và hướng của các điểm Minutiae.
- So khớp: Quy trình bao gồm các bước:
    - Căn chỉnh (Alignment) để xử lý sai lệc do xoay/dịch chuyển ngón tay.
    - Ghép cặp (Pairing) các điểm tương đồng.
    - Tính toán điểm số (Scoring) để đưa ra quyết định