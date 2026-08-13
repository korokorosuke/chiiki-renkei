<div align="center">
<h1>地域連携システム</h1>
</div>

# 機能一覧
- 紹介管理
- 逆紹介管理
- 返事管理
- 問合せ管理
- 施設管理
- 活動記録
- Web予約（アルファ）
- Web問診（アルファ）


# 対応データベース
- Deno KV
- PostgreSQL


# Getting Started
1. [Deno](https://docs.deno.com/runtime/getting_started/installation/)をインストール
1. ソースのダウンロード(gitがインストールされていない場合は、[こちら](https://git-scm.com/install/windows)よりダウンロード)
   ```bash
   git clone https://github.com/korokorosuke/chiiki-renkei.git
   ```
1. モジュールのダウンロード
   ```bash
   deno install
   ```
1. 環境変数を設定
    - RECO_SESSION: セッションキー (windowsは、createsecret.batで設定)
    - RECO_SECRET: シークレット (windowsは、createsecret.batで設定)
    - RECO_PRODUCTION: `production`
    - postgresqlの場合
      - RECO_DB_TYPE: `postgresql`
      - RECO_DB_URL: `postgres://user:password@hostname/dbname`
    - Deno KVの場合
      - RECO_DB_URL: `reco.db` (任意のファイルパス)
1. データベースを初期化
   ```bash
   echo -postgresqlの場合---
   deno run drizzle generate
   deno run drizzle push
   echo -------------------

   ./scripts/createdata.bat
   ```
1. アプリケーションのビルド
   ```bash
   deno run buildall
   ```
1. アプリケーションの実行
   ```bash
   deno run start
   ```


# 環境変数
- RECO_SESSION: セッションキー (32byteのランダム値をbase64でエンコードした文字列)
- RECO_SECRET: シークレット (32byteのランダム値をbase64でエンコードした文字列)
- RECO_PRODUCTION: 本番環境かどうか (production/dev)

### 外部連携をする場合
- RECO_ADDRESS_URL: 住所取得用URL
- RECO_PATIENT_URL: 患者情報取得用URL

### データベースがDeno KVの場合
- RECO_DB_URL: データベースのファイルパス (Deno Deployでは、設定しない。それ以外の環境はファイルパス)

### データベースがpostgresqlの場合
- RECO_DB_TYPE: データベースの種類 (postgresql)
- RECO_DB_URL: データベースの接続文字列 (postgres://user:password@hostname/dbname)


# デモ環境
[デモ環境 リンク](https://chiiki-renkei.korokorosuke.deno.net/login/demo)


# データベースの切り替え
## PostgreSQL
  1. src\server\infra\allRepository.ts内のインポート元を、「./rdb/...Repository.ts」に変更
  1. 環境変数「RECO_DB_TYPE」に、「postgresql」を設定
  1. 環境変数「RECO_DB_URL」に、「postgresの接続文字列(postgres://user:password@hostname/dbname)」を設定
  1. 以下コマンドを実行
     ```bash
     deno run drizzle generate
     deno run drizzle push
     deno run buildall
     ```