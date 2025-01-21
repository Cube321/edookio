const sgMail = require("@sendgrid/mail");
const moment = require("moment");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var mail = {};

//welcome e-mail
mail.welcome = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvůj účet na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> byl vytvořen! Doufáme, že Ti aplikace bude dobře sloužit a stane se tvým stálým parťákem při studiu práv.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">InLege není jen vzdělávací platforma, ale také komunita mladých právníků. Přidej se k nám na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>, ať ti nic neuteče.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info e-mail after 3 days
mail.sendInfoEmail = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: "Proč InLege používají tisíce studentů práv?",
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
                                <!-- Obsah emailu -->
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    Ahoj,
                                </p>
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    máš za sebou prvních pár dní s <a style="color:#E80F88;text-decoration:none;font-weight:400" href="https://www.inlege.cz">InLege</a>. S přípravou na zkoušky pomáháme již více než 2 000 studentů práv a rádi bychom se s tebou podělili o to, co nás dělá jedinečnými.
                                </p>
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">
                                    V čem je tajemství úspěchu?
                                </p>
                                <ul style="margin-top:0;margin-bottom:10px;padding-left:1.5em;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    <li style="margin-bottom:6px">InLege využívá <strong style="font-weight:400">opakovací kartičky a testové otázky</strong>, které ti pomohou rychleji si zapamatovat potřebné informace.</li>
                                    <li style="margin-bottom:6px">Tento systém ti umožní <strong style="font-weight:400">efektivně opakovat</strong> to, co už umíš, a <strong style="font-weight:400">rychle doplňovat</strong> to, v čem si ještě nejsi jistý/á.</li>
                                    <li style="margin-bottom:6px">Díky rychlé zpětné vazbě se můžeš <strong style="font-weight:400">soustředit na slabá místa</strong> a také ušetřit čas.</li>
                                </ul>
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">
                                    Proč na InLege studenti spoléhají?
                                </p>
                                <ul style="margin-top:0;margin-bottom:10px;padding-left:1.5em;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    <li style="margin-bottom:6px">Mají zde <strong style="font-weight:400">všechny právní obory na jednom místě</strong>.</li>
                                    <li style="margin-bottom:6px">Naše platforma je <strong style="font-weight:400">přehledná a snadno se používá</strong>, ať už na počítači, nebo na mobilu.</li>
                                    <li style="margin-bottom:6px">A hlavně – <strong style="font-weight:400">osvědčený princip opakování</strong> dokáže zázraky. Studenti často zjišťují, že se učí <strong style="font-weight:400">méně hodin</strong> a přitom si pamatují <strong style="font-weight:400">víc</strong>.</li>
                                </ul>
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    Jsme rádi, že ses k InLege přidal/a, a těšíme se, až společně uvidíme skvělé výsledky tvého studia.
                                </p>
                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    Děkujeme za důvěru a přejeme úspěšné studium,
                                </p>
                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                    Tým InLege<br>
                                </p>
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
                                                    <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">
                                                    Pustit se do studia
                                                    </a>
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
                    <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center">
                        <a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a>
                        <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                        Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220
                        </p>
                        <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                        <a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a>
                        </p>
                        <p style="font-size:10px; text-align: center;color:#6C657D;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a style="color:#E80F88; text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
                    `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info mail to admin mail - registration of a new user
mail.adminInfoNewUser = function (newUser, callback) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Zaregistroval se nový uživatel: ${newUser.email}`,
    html: `
          <h3>Registrace nového uživatele</h3>
          <p>Zaregistroval se nový uživatel:<p>
          <p>Email: ${newUser.email}</p>
          <p>Zdroj: ${newUser.source}</p>
          <p>Datum registrace: ${moment(newUser.dateOfRegistration)
            .locale("cs")
            .format("LLLL")}</p>
          <p>Stripe ID: ${newUser.billingId}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//welcome e-mail
mail.emailVerification = function (email, userId, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: "Ověření e-mailové adresy",
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
                                                          <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Ověření e-mailové adresy</h2> 
                                                          <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ahoj,</p> 
                                                          <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">ověř prosím svou e-mailovou adresu kliknutím tlačítko níže nebo otevřením následujícího odkazu v prohlížeči: <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz/auth/user/verifyEmail/${userId}">https://www.inlege.cz/auth/user/verifyEmail/${userId}</a></p> 
                                                          <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">E-mail ${email} byl použit pro registraci na portálu InLege. Pokud se nejedná o Tvou registraci, tento e-mail prosím ignoruj.</p> 
                                                          <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem</p> 
                                                          <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Team InLege</p> 
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
                                                                                              <a href="https://www.inlege.cz/auth/user/verifyEmail/${userId}" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Ověřit e-mail</a>
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
                                  <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s. r. o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td> 
                              </tr> 
                          </tbody>
                      </table> 
                  </div>  
              </div>`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//user requested invoice
