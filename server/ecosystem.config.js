module.exports = {
    apps : [{
        name: 'app-production',
        script: 'dist/app.js',
        watch: ['dist'],
        env: {
            'NODE_ENV': 'production'
        },
        ignore_watch: ['[\/\\]\./', 'node_modules'],
        max_memory_restart: '250M',
        instances: 'max',
        exec_mode: 'cluster',
        min_uptime: '60s',
        max_restarts: 30
    }]
}