module.exports = {
  database:
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@amazonclonewebapplication-shard-00-00-fe4ut.mongodb.net:27017,amazonclonewebapplication-shard-00-01-fe4ut.mongodb.net:27017,amazonclonewebapplication-shard-00-02-fe4ut.mongodb.net:27017/test?ssl=true&replicaSet=amazonclonewebapplication-shard-0&authSource=admin&retryWrites=true&w=majority`,
  port: 3030,
  secret: `${process.env.SECRET}`,
};
