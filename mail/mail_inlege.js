const  sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var mail = {};

//welcome e-mail
mail.welcome = function(email, callback){
    const msg = {
        from: {email:"info@inlege.cz", name: "InLege.cz"}, 
        to: email,
        subject: "Vítej na InLege",
        html: `
        <p style="font-family:Helvetica Neue">Ahoj,<p>
        <p style="font-family:Helvetica Neue">tvá registrace na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> byla dokončena! Doufáme, že se InLege zařadí mezi nástroje a pomůcky, které při studiu práva používáš pravidelně.</p>
        <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
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
          <p>Fakulta: ${newUser.faculty}</p>
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: "Předplatné InLege Premium aktivováno",
      html: `
          <p style="font-family:Helvetica Neue">Ahoj,<p>
          <p style="font-family:Helvetica Neue">na základě tvé objednávky a platby jsme ti aktivovali předplatné Premium. Nyní máš přístup ke stovkám prémiových kartiček navíc.</p>
          <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: "Předplatné InLege Premium prodlouženo",
      html: `
          <p style="font-family:Helvetica Neue">Ahoj,<p>
          <p style="font-family:Helvetica Neue">tvé předplatné Premium bylo prodlouženo do ${endDate}.</p>
          <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
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

//subscription Premium granted by admin
mail.sendAdminGrantedPremium = function(email, endDate, callback){
  const msg = {
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: `Dárek: Předplatné InLege Premium aktivováno do ${endDate}`,
      html: `
      <p style="font-family:Helvetica Neue">Ahoj,<p>
      <p style="font-family:Helvetica Neue">na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> ti bylo právě administrátorem zdarma aktivováno předplatné Premium do ${endDate}! Užij si více než 2 500 opakovacích kartiček a další prémiové funkce.</p>
      <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: "Předplatné Premium ukončeno",
      html: `
          <p style="font-family:Helvetica Neue">Ahoj,<p>
          <p style="font-family:Helvetica Neue">tvé předplatné Premium bylo ukončeno. Další platby ti již nebudou účtovány. Premium můžeš využívat do konce zaplaceného období, tedy do ${endDate}. Většina obsahu InLege je pro tebe i nadále přístupná zdarma!</p>
          <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
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

//info mail when Premium actually ended (is send when user uses InLege after Premium expired)
mail.sendPremiumEnded = function(email, callback){
  const msg = {
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: `Předplatné InLege Premium právě skončilo`,
      html: `
      <p style="font-family:Helvetica Neue">Ahoj,<p>
      <p style="font-family:Helvetica Neue">tvé předplatné Premium na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> právě skončilo. I tak můžeš nadále zdarma využívat více než 1 500 opakovacích kartiček. Předplatné můžeš kdykoliv <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz/premium">obnovit</a>.</p>
      <p style="font-family:Helvetica Neue">S pozdravem <br />Tým <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege.cz</a></p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//send feedbacl
mail.sendFeedback = function(email, name, text, callback){
  const msg = {
      from: email, 
      to: 'jakubspacil@gmail.com',
      subject: "Zpětná vazba (formulář)",
      html: `
          <h3 style="font-family:Helvetica Neue">Uživatel ${name} (${email}) zasílá následující feedback prostřednictvím formuláře:</h3>
          <p style="font-family:Helvetica Neue">${text}</p>
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: data.email,
      subject: "Zapomenuté heslo",
      html: `
          <h3 style="font-family:Helvetica Neue">Zapomenuté heslo</h3>
          <p style="font-family:Helvetica Neue">Své heslo můžeš změnit po kliknutí na tento odkaz: <a href="https://www.inlege.cz${data.link}">https://www.inlege.cz${data.link}</a></p>
          <p style="font-family:Helvetica Neue">S pozdravem <br />Tým InLege</p>
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
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
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: subject,
      html: `${text}
              <br />
              <p style="font-size:0.8rem;color=grey;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>`
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log('---ERROR--- Nepodarilo se odeslat e-mail z /admin/email');
        console.log(err);}      
    });
};

//email test
mail.sendTestEmail = function(email, subject, text, callback){
  const msg = {
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: email,
      subject: subject,
      html: `${text}
              <br />
              <p style="font-size:0.8rem;color=grey;font-family: Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>`
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log('---ERROR--- Nepodarilo se odeslat e-mail z /admin/email');
        console.log(err);}      
    });
};

//account deleted - admin info mail
mail.adminInfoUserDeleted = function(userEmail, callback){
  const msg = {
      from: "info@inlege.cz", 
      to: process.env.ADMIN_MAIL,
      subject: `Uživatel zrušil účet: ${userEmail}`,
      html: `Uživatel zrušil účet: ${userEmail}`
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

module.exports = mail;