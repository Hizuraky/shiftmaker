<div align="center">
   <img src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/Logo.png" alt="ShiftMaker Logo" width="600"/>
</div>


### 環境
- node: v16.13.2

<br />


### ローカルサーバー起動
1. .env.example -> .envにrename
2. `$ yarn `で依存関係インストール
3. .envにhasura情報 + firebase情報を記述
4. `$ yarn dev `で` localhost:3000 `で起動
   
**※ローカルでもfirebaseとhasuraの情報がないとエラーが出ます。**

<br />

### ディレクトリ
```
.
├── README.md
├── api
├── app
│   ├── components
│   │   ├── common
│   │   │   └── [共通汎用コンポーネント]
│   │   ├── layouts
│   │   │   └── [共通レイアウト]
│   │   ├── table
│   │   │   └── [各テーブル]
│   │   └── [各種コンポーネント]
│   │       
│   ├── graphql
│   │   ├── mutation.ts
│   │   └── query.ts
│   │       
│   ├── hooks
│   │   └── [各カスタムHooks]
│   │       
│   ├── root.tsx
│   ├── routes
│   │   └── [各画面]
│   │       
│   ├── styles
│   │   ├── generated.css
│   │   └── tailwind.css
│   │       
│   └── utils
│       └── [諸々]
│   
├── firebase.json
├── functions
│   └── [cloud functions関連]
│   
├── package-lock.json
├── package.json
├── public
│   └── [ビルド関連]
│
├── remix.env.d.ts
├── tsconfig.json
└── yarn.lock

```

