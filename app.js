const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let chats = [
    { id: 1, name: "システム", message: "チャットへようこそ！" }
];

app.get('/', (req, res) => {
    res.render('index', { chats: chats });
});

app.post('/send', (req, res) => {
    const newMessage = {
        id: Date.now(),
        name: req.body.name || "名無しさん",
        message: req.body.message
    };
    chats.push(newMessage);
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const targetId = parseInt(req.params.id);
    chats = chats.filter(chat => chat.id !== targetId);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
