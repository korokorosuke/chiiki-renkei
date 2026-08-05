<div align="center">
<h1>地域連携システム</h1>
</div>

# 機能一覧
1. 紹介管理
2. 逆紹介管理
3. 返事管理
4. 問合せ管理
5. 施設管理
6. 活動記録
7. Web予約（アルファ）
8. Web問診（アルファ）


# 対応データベース
1. Deno KV
2. PostgreSQL


# 環境変数
1. RECO_SESSION: セッションキー (create.batで設定)
2. RECO_SECRET: シークレット (create.batで設定)
3. RECO_PRODUCTION: 本番環境かどうか（production/dev）

### データベースがpostgresqlの場合、以下の環境変数を設定
1. RECO_DB_TYPE: データベースの種類（postgresql）
2. RECO_DB_URL: データベースの接続文字列（postgres://user:password@hostname/dbname）


# デモ環境
[デモ環境 リンク](https://chiiki-renkei.korokorosuke.deno.net/login/demo)


# データベースの切り替え
## PostgreSQL
  1. src\server\infra\allRepository.ts内のインポート元を、「./rdb/...Repository.ts」に変更
  2. 環境変数「RECO_DB_TYPE」に、「postgresql」を設定
  3. 環境変数「RECO_DB_URL」に、「postgresの接続文字列(postgres://user:password@hostname/dbname)」を設定
  4. 以下コマンドを実行
     ```bash
     deno run drizzle generate
     deno run drizzle push
     deno run buildall
     ```