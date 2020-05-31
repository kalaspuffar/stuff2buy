module.exports = {
    ci: {
      collect: {
        url: ['http://localhost:3000/'],
        startServerCommand: 'php -S localhost:3000',
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };