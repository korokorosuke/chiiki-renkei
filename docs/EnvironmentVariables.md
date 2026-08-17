# 環境変数
- RECO_SESSION: セッションキー (32byteのランダム値をbase64でエンコードした文字列)
- RECO_SECRET: シークレット (32byteのランダム値をbase64でエンコードした文字列)
- RECO_PRODUCTION: 本番環境かどうか (production/dev)

### 外部連携をする場合
- RECO_ADDRESS_URL: 住所取得用URL
- RECO_PATIENT_URL: 患者情報取得用URL

### データベースがDeno KVの場合
- RECO_KV_URL: データベースのファイルパス (Deno Deployでは、設定しない。それ以外の環境はファイルパス)

### データベースがpostgresqlの場合
- RECO_DB_TYPE: データベースの種類 (postgresql)
- RECO_PG_URL: データベースの接続文字列 (postgres://user:password@hostname/dbname)