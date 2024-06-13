const {MailerSend} = require('mailersend')
const fs = require('fs').promises;
const path = require('path')

const mailerSend = new MailerSend({
  apiKey: process.env.MAILSENDER_API_KEY
});

module.exports = {
  async sendEmail(req, res) {
    
    try {   
      const {userName, userEmail, subject, text} = req.body
    
      const recipients = [new MailerSend.Recipient(userEmail, userName)];
      const sender = new MailerSend.Sender("MS_RywBxA@trial-jy7zpl9x7n0l5vx6.mlsender.net", "MyRifiuti")

      //Creazione del path assoluto per il file di template
      const templatePath = path.join(__dirname, '../template.html');
      let htmlTemplate = await fs.readFile(templatePath, 'utf-8')

      //Sostituzione del placeholder per personalizzare la mail
      htmlTemplate = htmlTemplate.replace('{{text}}', text);

      const emailParams = new MailerSend.EmailParams()
        .setFrom(sender)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(htmlTemplate);
        

      await mailerSend.email.send(emailParams);

      console.log('mando una mail a' + userName + 'con scritto' + subject + text)
      res.status(201).json( {message: 'Email sent successfully'} )
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}




