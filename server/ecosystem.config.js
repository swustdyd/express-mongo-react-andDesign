module.exports = {
    apps : [{
        name: 'app-production',
        script: 'dist/app.js',
        watch: ['dist'],
        env: {
            'NODE_ENV': 'production'
        },
        ignore_watch: ['[\/\\]\./', 'node_modules'],
        max_memory_restart: '300M',
        instances: 4
    }]
}