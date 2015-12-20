module.exports = function() {

  console.log('loaded routes module');

  // home
  app.route('/').get(function(req, res) {
    res.render('index');
  });

};