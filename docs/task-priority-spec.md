# Tài liệu Đặc tả Tính năng Độ ưu tiên Task

## Tổng quan

Cho phép người dùng thiết lập độ ưu tiên (Priority) cho từng task, giúp quản lý các task quan trọng dễ dàng hơn. Hỗ trợ lọc và sắp xếp dựa trên độ ưu tiên.

## Mục đích

- Giúp người dùng nắm bắt và sắp xếp độ quan trọng của task một cách dễ dàng
- Cho phép tập trung vào các task có độ ưu tiên cao

## Cấp độ ưu tiên

Sử dụng 4 cấp độ ưu tiên sau:

- **low** (thấp)
- **medium** (bình thường)
- **high** (cao)
- **urgent** (khẩn cấp)

## Thay đổi Data Model

Thêm trường "priority" vào dữ liệu task, cho phép thiết lập các cấp độ ưu tiên trên. Giá trị mặc định là `medium`.

## Đặc tả API

### Chỉ định độ ưu tiên khi tạo/cập nhật:

- Khi tạo task (POST) và cập nhật (PUT), có thể chỉ định độ ưu tiên
- Nếu không chỉ định, sẽ thiết lập giá trị `medium`

### Lọc theo độ ưu tiên:

- Khi lấy danh sách task (GET), có thể lọc theo độ ưu tiên
- Có thể chỉ định nhiều độ ưu tiên cách nhau bằng dấu phẩy

## Hiển thị UI

Sử dụng nhãn và phân loại màu sắc theo độ ưu tiên để dễ nhận biết trực quan. Tuy nhiên, biểu diễn trực quan sẽ được điều chỉnh ở phía thiết kế.

## Validation

- Chỉ chấp nhận các giá trị: `low`, `medium`, `high`, `urgent`
- Trả về lỗi response khi chỉ định giá trị không hợp lệ

## Các tính năng mở rộng trong tương lai

- Thiết lập thông báo dựa trên độ ưu tiên (ví dụ: thông báo trước hạn với task `urgent`)
- Tính năng ghi lại lịch sử thay đổi độ ưu tiên (cho mục đích kiểm tra/log)
