# Node.jsの公式イメージを使用
FROM node:20

# アプリケーションディレクトリを作成
WORKDIR /usr/src/app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# ポートの開放
EXPOSE 3000

# アプリの起動コマンド
CMD [ "npm", "start" ]
