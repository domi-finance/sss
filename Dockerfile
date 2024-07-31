# 使用官方 Python 运行时作为父镜像
FROM python:3.8-slim

# 设置工作目录为 /app
WORKDIR /app

# 将当前目录的内容复制到容器中的工作目录中
COPY . /app

# 安装任何必要的包
RUN pip install --no-cache-dir -r requirements.txt

# 使端口 80 可供容器外部访问
EXPOSE 80

# 在启动容器时运行 app.py 应用程序
CMD ["python", "main.py"]