# 対応データベース
- Deno KV
- PostgreSQL


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