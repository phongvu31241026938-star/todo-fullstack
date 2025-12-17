# Giai đoạn 1: Dùng Maven để xây dựng ứng dụng (Build)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
# Tạo file .jar và bỏ qua bước test để cho nhanh
RUN mvn clean package -DskipTests

# Giai đoạn 2: Dùng Java để chạy ứng dụng (Run)
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
# Lấy file .jar từ giai đoạn 1 ném sang đây
COPY --from=build /app/target/*.jar app.jar
# Mở cổng 8080
EXPOSE 8080
# Lệnh chạy
ENTRYPOINT ["java","-jar","app.jar"]