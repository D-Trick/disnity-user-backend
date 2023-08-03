module.exports = {
    apps: [
        {
            name: 'disnity-user-backend',
            script: './dist/app.js',

            instances: 0,
            exec_mode: 'cluster',
            wait_ready: true,
            listen_timeout: 50000,
            kill_timeout: 5000,

            time: true,
            merge_logs: true,
            log_file: 'logs/pm2/log.log',
            out_file: 'logs/pm2/out.log',
            error_file: 'logs/pm2/error.log',
        },
    ],
};
