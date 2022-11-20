const  sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var mail = {};

//welcome e-mail
mail.welcome = function(email, callback){
    const msg = {
        from: "info@inlege.cz", 
        to: email,
        subject: "Vítej v InLege",
        html: `
            <h3>Vítej na InLege</h3>
            <p>Tvá registrace na portálu InLege byla úspěšná!</p>
        `
      };
    //send the mail
    sgMail.send(msg, function(err) {
        if(err){
          console.log(err);}      
      });
};

//forgotten password - change link
mail.forgottenPassword = function(data, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: data.email,
      subject: "Zapomenuté heslo",
      html: `
          <h3>Zapomenuté heslo</h3>
          <p>Své heslo můžeš změnit po kliknutí na tento odkaz: <a href="https://www.inlege.cz${data.link}">https://www.inlege.cz${data.link}</a></p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};


//contact form e-mail
mail.sendQuestion = function(data, callback){
    const msg = {
        from: "postak@chilero.cz", 
        reply_to: data.email,
        to: "info@chilero.cz", // adresa pro zaslani otazky z become_owner page
        subject: "Chilero | Nový dotaz od zájemce o inzerci",
        //text: "Máte novou zprávu od: " + data.email + "\n tel: " + data.phone + " text: " + data.message,
        html: `<p><strong>Nový dotaz od zájemce o inzerci</strong></p>
               <p>
                  Odesílatel: ${data.name}
                  <br />
                  E-mail: ${data.email}
                  <br />
                  Telefon: ${data.phone}
               </p>
               <p style="white-space: pre-line ">
                  ${data.message}
               </p>
        `
      };
    //send the mail
    sgMail.send(msg, function(err) {
            callback(err);
      });
};

module.exports = mail;