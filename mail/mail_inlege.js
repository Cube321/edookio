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
            <p>Ahoj!<p>
            <p>Tvá registrace na portálu InLege byla úspěšná! Věříme, že se InLege zařadí mezi nástroje a pomůcky, které při studiu práva používáš pravidelně.</p>
            <p>S pozdravem <br />Tým InLege</p>
        `
      };
    //send the mail
    sgMail.send(msg, function(err) {
        if(err){
          console.log(err);}      
      });
};

//info mail to admin mail - registration of a new user
mail.adminInfoNewUser = function(newUser, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: process.env.ADMIN_MAIL,
      subject: `Zaregistroval se nový uživatel: ${newUser.email}`,
      html: `
          <h3>Registrace nového uživatele</h3>
          <p>Zaregistroval se nový uživatel:<p>
          <p>Jméno: ${newUser.firstname}</p>
          <p>Příjmení: ${newUser.lastname}</p>
          <p>Email: ${newUser.email}</p>
          <p>Datum registrace: ${newUser.dateOfRegistration}</p>
          <p>Premium: ${newUser.isPremium}</p>
          <p>Stripe ID: ${newUser.billingId}</p>
          <p>Plán předplatného: ${newUser.plan}</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//subscription created e-mail
mail.subscriptionCreated = function(email, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: email,
      subject: "Služby Premium aktivovány",
      html: `
          <h3>Služby Premium aktivovány</h3>
          <p>Ahoj!<p>
          <p>Na základě Tvé objednávky a platby jsme Ti aktivovaly služby Premium. Nyní máš přístup ke stovkám prémiových kartiček.</p>
          <p>S pozdravem <br />Tým InLege</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//info mail to admin mail - subscription activated
mail.adminInfoNewSubscription = function(user, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: process.env.ADMIN_MAIL,
      subject: `Uživatel aktivoval Premium: ${user.email}`,
      html: `
          <h3>Aktivace předplatného Premium</h3>
          <p>Tento uživatel aktivoval balíček Premium:<p>
          <p>Jméno: ${user.firstname}</p>
          <p>Příjmení: ${user.lastname}</p>
          <p>Email: ${user.email}</p>
          <p>Datum registrace: ${user.dateOfRegistration}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${user.endDate}</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//subscription updated e-mail
mail.subscriptionUpdated = function(email, endDate, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: email,
      subject: "Služby Premium prodlouženy",
      html: `
          <h3>Služby Premium prodlouženy</h3>
          <p>Ahoj!<p>
          <p>Tvé předplatné bylo prodlouženo do ${endDate}.</p>
          <p>S pozdravem <br />Tým InLege</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//info mail to admin mail - subscription updated
mail.adminInfoSubscriptionUpdated = function(user, endDate, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: process.env.ADMIN_MAIL,
      subject: `Uživatel prodloužil Premium: ${user.email}`,
      html: `
          <h3>Prodloužení předplatného Premium</h3>
          <p>Tento uživatel prodloužil balíček Premium:<p>
          <p>Jméno: ${user.firstname}</p>
          <p>Příjmení: ${user.lastname}</p>
          <p>Email: ${user.email}</p>
          <p>Datum registrace: ${user.dateOfRegistration}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${endDate}</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

mail.subscriptionCanceled = function(email, endDate, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: email,
      subject: "Předplatné ukončeno",
      html: `
          <h3>Tvé předplatné Premium na InLege bylo ukočeno</h3>
          <p>Ahoj!<p>
          <p>Tvé předplatné bylo ukočeno. Další platby Ti již nebudou strženy. Premium můžeš využívat do konce zaplaceného obdoví, tedy do ${endDate}.</p>
          <p>S pozdravem <br />Tým InLege</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//info mail to admin mail - subscription canceled
mail.adminInfoSubscriptionCanceled = function(user, endDate, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: process.env.ADMIN_MAIL,
      subject: `Uživatel ukončil Premium: ${user.email}`,
      html: `
          <h3>Ukončení předplatného Premium</h3>
          <p>Tento uživatel ukončil balíček Premium:<p>
          <p>Jméno: ${user.firstname}</p>
          <p>Příjmení: ${user.lastname}</p>
          <p>Email: ${user.email}</p>
          <p>Datum registrace: ${user.dateOfRegistration}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${endDate}</p>
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
          <p>S pozdravem <br />Tým InLege</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//email for all users
mail.sendEmergencyEmail = function(email, subject, text, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: email,
      subject: subject,
      html: `${text}`
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log('---ERROR--- Nepodarilo se odeslat e-mail z /admin/email');
        console.log(err);}      
    });
};

//email for subscribed users
mail.sendEmailToSubscribedUsers = function(email, subject, text, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: email,
      subject: subject,
      html: `${text}
              <br />
              <p style="font-size:0.8rem;color=grey">Odhlásit se z odběru informačních e-mailů můžete <a href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>`
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log('---ERROR--- Nepodarilo se odeslat e-mail z /admin/email');
        console.log(err);}      
    });
};

module.exports = mail;