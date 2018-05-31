module.exports = {
    apps : [{
        name: 'app',
        script: './app.js',
        watch: true,
        env: {
            'NODE_ENV': 'production'
        },
        node_args: '--harmony'
    }]
}