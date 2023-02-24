const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'kuchhbhi',
    db: 'codeial_development',
    stmp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '	dummymailused@gmail.com',
            pass: 'Prakash@123'
        }
    },
    google_client_id: "158675787889-hpd7s4mp73gpa6c1mmpgsrsnml85ga1m.apps.googleusercontent.com",
    google_client_Secret: "vQ8zCzN-5KmtkPOR1aW6jx25",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_secretkey: 'codieal',
}


const production = {
    name: process.env.CODEIAL_ENV,
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.session_cookie_key,
    db: process.env.db,
    stmp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.Google_user,
            pass: process.env.Google_password
        }
    },
    google_client_id: process.env.google_client_id,
    google_client_Secret: process.env.google_client_Secret,
    google_callback_URL: process.env.google_callback_URL,
    jwt_secretkey: process.env.jwt_secretkey
}
module.exports = eval(process.env.CODEIAL_ENV) == undefined ? development : eval(process.env.CODEIAL_ENV)
    // module.exports = development;