mail.requestInvoice = function (email, invoiceNum) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Uživatel ${email} vyžádal ${invoiceNum}`,
    html: `
            Uživatel ${email} vyžádal zaslání faktury ${invoiceNum} na svůj e-mail.
        `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//credits added
mail.adminInfoCreditsPurchased = function (user, credits) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `KREDITY PŘIPSÁNY - ${credits} - ${user.email}`,
    html: `
          Uživatel ${user.email} si zakoupil ${credits} kreditů.
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//payment failed
mail.adminInfoSubscriptionPaymentFailed = function (user, paymentStatus, data) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Platba uživatele ${user.email} SELHALA`,
    html: `
        Platba uživatele ${user.email} selhala.

        Payment status: ${paymentStatus}

        Data object: ${JSON.stringify(data)}
    `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//subscription created e-mail
mail.subscriptionCreated = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvé předplatné InLege Premium bylo právě <strong>aktivováno</strong>! Nyní máš přístup k více než 5 000 opakovacích kartiček, testovým otázkám bez měsíčního limitu a možnost kartičky si ukládat pomocí hvězdičky na později. Předplatné můžeš kdykoliv zrušit.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//subscription uncancelled e-mail to user
mail.subscriptionUncancelled = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: "Předplatné InLege Premium bylo obnoveno",
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
                                                          <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvé předplatné InLege Premium bylo právě <strong>obnoveno</strong>! Nyní máš přístup k více než 5 000 opakovacích kartiček, testovým otázkám bez měsíčního limitu a možnost kartičky si ukládat pomocí hvězdičky na později. Předplatné můžeš kdykoliv zrušit.</p> 
                                                          <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                          <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvůj InLege Team</p> 
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
                                  <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                              </tr> 
                          </tbody>
                      </table> 
                  </div>  
              </div>`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info mail to admin mail - subscription activated
mail.adminInfoNewSubscription = function (
  user,
  paymentSource,
  store,
  callback
) {
  if (!paymentSource) paymentSource = "stripe";
  if (!store) store = "stripe";
  let questionsLimitReachedDate = "-";
  if (user.reachedQuestionsLimitDate) {
    questionsLimitReachedDate = moment(user.reachedQuestionsLimitDate)
      .locale("cs")
      .format("LLLL");
  }

  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) AKTIVACE | ${user.plan}: ${user.email}`,
    html: `
          <p>(${paymentSource} - ${store})<p>
          <p>${user.email}</p>
          <p>Datum registrace: ${moment(user.dateOfRegistration)
            .locale("cs")
            .format("LLLL")}</p>
          <p>Datum vyčerpání free otázek: ${questionsLimitReachedDate}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${moment(user.endDate)
            .locale("cs")
            .format("LLLL")}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info mail to admin mail - subscription updated
