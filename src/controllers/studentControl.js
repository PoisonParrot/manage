const path = require('path')
const xtpl = require('xtpl')
const MongoClient = require('mongodb')


exports.getListPage = (req, res) => {
    // console.log('首页');
    const url = 'mongodb://localhost:27017';
    const dbName = 'manage';
    const keyword = req.query.keyword || ""
    MongoClient.connect(url, function (err, client) {
        console.log("数据库连接成功");
        const db = client.db(dbName);
        const collection = db.collection('studentInfo');
        collection.find({name: {$regex: keyword}}).toArray(function (err, docs) {
            console.log("查找文件");
            console.log(docs)
            xtpl.renderFile(path.join(__dirname, "../views/list.html"), {
                studentList: docs,
                keyword
            }, (err, content) => {
                client.close();
                res.send(content);

            });
            // mongoimport -d manage -c student --file filename --headerline --type json/csv -f studentInfo.json
        });
    })

}

