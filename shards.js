const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const dotenv = require('dotenv');
dotenv.config();

const shardManager = new ShardingManager(
    './src/cool.js',
{
    token: process.env.TOKEN,
    shards: 'auto',
});

shardManager.on('shardCreate', (shard) => {
    console.log(chalk.blue, chalk.bgBlue('[SHARDS]: '), chalk.bold(`Launched shard: ${shard.id}`))
})

shardManager.spawn();