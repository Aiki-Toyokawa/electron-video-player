## マークダウンプレビュー
win+k → v

## やることリスト
- 自動再生
- シャッフル再生
- 並び替え(フォルダ・ファイル)
- フォルダ機能
- コピー機能
- 削除機能
- ダウンロード進捗
- オプションページ
- フッターで再生されてるやつ表示
  

## 遷移
- index.html (ルーティングファイル)
  - Home画面
  - 音楽プレイヤー画面
  - 音楽dl画面
  - 
## フォルダ構成
- node_modules
- assets
  - icons
  - imgs
- dl (動画フォルダ)
  - 各動画フォルダ (動画ID)
    - info.json
    - music.mp4
    - thumbnail.png
- pages
  - home.html
  - player.html
  - download.html
- index.html (pagesへのルーティングファイル)
- main.js (エントリーポイント)
- package.json
- package-lock.json
- .gitignore 

## jsonファイル記述
日付、フォルダー所属とフォルダー内のナンバー、タイトル、アーティスト、アルバム、トラック番号、ジャンル、年、コメント