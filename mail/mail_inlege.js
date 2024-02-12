const  sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var mail = {};

//welcome e-mail
mail.welcome = function(email, callback){
    const msg = {
        from: {email:"info@inlege.cz", name: "InLege.cz"}, 
        to: email,
        subject: "Vítej na InLege",
        html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
                <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                        <tbody>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítej na InLege!</h2> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">tvůj účet na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> byl vytvořen! Doufáme, že ti aplikace bude dobře sloužit a stane se tvým stálým parťákem při studiu práv.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege není jen vzdělávací platforma, ale také komunita mladých právníků. Přidej se k nám na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>, ať ti nic neuteče.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                        <tbody>
                                                            <tr> 
                                                                <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                        <tbody>
                                                                            <tr> 
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                        </div>
                                                                                    </div> 
                                                                                </td> 
                                                                            </tr> 
                                                                        </tbody>
                                                                    </table> 
                                                                </td> 
                                                            </tr> 
                                                        </tbody>
                                                    </table> 
                                                </td> 
                                            </tr>
                                        </tbody>
                                    </table> 
                                </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>
                <div style="box-sizing:border-box;clear:both;width:100%"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr style="font-size:12px"> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
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
          <p>Zdroj: ${newUser.source}</p>
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

//user requested invoice
mail.requestInvoice = function(email, invoiceNum){
    const msg = {
        from: "info@inlege.cz", 
        to: process.env.ADMIN_MAIL,
        subject: `Uživatel ${email} vyžádal ${invoiceNum}`,
        html: `
            Uživatel ${email} vyžádal zaslání faktury ${invoiceNum} na svůj e-mail.
        `
      };
    //send the mail
    sgMail.send(msg, function(err) {
        if(err){
          console.log(err);}      
      });
  };

//payment failed
mail.adminInfoSubscriptionPaymentFailed = function(user, paymentStatus, data){
const msg = {
    from: "info@inlege.cz", 
    to: process.env.ADMIN_MAIL,
    subject: `Platba uživatele ${user.email} selhala`,
    html: `
        Platba uživatele ${user.email} selhala. Předplatné bylo ukončeno.

        Payment status: ${paymentStatus}

        Data object: ${JSON.stringify(data)}
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
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
                <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                        <tbody>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Předplatné Premium aktivováno</h2> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">tvé předplatné InLege Premium bylo právě <strong>aktivováno</strong>! Nyní máš přístup k více než 1 000 prémiovým kartičkám a možnost kartičky si ukládat pomocí hvězdičky na později. Předplatné můžeš kdykoliv zrušit.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Snažíme se o to, aby InLege nebyla jen vzdělávací platforma, ale také komunita mladých právníků. Přidej se k nám na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>, ať ti nic neuteče.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                        <tbody>
                                                            <tr> 
                                                                <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                        <tbody>
                                                                            <tr> 
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                        </div>
                                                                                    </div> 
                                                                                </td> 
                                                                            </tr> 
                                                                        </tbody>
                                                                    </table> 
                                                                </td> 
                                                            </tr> 
                                                        </tbody>
                                                    </table> 
                                                </td> 
                                            </tr>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                        <p style="margin:0;margin-bottom:30px;padding-top:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">PS: InLege jsme spustili teprve v prosinci 2023 a určitě je ještě co vylepšovat. Pokud bys měl/a jakékoliv nápady a připomínky, neváhej prosím využít tlačítko "Zaslat feedback" v patičce webu. Díky!</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                        </tbody>
                                    </table> 
                                </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>
                <div style="box-sizing:border-box;clear:both;width:100%"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr style="font-size:12px"> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
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
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                      <tbody>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Předplatné Premium bylo prodlouženo</h2> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">tvé předplatné InLege Premium bylo právě <strong>prodlouženo</strong>. Jsme rádi, že se ti s námi líbí!</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Snažíme se o to, aby InLege nebyla jen vzdělávací platforma, ale také komunita mladých právníků. Přidej se k nám na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>, ať ti nic neuteče.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                  </div> 
                                              </td> 
                                          </tr> 
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                      <tbody>
                                                          <tr> 
                                                              <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                      <tbody>
                                                                          <tr> 
                                                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                  <div style="box-sizing:border-box">
                                                                                      <div>
                                                                                          <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                      </div>
                                                                                  </div> 
                                                                              </td> 
                                                                          </tr> 
                                                                      </tbody>
                                                                  </table> 
                                                              </td> 
                                                          </tr> 
                                                      </tbody>
                                                  </table> 
                                              </td> 
                                          </tr>
                                      </tbody>
                                  </table> 
                              </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>
              <div style="box-sizing:border-box;clear:both;width:100%"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr style="font-size:12px"> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div>`
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
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                      <tbody>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Dárek: Předplatné Premium bylo aktivováno</h2> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> ti bylo právě administrátorem <strong>zdarma</strong> aktivováno předplatné Premium do ${endDate}! Užij si více než 3 000 opakovacích kartiček a další prémiové funkce.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Snažíme se o to, aby InLege nebyla jen vzdělávací platforma, ale také komunita mladých právníků. S tím nám pomůžeš, když se k nám přidáš i na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                  </div> 
                                              </td> 
                                          </tr> 
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                      <tbody>
                                                          <tr> 
                                                              <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                      <tbody>
                                                                          <tr> 
                                                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                  <div style="box-sizing:border-box">
                                                                                      <div>
                                                                                          <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                      </div>
                                                                                  </div> 
                                                                              </td> 
                                                                          </tr> 
                                                                      </tbody>
                                                                  </table> 
                                                              </td> 
                                                          </tr> 
                                                      </tbody>
                                                  </table> 
                                              </td> 
                                          </tr>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                  </div> 
                                              </td> 
                                          </tr> 
                                      </tbody>
                                  </table> 
                              </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>
              <div style="box-sizing:border-box;clear:both;width:100%"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr style="font-size:12px"> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `
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
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                      <tbody>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Předplatné Premium bylo ukončeno</h2> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">tvé předplatné Premium bylo ukončeno. Další platby ti již nebudou účtovány. Premium můžeš využívat do konce zaplaceného období, tedy do ${endDate}. Většina obsahu InLege je pro tebe i nadále přístupná zdarma!</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Snažíme se o to, aby InLege nebyla jen vzdělávací platforma, ale také komunita mladých právníků. S tím nám pomůžeš, když se k nám přidáš i na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                  </div> 
                                              </td> 
                                          </tr> 
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                      <tbody>
                                                          <tr> 
                                                              <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                  <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                      <tbody>
                                                                          <tr> 
                                                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                  <div style="box-sizing:border-box">
                                                                                      <div>
                                                                                          <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                      </div>
                                                                                  </div> 
                                                                              </td> 
                                                                          </tr> 
                                                                      </tbody>
                                                                  </table> 
                                                              </td> 
                                                          </tr> 
                                                      </tbody>
                                                  </table> 
                                              </td> 
                                          </tr>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                  </div> 
                                              </td> 
                                          </tr> 
                                      </tbody>
                                  </table> 
                              </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>
              <div style="box-sizing:border-box;clear:both;width:100%"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr style="font-size:12px"> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `
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
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
                <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                        <tbody>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Předplatné Premium právě skončilo</h2> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">tvé předplatné Premium na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> právě skončilo. I tak můžeš nadále zdarma využívat více než 2 000 opakovacích kartiček. Předplatné můžeš kdykoliv <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz/premium">obnovit</a>.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti příjemné studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important" width="100%"> 
                                                        <tbody>
                                                            <tr> 
                                                                <td align="center" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px" valign="top"> 
                                                                    <table cellpadding="0" cellspacing="0" style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important"> 
                                                                        <tbody>
                                                                            <tr> 
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#ffffff;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Pustit se do studia</a>
                                                                                        </div>
                                                                                    </div> 
                                                                                </td> 
                                                                            </tr> 
                                                                        </tbody>
                                                                    </table> 
                                                                </td> 
                                                            </tr> 
                                                        </tbody>
                                                    </table> 
                                                </td> 
                                            </tr>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                    </div> 
                                                </td> 
                                            </tr> 
                                        </tbody>
                                    </table> 
                                </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>
                <div style="box-sizing:border-box;clear:both;width:100%"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr style="font-size:12px"> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div> `
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
      from: 'info@inlege.cz', 
      to: 'jakub@inlege.cz',
      subject: "Zpětná vazba (formulář)",
      html: `
          <p style="font-family:Helvetica Neue">Uživatel ${name} (${email}) zasílá následující feedback prostřednictvím formuláře:</p>
          <p style="font-family:Helvetica Neue">${text}</p>
      `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//send message from contact form
mail.sendMessageFromContactForm = function(email, name, text, callback){
    const msg = {
        from: 'info@inlege.cz', 
        to: 'jakub@inlege.cz',
        subject: "Nová zpráva z kontaktního formuláře",
        html: `
            <h3 style="font-family:Helvetica Neue">Nová zpráva z kontaktního formuláře:</h3>
            <p style="font-family:Helvetica Neue">E-mail: ${email}</p>
            <p style="font-family:Helvetica Neue">Jméno: ${name}</p>
            <p style="font-family:Helvetica Neue">Text: <br />${text}</p>
        `
      };
    //send the mail
    sgMail.send(msg, function(err) {
        if(err){
          console.log(err);
        }      
      });
  };

//forgotten password - change link
mail.forgottenPassword = function(data, callback){
  const msg = {
      from: {email:"info@inlege.cz", name: "InLege.cz"}, 
      to: data.email,
      subject: "Zapomenuté heslo",
      html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                  <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                      <tbody>
                                          <tr> 
                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                  <div style="box-sizing:border-box">
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Zapomenuté heslo</h2> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">své heslo můžeš změnit po kliknutí na tento odkaz: <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz${data.link}">https://www.inlege.cz${data.link}</a>.</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege Team</p> 
                                                  </div> 
                                              </td> 
                                          </tr> 
                                      </tbody>
                                  </table> 
                              </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>
              <div style="box-sizing:border-box;clear:both;width:100%"> 
                  <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                      <tbody>
                          <tr style="font-size:12px"> 
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `
    };
  //send the mail
  sgMail.send(msg, function(err) {
      if(err){
        console.log(err);}      
    });
};

//welcome e-mail
mail.sendThankYou = function(email, text, type, callback){
    let content = 'na kartičce';
    if(type === 'question'){
        content = 'v otázce'
    }
    const msg = {
        from: {email:"jakub@inlege.cz", name: "Jakub z InLege"}, 
        to: email,
        subject: `Oprava chyby ${content}`,
        html: `<div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px"> 
                <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #f0f0f0"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px" valign="top"> 
                                    <table style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important" width="100%"> 
                                        <tbody>
                                            <tr> 
                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top" valign="top"> 
                                                    <div style="box-sizing:border-box">
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Chybu jsme opravili</h2> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">díky za nahlášení chyby ${content} "${text}". Chybu jsme opravili.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S přátelským pozdravem</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Jakub Spáčil</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Team InLege</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                        </tbody>
                                    </table> 
                                </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>
                <div style="box-sizing:border-box;clear:both;width:100%"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr style="font-size:12px"> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
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

//account deleted - admin info mail
mail.sendCronReport = function(action, data){
    const msg = {
        from: "info@inlege.cz", 
        to: process.env.ADMIN_MAIL,
        subject: `Cron funkce právě proběhla: ${action}`,
        html: `Dotčení uživatelé: ${data}`
      };
    //send the mail
    sgMail.send(msg, function(err) {
        if(err){
          console.log(err);}      
      });
  };

module.exports = mail;