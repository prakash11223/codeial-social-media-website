const queue = require('../config/kue');
const sign = require('../mailer/sign_in_mailer');

queue.process('emails', function(job, done) {
    console.log('emails worker is processing a job', job.data);

    sign.newsign(job.data);
    done();
})