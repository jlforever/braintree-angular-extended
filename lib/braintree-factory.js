function braintreeFactory (braintree) {
  return function braintreeAngular (clientTokenPath, $http) {
    var $braintree = {}

    $braintree.clientToken = null

    Object.keys(braintree).forEach(function (key) {
      $braintree[key] = braintree[key]
    })

    $braintree.getClientToken = function (params) {
      var path = clientTokenPath

      if (params) {
        // TODO: Use a library for this
        path += '?'
        path += Object.keys(params).map(function (key) {
          var value = params[key]
          return key + '=' + value
        }).join('&')
      }

      return $http.get(path)
    }

    $braintree.setupDropin = function (options) {
      $braintree.getClientToken()
        .then(function (token) {
          braintree.setup(token.data, 'dropin', options)
        })
        .catch(function (err, status) {
          console.error('error fetching client token at ' + clientTokenPath, err.data, status)
        })
    }

    $braintree.setupPayPal = function (options) {
      $braintree.getClientToken()
        .then(function (token) {
          braintree.setup(token.data, 'paypal', options)
        })
        .error(function (err, status) {
          console.error('error fetching client token at ' + clientTokenPath, err.data, status)
        })
    }

    return $braintree
  }
}

module.exports = braintreeFactory
