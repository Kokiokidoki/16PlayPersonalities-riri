# 16PlayPersonalities診断

あなたの遊び方の性格タイプを診断するWebアプリケーションです。

## 概要

80個の質問に答えることで、32種類の遊びの性格タイプに分類される診断アプリケーションです。MBTI（Myers-Briggs Type Indicator）をベースに、遊びの場面に特化した独自の診断システムを構築しています。

## 特徴

- **80個の詳細な質問**: 遊びの場面に特化した質問で精度の高い診断
- **32種類のタイプ**: 遊びの戦略家、共感者、実践者、開拓者の4グループに分類
- **レスポンシブデザイン**: PC・スマートフォン両対応
- **クライアントサイド完結**: サーバー不要でブラウザ内で完結
- **完全無料**: 何度でも診断可能

## ファイル構成

```
riri/
├── index.html          # トップページ
├── diagnosis.html      # 診断ページ
├── result.html         # 結果ページ
├── style.css           # スタイルシート
├── main.js             # メインJavaScript
├── questions.json      # 質問データ（80問）
├── results.json        # 診断結果データ（32タイプ）
└── README.md           # このファイル
```

## 使用方法

1. `index.html`をブラウザで開く
2. 「診断を始める」ボタンをクリック
3. 80個の質問に7段階評価で回答
4. 「結果を見る」ボタンをクリック
5. 診断結果を確認

## 技術仕様

### 使用技術
- HTML5
- CSS3
- JavaScript (ES6+)

### フレームワーク・ライブラリ
- 使用禁止（プレーンなJavaScriptのみ）

### データ形式
- JSON形式で質問・結果データを管理
- 動的なデータ読み込み

### 診断ロジック
1. **スコアリング**: 10個の次元（E, I, N, S, T, F, J, P, A, T_resilience）でスコア計算
2. **タイプ判定**: 5つの次元で比較し、タイプコード生成
3. **結果表示**: 32種類のタイプから該当する結果を表示

### タイプ分類
- **遊びの戦略家**: INTJ, INTP, ENTJ, ENTP
- **遊びの共感者**: INFJ, INFP, ENFJ, ENFP
- **遊びの実践者**: ISTJ, ISFJ, ESTJ, ESFJ
- **遊びの開拓者**: ISTP, ISFP, ESTP, ESFP

各タイプにA（Assertive）とT（Turbulent）の2つのサブタイプが存在し、合計32種類のタイプに分類されます。

## 開発者向け情報

### ローカル開発環境での実行
1. ファイルをローカルにダウンロード
2. Webサーバーを起動（CORS対策のため）
3. ブラウザでアクセス

### 外部公開方法

#### 1. GitHub Pages（推奨）
```bash
# GitHubにリポジトリを作成
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/16play-personalities.git
git push -u origin main

# GitHub Pagesを有効化
# Settings > Pages > Source: Deploy from a branch > Branch: main
```

#### 2. Netlify
1. [Netlify](https://netlify.com)にアカウント作成
2. ファイルをドラッグ&ドロップでアップロード
3. 自動的にURLが生成される

#### 3. Vercel
1. [Vercel](https://vercel.com)にアカウント作成
2. GitHubリポジトリと連携
3. 自動デプロイ

#### 4. ngrok（一時的な公開）
```bash
# ngrokをインストール
brew install ngrok

# ローカルサーバーを起動
python3 -m http.server 8000

# 別のターミナルでngrokを起動
ngrok http 8000
```

### カスタマイズ
- `questions.json`: 質問の追加・編集
- `results.json`: 診断結果の編集
- `style.css`: デザインのカスタマイズ
- `main.js`: 診断ロジックの修正

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 更新履歴

- v1.0.0: 初回リリース
  - 基本的な診断機能
  - 80問の質問セット
  - 32種類の診断結果
  - レスポンシブデザイン対応
- v1.1.0: ページ切り替え機能追加
  - 10問ごとのページ分割
  - ナビゲーション機能
  - 進捗管理の改善 