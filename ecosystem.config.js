module.exports = {
  apps: [
    {
      name: 'rumer-ng',
      script: 'yarn',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      watch: false,
    },
  ],
};