mail.adminInfoSubscriptionUpdated = function (
  user,
  endDate,
  paymentSource,
  store,
  callback
) {
  if (!paymentSource) paymentSource = "stripe";
  if (!store) store = "stripe";

  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) PRODLOUŽENÍ | ${user.plan}: ${user.email}`,
    html: `
          <p>(${paymentSource} - ${store})<p>
          <p>${user.email}</p>
          <p>Datum registrace: ${moment(user.dateOfRegistration)
            .locale("cs")
            .format("LLLL")}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${moment(user.endDate)
            .locale("cs")
            .format("LLLL")}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//mail to inform admin that subscription has been uncancelled
mail.adminInfoSubscriptionUncancelled = function (
  user,
  paymentSource,
  store,
  callback
) {
  if (!paymentSource) paymentSource = "stripe";
  if (!store) store = "stripe";
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Uživatel OBNOVIL PŘED ZRUŠENÍM Premium: ${user.email}`,
    html: `
          <p>(${paymentSource} - ${store})<p>
          <h3>Uživatel OBNOVIL PŘED ZRUŠENÍM Premium</h3>
          <p>Tento uživatel zrušil a poté znovu obnovil balíček Premium:<p>
          <p>Email: ${user.email}</p>
          <p>Datum registrace: ${moment(user.dateOfRegistration)
            .locale("cs")
            .format("LLLL")}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${moment(user.endDate)
            .locale("cs")
            .format("LLLL")}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//subscription Premium granted by admin
mail.sendAdminGrantedPremium = function (email, endDate, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> Ti bylo právě administrátorem <strong>zdarma</strong> aktivováno předplatné Premium do ${endDate}! Užij si více než 5 000 opakovacích kartiček a další prémiové funkce.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Snažíme se o to, aby InLege nebyla jen vzdělávací platforma, ale také komunita mladých právníků. S tím nám pomůžeš, když se k nám přidáš i na <a style="color:#E80F88;text-decoration:none" href="https://www.instagram.com/inlege">Instagramu</a>.</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

mail.subscriptionCanceled = function (email, endDate, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvé předplatné Premium bylo ukončeno. Další platby Ti již nebudeme účtovat. Premium můžeš využívat do konce zaplaceného období, tedy do ${endDate}. Většina obsahu InLege je pro Tebe i nadále přístupná zdarma!</p> 
                                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info mail to admin mail - subscription canceled
mail.adminInfoSubscriptionCanceled = function (
  user,
  endDate,
  paymentSource,
  store,
  callback
) {
  if (!paymentSource) paymentSource = "stripe";
  if (!store) store = "stripe";
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) UKONČENÍ | ${user.plan}: ${user.email}`,
    html: `
          <p>(${paymentSource} - ${store})<p>
          <p>${user.email}</p>
          <p>Datum registrace: ${moment(user.dateOfRegistration)
            .locale("cs")
            .format("LLLL")}</p>
          <p>Premium: ${user.isPremium}</p>
          <p>Stripe ID: ${user.billingId}</p>
          <p>Plán předplatného: ${user.plan}</p>
          <p>Konec předplatného: ${moment(user.endDate)
            .locale("cs")
            .format("LLLL")}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//info mail when Premium actually ended (is send when user uses InLege after Premium expired)
mail.sendPremiumEnded = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Tvé předplatné Premium na portálu <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz">InLege</a> právě skončilo. I tak můžeš nadále zdarma využívat více než 3 000 opakovacích kartiček. Předplatné můžeš kdykoliv <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz/premium">obnovit</a>.</p> 
                                                        <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přejeme Ti pohodové (a úspěšné) studium!</p> 
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div> `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//reminder to keep the streak going
mail.sendStreakReminder = function (email, days, callback) {
  let phrase = "dny";
  let phrase2 = "dny";
  if (days > 4) {
    phrase = "dní";
  }
  if (days > 3) {
    phrase2 = "dní";
  }

  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: `Neztrať svůj ${days}denní streak! Stačí 10 otázek`,
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
                                            <div style="box-sizing:border-box;text-align:center;margin-bottom:30px">
                                                <h2 style="margin:0;margin-bottom:20px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Studuješ už ${days} ${phrase} v kuse! 🥳</h2> 
                                                <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Již studuješ nepřetržitě ${days} ${phrase}! Projdi si dnes alespoň 10 kartiček nebo testových otázek a prodluž svůj streak na ${
      days + 1
    } ${phrase2}.</p> 
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
                                                                                    <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">Udržet streak</a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220 <br> Odhlásit se z odběru těchto e-mailů můžete <a style="color:#E80F88;text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribeStreak?email=${email}">zde</a></p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p>
                        
                        </td> 
                    </tr> 
                </tbody>
            </table> 
        </div>  
    </div> `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

mail.testQuestionsLimitReset = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: "Dalších 50 testových otázek zdarma",
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
                                    <!-- Obsah emailu -->
                                    <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        Ahoj,
                                    </p>
                                    <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        v minulém měsíci jsi využil/a všech 50 testových otázek zdarma, které ti <a style="color:#E80F88;text-decoration:none;font-weight:400" href="https://www.inlege.cz">InLege</a> nabízí. Máme pro tebe skvělou zprávu – na začátku každého měsíce se ti znovu přičítá <strong style="font-weight:400">50 testových otázek</strong>, takže se můžeš pustit do procvičování a pokračovat v přípravě na zkoušky i s testovými otázkami!
                                    </p>
                                    <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">
                                        Jak ti pomohou testové otázky na InLege?
                                    </p>
                                    <ul style="margin-top:0;margin-bottom:10px;padding-left:1.5em;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        <li style="margin-bottom:6px"><strong style="font-weight:400">Efektivní procvičování:</strong> Lépe si zapamatuješ učivo a uvidíš rychlou zpětnou vazbu na své znalosti.</li>
                                        <li style="margin-bottom:6px"><strong style="font-weight:400">Snadné plánování:</strong> Můžeš si rozvrhnout, kdy a kolik otázek chceš řešit.</li>
                                        <li style="margin-bottom:6px"><strong style="font-weight:400">Neustálé zlepšování:</strong> Opakováním získáš hlubší pochopení látky a předejdeš “vyklouznutí” klíčových informací z paměti.</li>
                                    </ul>
                                    <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        Pokud bys chtěl/a mít k dispozici ještě více testových otázek a dalších funkcí, prozkoumej možnosti <strong style="font-weight:400"><a style="color:#E80F88;text-decoration:none;font-weight:400" href="https://www.inlege.cz/premium">InLege Premium</a></strong> – pomůže ti dostat se v přípravě na zkoušky ještě dál.
                                    </p>
                                    <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        Přejeme ti hodně úspěchů v novém měsíci a pevné nervy při studiu!
                                    </p>
                                    <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                        Tým InLege<br>
                                    </p>
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
                                                        <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">
                                                        Pustit se do studia
                                                        </a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center">
                            <a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a>
                            <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                            Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220
                            </p>
                            <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                            <a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a>
                            </p>
                                                    <p style="font-size:10px; text-align: center;color:#484848;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a style="color:#E80F88; text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>

                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
                `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

mail.creditsRecharged = function (email, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: "Kredity byly doplněny (+1000)",
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
                                      <!-- Obsah emailu -->
                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                          Ahoj,
                                      </p>
                                      <p style="margin:0;margin-bottom:10px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                          v rámci předplatného Premium jsme tvůj účet právě dobyli na 1 000 kreditů, které můžeš využít k tvorbě kartiček a otázek.
                                      </p>
                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                          Tým InLege<br>
                                      </p>
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
                                                          <a href="https://www.inlege.cz/" style="box-sizing:border-box;border-color:#E80F88;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E80F88;border:solid 1px #E80F88;border-radius:10px;font-size:16px;padding:12px 45px" target="_blank">
                                                          Pustit se do studia
                                                          </a>
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
                          <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center">
                              <a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a>
                              <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                              Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220
                              </p>
                              <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">
                              <a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a>
                              </p>
                                                      <p style="font-size:10px; text-align: center;color:#484848;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a style="color:#E80F88; text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>
  
                          </td>
                          </tr>
                      </tbody>
                      </table>
                  </div>
                  </div>
                  `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//send feedback
mail.sendFeedback = function (email, name, text, callback) {
  const msg = {
    from: "info@inlege.cz",
    to: "info@inlege.cz",
    subject: "(CZ) Zpětná vazba (formulář)",
    html: `
          <p style="font-family:Helvetica Neue">Uživatel ${name} (${email}) zasílá následující feedback prostřednictvím formuláře:</p>
          <p style="font-family:Helvetica Neue">${text}</p>
      `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//send message from contact form
mail.sendMessageFromContactForm = function (email, name, text, callback) {
  const msg = {
    from: "info@inlege.cz",
    to: "info@inlege.cz",
    subject: "(CZ) Nová zpráva z kontaktního formuláře",
    html: `
            <h3 style="font-family:Helvetica Neue">Nová zpráva z kontaktního formuláře:</h3>
            <p style="font-family:Helvetica Neue">E-mail: ${email}</p>
            <p style="font-family:Helvetica Neue">Jméno: ${name}</p>
            <p style="font-family:Helvetica Neue">Text: <br />${text}</p>
        `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//forgotten password - change link
mail.forgottenPassword = function (data, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
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
                                                      <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>  
          </div> `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//welcome e-mail
mail.sendThankYou = function (email, text, type, callback) {
  let content = "na kartičce";
  if (type === "question") {
    content = "v otázce";
  }
  const msg = {
    from: { email: "info@inlege.cz", name: "Ondřej z InLege" },
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
                                                        <p style="margin:0;margin-bottom:0px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Ondřej</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.inlege.cz" style="box-sizing:border-box;" target="_blank"></a> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">Provozovatel InLege: Chilero s.r.o., IČ: 089 00 230 se sídlem Kaštanová 3, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://www.instagram.com/inlege" style="box-sizing:border-box;color:#E80F88;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">Instagram</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//email for all users
mail.sendEmergencyEmail = function (email, subject, text, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: subject,
    html: `${text}`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log("---ERROR--- Nepodarilo se odeslat e-mail z /admin/email");
      console.log(err);
    }
  });
};

//email for subscribed users
mail.sendEmailToSubscribedUsers = function (email, subject, text, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: subject,
    html: `${text}
                <p style="font-size:10px; text-align: center;color:#6C657D;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a style="color:#E80F88; text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>              `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log("---ERROR--- Nepodarilo se odeslat e-mail z /admin/email");
      console.log(err);
    }
  });
};

//email test
mail.sendTestEmail = function (email, subject, text, callback) {
  const msg = {
    from: { email: "info@inlege.cz", name: "InLege" },
    to: email,
    subject: subject,
    html: `${text}              
            <p style="font-size:10px; text-align: center;color:#6C657D;font-family:Helvetica Neue">Odhlásit se z odběru informačních e-mailů můžete <a style="color:#E80F88; text-decoration:none" href="https://www.inlege.cz/admin/email/unsubscribe?email=${email}">zde</a>.</p>              `,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log("---ERROR--- Nepodarilo se odeslat e-mail z /admin/email");
      console.log(err);
    }
  });
};

//account deleted - admin info mail
mail.adminInfoUserDeleted = function (userEmail, callback) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Uživatel zrušil účet: ${userEmail}`,
    html: `Uživatel zrušil účet: ${userEmail}`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

//account deleted - admin info mail
mail.sendCronReport = function (action, data) {
  const msg = {
    from: "info@inlege.cz",
    to: process.env.ADMIN_MAIL,
    subject: `(CZ) Cron funkce právě proběhla: ${action}`,
    html: `Dotčení uživatelé: ${data}`,
  };
  //send the mail
  sgMail.send(msg, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = mail;
