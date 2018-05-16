function Article (options) {
    return new Promise((resolve, reject) => {
        if(!options) options = {};
        this.title = options.title || 'Bomdi Zane';
        this.url = options.url || 'dzedock@gmail.com';
        this.text = options.text || 'DON\'T write to my gmail :)';

        resolve(options);
    });
}

module.exports = Article;
  
  