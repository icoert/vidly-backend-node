const config = require('config');

module.exports = function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('Fatal error: jwtPrivateKey is not defined.')
    }

    // Configuration
    console.log(`Application name: ${config.get('name')}`)
    // console.log(`Mail Server: ${config.get('mail.host')}`)
    // console.log(`Mail Password: ${config.get('mail.password')}`)
}