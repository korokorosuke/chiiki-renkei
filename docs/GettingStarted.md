
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