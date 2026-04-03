# Lessons

- ユーザーから「テストが必須」と明示されたら、unit test だけで終えず、要求された検証レベルまで自動テストを追加してから完了扱いにする。
- canvas / animation 系の変更では、状態遷移の unit test と実ブラウザ smoke test を最初から計画に入れる。
- ファイル移設が目的の変更では、内容変更を混ぜない。移設後に元ファイルとの差分を確認し、実質 rename になっていることを確認してから完了扱いにする。
- コンテンツ構造や scene 切り替え単位は、実装都合で細かく分解しない。記事単位・ページ遷移単位など、ユーザーが指定した編集モデルを source of truth にする。
- animation / shader の time は「何を起点に進むべきか」を先に固定する。runtime 単位の都合で clock semantics を決めず、ユーザーが指定した基準時間を controller と debug 名に反映する。
