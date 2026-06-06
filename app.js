const express = require('express');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const app = express();
const PORT = 3000;

// データベースの初期化（永続化ファイル database.db を作成）
const db = new Database('database.db');
db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        message TEXT
    )
`).run();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookieを使用するための設定

// チャット画面の表示（Read）
app.get('/', (req, res) => {
    // Cookieの利用: 訪問回数をカウント
    let visits = parseInt(req.cookies.visits || '0', 10);
    visits++;
    res.cookie('visits', visits, { maxAge: 900000, httpOnly: true }); // 15分間有効なCookie

    // DBからデータを取得
    const chats = db.prepare('SELECT * FROM chats ORDER BY id DESC').all();
    
    res.render('index', { chats: chats, visits: visits });
});

// メッセージの投稿（Create）
app.post('/send', (req, res) => {
    const name = req.body.name || "名無しさん";
    const message = req.body.message;
    
    // DBへの保存
    const insert = db.prepare('INSERT INTO chats (name, message) VALUES (?, ?)');
    insert.run(name, message);
    
    res.redirect('/');
});

// メッセージの削除（Delete）
app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    
    // DBからの削除
    db.prepare('DELETE FROM chats WHERE id = ?').run(id);
    
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
