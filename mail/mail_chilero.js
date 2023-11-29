const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var mail = {};

//send e-mail with infomation that the Property was authorised and published
mail.sendEmailPropertyAuthorised = function(property){
        var msg = {
            from: "postak@chilero.cz", // sender address
            to: property.author.email, // list of receivers
            subject: "Chilero | Nabídka byla schálena a zveřejněna", // Subject line
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Nabídka byla schválena</h2> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Vaše nabídka <strong>${property.title}</strong> byla schválena administrátorem a zveřejněna na adrese: </p> 
                                                        <a href="https://www.chilero.cz/property/${property._id}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">https://www.chilero.cz/property/${property._id}</a>
                                                        <p style="margin:0;margin-bottom:20px;margin-top:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Nabídka se nyní zobrazuje uživatelům. Statistiky uživatelských akcí můžete sledovat po přihlášení <a href="https://www.chilero.cz/dashboard/actions" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">zde</a>.</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Součástí vašeho účtu na Chilero je <strong>zdarma</strong> také <strong>systém pro správu pobytů</strong>. Pobyty se automaticky zobrazují také jako obsazená data v kalendáři v detailu inzerátu. Vyzkoušejte Správce pobytů <a href="https://www.chilero.cz/dashboard/events" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">zde</a>.</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/${property._id}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Zobrazit nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
          };
        //send the mail
        sgMail.send(msg, function(err) {
                if(err){
                    console.log("Error - property authorised mail not sent");
                    console.log(err);
                    Err.create({err: error});
                }
          });
};

//send e-mail with infomation that the Property was not authorised
mail.sendEmailPropertyNotAuthorised = function(property, callback){
        var msg = {
            from: "postak@chilero.cz", // sender address
            to: property.author.username, // list of receivers
            subject: "Chilero | Nabídka nebyla schálena", // Subject line
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Nabídka nebyla schválena</h2> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Mrzí nás to, ale vaše nabídka <strong>${property.title}</strong> bohužel nebyla schválena administrátorem. Opravte prosím následující nedostatky: </p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line;">${property.notApprovedInformation}</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/edit/step1/${property._id}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Opravit nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
          };
        //send the mail
        sgMail.send(msg, function(err) {
                callback(err);
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

//contact form e-mail
mail.requestTranslation = function(data, callback){
    const msg = {
        from: "postak@chilero.cz", 
        reply_to: data.email,
        to: "info@chilero.cz", // adresa pro zaslani otazky z become_owner page
        subject: "Chilero | Poptávka překladu",
        //text: "Máte novou zprávu od: " + data.email + "\n tel: " + data.phone + " text: " + data.message,
        html: `<p><strong>Poptávka překladu popisu nemovitosti</strong></p>
               <p>
                  Odesílatel: ${data.name}
                  <br />
                  E-mail: ${data.email}
                  <br />
                  Telefon: ${data.phone}
               </p>
               <p>Poptávané jazykové verze: ${data.checkEN}/${data.checkDE}/${data.checkPL}</p>
               <p>Text k překladu:</p>
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

//contact form e-mail
mail.sendQuestionCopy = function(data){
  const msg = {
      from: "postak@chilero.cz", 
      to: data.email, // adresa pro zaslani otazky z become_owner page
      subject: "Chilero | Potvrzení o odeslání dotazu",
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Dobrý den,</h2> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Váš dotaz jsme přijali a budeme se na něj snažit odpovědět co nejdříve.</p> 
                                                        <hr />
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line; font-style:italic;">"${data.message}"</p>
                                                        <hr /> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
    };
  //send the mail
  sgMail.send(msg, function(err) {
          if(err){
            console.log(err);
            Err.create({err: error});
        }
    });
};

//==================
//SEND EMAIL FROM SHOW TO OWNER
//==================

//send email to owner
mail.sendMsgToOwner = function(foundProperty, req, callback){
  const msg = {
        from: "postak@chilero.cz", // sender address
        reply_to: req.body.sender,
        to: foundProperty.contactEmail, // list of receivers foundProperty.contactEmail
        subject: "CHILERO | Nová zpráva: " + req.body.predmet, // Subject line
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Dobrý den,</h2> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">máte nový e-mail k Vaší nabídce ${foundProperty.title}.</p> 
                                                        <hr />
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line;"><strong>Odesílatel:</strong> ${req.body.sender} \n <strong>Předmět:</strong> ${req.body.predmet}</p>
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line;"><strong>Zpráva:</strong> \n <span style="font-style:italic">${req.body.content}</span></p>
                                                        <hr /> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Na tuto zprávu můžete odpovědět. Odpověď bude zaslána přímo odesílateli.</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
    };

    sgMail.send(msg, (err) => {
      callback(err);
    });
}

//send confirmation to sender
mail.sendCopyToSender = function(foundProperty, req, callback){
  const msg = {
        from: "postak@chilero.cz", // sender address
        to: req.body.sender, // list of receivers
        subject: "CHILERO | Potvrzení o odeslání: " + req.body.predmet, // Subject line
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Dobrý den,</h2> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Váš dotaz k nabídce <a href="https://www.chilero.cz/property/${foundProperty._id}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">${foundProperty.title}</a>
                                                        byl odeslán nabízejícímu. Obsah zprávy:</p> 
                                                        <hr />
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line;"><strong>Odesílatel:</strong> ${req.body.sender} \n <strong>Předmět:</strong> ${req.body.predmet}</p>
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;white-space: pre-line;"><strong>Zpráva:</strong> \n <span style="font-style:italic">${req.body.content}</span></p>
                                                        <hr /> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
                                                    </div> 
                                                </td> 
                                            </tr> 
                                        </tbody>
                                    </table> 
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
                                                            <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                <div style="box-sizing:border-box">
                                                                    <div>
                                                                        <a href="https://www.chilero.cz/property/${foundProperty._id}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Zobrazit nabídku</a>
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
                </div>
                <div style="box-sizing:border-box;clear:both;width:100%"> 
                    <table style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important" width="100%"> 
                        <tbody>
                            <tr style="font-size:12px"> 
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
    };

    sgMail.send(msg, (err) => {
      callback(err);
    });
}

//==================
//REGISTRATION AND BECOME OWNER
//==================
//register new simple user confirmation
mail.sendConfirmRegistration = function(registeredUser, callback){
  const msg = {
    to: registeredUser.email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Potvrzení registrace',
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítejte na Chilero!</h2> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Vaše registrace byla úspěšně dokončena. Nyní můžete začít využívat všech výhod pro registrované uživatele:</p> 
                                                        <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;margin-bottom:30px;padding-left:30"> 
                                                            <li style="margin-left:5px;list-style-position:inside">Ukládat nabídky mezi oblíbené</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Srovnávat oblíbené nabídky v přehledné tabulce</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Sdílet srovnání s Vašimi přáteli</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">...a mnohem víc</li> 
                                                        </ul> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Prozkoumat Chilero</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
    };
    sgMail.send(msg, (err) => {
      callback(err);
    });
}

//register new owner user confirmation
mail.sendConfirmRegistrationOwnerBasic = function(registeredUser){
  const msg = {
    to: registeredUser.email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Potvrzení registrace',
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítejte na Chilero!</h2> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Gratulujeme! Vaše registrace byla úspěšně dokončena. Nyní můžete začít inzerovat na portálu Chilero.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Inzerce na Chilero má pro vás mj. následující výhody:</p> 
                                                        <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;margin-bottom:30px;padding-left:30"> 
                                                            <li style="margin-left:5px;list-style-position:inside">Detailní statistiky aktivity uživatelů ke každé nabídce</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Žádná provize, přímý kontakt mezi zájemcem o ubytování a Vámi</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů <strong>napořád</strong> zdarma</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">...a mnohem víc</li> 
                                                        </ul> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/new/info" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Vytvořit první nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
    };
    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.sendConfirmRegistrationOwnerProfi = function(registeredUser){
    const msg = {
      to: registeredUser.email,
          from: 'postak@chilero.cz',
          subject: 'CHILERO | Potvrzení registrace',
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítejte na Chilero!</h2> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Gratulujeme! Vaše registrace byla úspěšně dokončena. Nyní můžete začít inzerovat na portálu Chilero.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Zvolil/a jste si balíček Profi, v rámci kterého můžete zveřejnit až 5 nabídek, které budou zvýhodněny ve výsledcích vyhledávání. Nabídky můžete přidat již nyní, zobrazovat se začnou od 1. dubna 2020, na kdy je plánováno oficiální spuštění portálu Chilero pro veřejnost.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Brzy Vám zašleme informace pro platbu za balíček Profi. Úhrada balíčku je předpokladem zveřejnění nabídky (nabídek) ve výsledcích vyhledávání.</p>
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Inzerce na Chilero s balíčkem Profi má pro vás mj. následující výhody:</p> 
                                                        <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;margin-bottom:30px;padding-left:30"> 
                                                            <li style="margin-left:5px;list-style-position:inside">Zveřejnění až 5 nabídek za jednu cenu</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Přednostní výpis Vašich nabídek ve vyhledávání</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Garance spokojenosti</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Detailní statistiky aktivity uživatelů ke každé nabídce</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Žádná provize, přímý kontakt mezi zájemcem o ubytování a Vámi</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů <strong>napořád</strong> zdarma</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">...a mnohem víc</li> 
                                                        </ul> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/new/info" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Vytvořit první nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
      };
      sgMail.send(msg, (err) => {
        if(err){
          Err.create({error: err});
          console.log(err);
        }
      });
  }

mail.emailConfirmation = function(email, token){
    const msg = {
        to: email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Ověření e-mailové adresy',
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
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Dobrý den, Vaše e-mailová adresa byla použita k registraci na portálu www.chilero.cz. Ověřte prosím Vaši e-mailovou adresu kliknutím na následující odkaz:</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300"><a href="https://www.chilero.cz/overitemail/${token}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">https://www.chilero.cz/overitemail/${token}</a></p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
      };
  
      sgMail.send(msg, (err) => {
        if(err){
            Err.create({error: err});
            console.log(err);
          }
      });
}

mail.emailConfirmationResend = function(email, token, callback){
    const msg = {
        to: email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Ověření e-mailové adresy',
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
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Dobrý den, ověřte prosím Vaši e-mailovou adresu kliknutím na následující odkaz:</p> 
                                                        <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300"><a href="https://www.chilero.cz/overitemail/${token}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">https://www.chilero.cz/overitemail/${token}</a></p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>   
            </div>`
      };
  
      sgMail.send(msg, (err) => {
        if(err){
            Err.create({error: err});
            console.log(err);
            callback(err);
          } else {
              callback();
          }
      });
}

//added invoice info and became owner info email
mail.sendConfirmUserBecameOwnerBasic = function(foundUser){
  const msg = {
          to: foundUser.email,
          from: 'postak@chilero.cz',
          subject: 'CHILERO | Můžete začít inzerovat',
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítejte na Chilero!</h2> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Gratulujeme! Nyní můžete začít inzerovat na portálu Chilero.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Inzerce na Chilero má pro vás mj. následující výhody:</p> 
                                                        <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;margin-bottom:30px;padding-left:30"> 
                                                            <li style="margin-left:5px;list-style-position:inside">Detailní statistiky aktivity uživatelů u každé nabídky</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Žádná provize, přímý kontakt mezi zájemcem o ubytování a Vámi</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů <strong>napořád</strong> zdarma</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">...a mnohem víc</li> 
                                                        </ul> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/new/info" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Vytvořit první nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.sendConfirmUserBecameOwnerProfi = function(foundUser){
    const msg = {
            to: foundUser.email,
            from: 'postak@chilero.cz',
            subject: 'CHILERO | Můžete začít inzerovat',
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
                                                        <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Vítejte na Chilero!</h2> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Gratulujeme! Vaše fakturační údaje byly úspěšně doplněny a balíček služeb Profi zvolen. Nyní můžete začít inzerovat na portálu Chilero.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Zvolil/a jste si balíček Profi, v rámci kterého můžete zveřejnit až 5 nabídek, které budou zvýhodněny ve výsledcích vyhledávání. Nabídky můžete přidat již nyní, zobrazovat se začnou od 1. dubna 2020, na kdy je plánováno oficiální spuštění portálu Chilero pro veřejnost.</p> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Brzy Vám zašleme informace pro platbu za balíček Profi. Úhrada balíčku je předpokladem zveřejnění nabídky (nabídek) ve výsledcích vyhledávání.</p>
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Inzerce na Chilero s balíčkem Profi má pro vás mj. následující výhody:</p> 
                                                        <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;margin-bottom:30px;padding-left:30"> 
                                                            <li style="margin-left:5px;list-style-position:inside">Zveřejnění až 5 nabídek za jednu cenu</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Přednostní výpis Vašich nabídek ve vyhledávání</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Garance spokojenosti</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Detailní statistiky aktivity uživatelů ke každé nabídce</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Žádná provize, přímý kontakt mezi zájemcem o ubytování a Vámi</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů <strong>napořád</strong> zdarma</li> 
                                                            <li style="margin-left:5px;list-style-position:inside">...a mnohem víc</li> 
                                                        </ul> 
                                                        <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p> 
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
                                                                                <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                                    <div style="box-sizing:border-box">
                                                                                        <div>
                                                                                            <a href="https://www.chilero.cz/property/new/info" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Vytvořit první nabídku</a>
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
                                <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                            </tr> 
                        </tbody>
                    </table> 
                </div>  
            </div>`
      };
  
      sgMail.send(msg, (err) => {
        if(err){
          Err.create({error: err});
          console.log(err);
        }
      });
  }

//==================
//STATS
//==================
//monthly stats for each property mail
mail.sendLastMonthStats = function(data, to, year, month, property){
    const { showPageVisit, phoneShow, addToFavourites, searchResultsShowed, msgSend, webVisit} = data;
    
    const msg = {
        to: to,
        from: 'postak@chilero.cz',
        subject: `CHILERO Statistiky za měsíc ${month}/${year} pro ${property}`,
        //text: 'Hello plain world!',
        html: `<p>Mail byl doručen.</p>
                <ul>
                    <li>Zobrazení detailu nabídky: ${showPageVisit}</li>
                    <li>Zobrazení telefonního čísla: ${phoneShow}</li>
                    <li>Přidání mezi oblíbené: ${addToFavourites}</li>
                    <li>Zorazení ve výsledcích vyhledávání: ${searchResultsShowed}</li>
                    <li>Odeslaných zpráv: ${msgSend}</li>
                    <li>Zobrazení soukromého webu: ${webVisit}</li>
                </ul>`,
    };
    
    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

//==================
//PASSWORD RESET
//==================
//reset password - send token
mail.sendToken = function(token, to, req, callback){
    const msg = {
        to: to,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Změna hesla',
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
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Žádost o změnu hesla</h2> 
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Přijali jsme žádost o změnu hesla k Vašemu účtu na portálu Chilero.</p> 
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Pro změnu hesla přejděte na <br /> <a href="https://${req.headers.host}/reset/${token}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">https://${req.headers.host}/reset/${token}</a>.</p>
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Pokud jste žádost o změnu hesla nepodal/a Vy, považujte prosím tento e-mail za bezpředmětný.</p>  
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>   
          </div>`
    };

    sgMail.send(msg, (err) => {
      callback(err);
    });
}

//reset password - send confirmation of change
mail.sendPassReseConfirmation = function(to, user, callback){
    const msg = {
      to: to,
      from: 'postak@chilero.cz',
      subject: 'CHILERO | Heslo bylo změněno',
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
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Potvrzení o změně hesla</h2> 
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Vaše heslo k účtu ${user.email} na portálu Chilero bylo změněno.</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>   
          </div>`
    };

    sgMail.send(msg, (err) => {
      callback(err);
    });
}

//==================
//PACKAGES
//==================
//confirmation of package renewal
mail.confirmPackageRenewal = function(user, callback){
    let balicek = "";
    if(user.package === "basic" || user.package === "free_trial"){balicek = "Standard"};
    if(user.package === "profi" || user.requestedChangeToProfi){balicek = "Profi"};
    const msg = {
        to: user.email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Balíček služeb byl prodloužen',
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
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Balíček služeb byl prodloužen</h2> 
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Poplatek za balíček služeb ${balicek} pro účet ${user.email} byl uhrazen a balíček byl prodloužen do ${user.paidUntilFormated}.</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Děkujeme za Vaši důvěru!</p>   
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>   
          </div>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

//confirmation of package change to Profi
mail.sendConfirmPackageChangeToProfi = function(user){
    const msg = {
        to: user.email,
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Balíček byl změněn',
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
                                                      <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#484848!important">Balíček služeb byl změněn na Profi</h2> 
                                                      <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">Balíček služeb pro Váš účet ${user.email} byl změněn na <strong>balíček Profi</strong> a byl uhrazen do ${user.paidUntilFormated}.</p> 
                                                      <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">S pozdravem<br>Jakub z Chilero Team</p>   
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
                              <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px"><a href="https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/SK0B1e00M1h0yTV0000mwKS&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHv2ycANZo_3aiEJUHP7sa55XaFsw">Instagram</a> <a href="https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/y0mT0wVy0e0MBKT0hL00110&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNHcSOpiFIc3HmiJbgzNsx3rbJYCfw">Twitter</a> <a href="https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://links.twilio.com/R00Mh00Kwe0010V1TUBmMy0&amp;source=gmail&amp;ust=1578743508215000&amp;usg=AFQjCNEL2kc55Y2ToDp1dESbM2jlcfyEIw">Facebook</a></p> </td> 
                          </tr> 
                      </tbody>
                  </table> 
              </div>   
          </div>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

//==================
//ADMIN MAILS
//==================
mail.adminInfoNewUser= function(user){
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Nový uživatel se registroval',
        html: `Právě se zaregistroval nový uživatel s e-mailem: <strong>${user.username}</strong>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.adminInfoNewOwner= function(user){
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Nový inzerent se registroval',
        html: `Právě se zaregistroval nový uživatel s e-mailem: <strong>${user.username}</strong> a balíčkem <strong>${user.package}</strong>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.adminInfoUserBecameOwner= function(user){
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Nový inzerent (změna z běžného uživatele)',
        html: `Uživatel <strong>${user.username}</strong> právě doplnil fakturační údaje a zvolil balíček <strong>${user.package}</strong>`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.adminInfoNewPropertyToConfirm= function(property){
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Žádost o schválení nabídky (nová)',
        html: `Nabídka <strong>${property.title}</strong> byla přijata ke schválení administrátorem.`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

mail.adminInfoPropertyToConfirmUpdate = function(property){
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'postak@chilero.cz',
        subject: 'CHILERO | Žádost o schválení nabídky (update)',
        html: `Aktualizovaná nabídka <strong>${property.title}</strong> byla přijata ke schválení administrátorem.`
    };

    sgMail.send(msg, (err) => {
      if(err){
        Err.create({error: err});
        console.log(err);
      }
    });
}

//==================
//SEND OFFER
//==================
mail.sendOffer = function(adresat, odesilatel, emailType, osloveni, gender, jmeno, callback){
    if(jmeno.length > 0){
        jmeno = jmeno + ",";
    }
    let preklopeni = "";
    if(emailType === "akce"){
        preklopeni = `<p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Nebo můžete využít časově omezenou možnost nechat si "překlopit" obsah Vašeho inzerátu z portálu E-chalupy.cz na portál Chilero našimi kolegy. Máte-li zájem využít této možnosti, klikněte prosím na následující odkaz: <a href="https://www.chilero.cz/souhlasimspreklopenim/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/souhlasimspreklopenim/${adresat}</a>.</p>`
    }
    const msg = {
        to: adresat,
        from: 'info@chilero.cz',
        subject: 'Informace k projektu CHILERO',
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">${osloveni} ${gender} ${jmeno}</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">na základě našeho telefonického rozhovoru si Vám dovoluji zaslat základní informace o projektu Chilero [čilero].</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero (<a href="https://www.chilero.cz" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz</a>) je nový český start-up, který vznikl, protože si myslíme, že české chaty, chalupy a apartmány si zaslouží moderní prezentaci hodnou 21. století, s jejíž pomocí budou Vaše nemovitosti obsazeny v průběhu celého roku. Naším cílem je <strong>stát se jedničkou na trhu</strong> zprostředkování pronájmu rekreačních nemovitostí v ČR.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400"><strong>Oficiální spuštění</strong> portálu je plánováno na <strong>1. dubna 2020</strong> a nyní se nacházíme ve fázi oslovování potenciálních inzerentů. Ti, kteří přidají svou nabídku do 1. dubna, získají možnost užívat portál <strong>zcela bezplatně po neomezenou dobu</strong>.</p>
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Věříme, že jsme připravili portál, který svým uživatelům nabídne moderní způsob, jak najít tu správnou chatu či apartmán pro pohodovou dovolenou. A Vám, jako inzerentovi, přinese řadu nových hostů a pomůže <strong>obsadit Vaši nemovitost</strong> i mimo hlavní sezónu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">V rámci spolupráce s Chilerem získáte mj.:</p> 
                                                <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;margin-bottom:30px;padding-left:30"> 
                                                    <li style="margin-left:5px;list-style-position:inside">Propagaci Vaší nemovitosti zcela zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Masivní marketingovou podporu Vaší nabídky</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Neplatíte žádnou provizi</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Přímý kontakt mezi Vámi a zájemcem o ubytování</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside"><a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">...a mnohem více</a></li> 
                                                </ul> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero je živý projekt, za kterým stojí tým mladých energických lidí a který byl připravován více než rok. Chilero bude i nadále vyvíjeno tak, aby mělo jak pro uživatele, tak pro inzerenty co největší přidanou hodnotu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Svou nemovitost můžete přidat po kliknutí na tlačítko „Chci zjistit více“ nebo přes odkaz <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/pridatnabidkuzdarma/${emailType}</a>.</p>
                                                ${preklopeni} 
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>${odesilatel} z Chilero Team</p></br> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">E-mail: info@chilero.cz<br>Tel.: +420 705 119 260</p> 
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
                                                                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                            <div style="box-sizing:border-box">
                                                                                <div>
                                                                                    <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Chci zjistit více</a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr>
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr> 
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        callback(err);
    });
}

mail.sendOfferCopy = function(adresat, odesilatel, emailType, osloveni, gender, jmeno){
    if(jmeno.length > 0){
        jmeno = jmeno + ",";
    }
    let preklopeni = "";
    if(emailType === "akce"){
        preklopeni = `<p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Nebo můžete využít časově omezenou možnost nechat si "překlopit" obsah Vašeho inzerátu z portálu E-chalupy.cz na portál Chilero našimi kolegy. Máte-li zájem využít této možnosti, klikněte prosím na následující odkaz: <a href="https://www.chilero.cz/souhlasimspreklopenim/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/souhlasimspreklopenim/${adresat}</a>.</p>`
    }
    const msg = {
        to: 'project.chilero@gmail.com',
        from: 'info@chilero.cz',
        subject: `Nabídka odeslána na (${odesilatel}): ${adresat}`,
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">${osloveni} ${gender} ${jmeno}</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">na základě našeho telefonického rozhovoru si Vám dovoluji zaslat základní informace o projektu Chilero [čilero].</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero (<a href="https://www.chilero.cz" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz</a>) je nový český start-up, který vznikl, protože si myslíme, že české chaty, chalupy a apartmány si zaslouží moderní prezentaci hodnou 21. století, s jejíž pomocí budou Vaše nemovitosti obsazeny v průběhu celého roku. Naším cílem je <strong>stát se jedničkou na trhu</strong> zprostředkování pronájmu rekreačních nemovitostí v ČR.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400"><strong>Oficiální spuštění</strong> portálu je plánováno na <strong>1. dubna 2020</strong> a nyní se nacházíme ve fázi oslovování potenciálních inzerentů. Ti, kteří přidají svou nabídku do 1. dubna, získají možnost užívat portál <strong>zcela bezplatně po neomezenou dobu</strong>.</p>
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Věříme, že jsme připravili portál, který svým uživatelům nabídne moderní způsob, jak najít tu správnou chatu či apartmán pro pohodovou dovolenou. A Vám, jako inzerentovi, přinese řadu nových hostů a pomůže <strong>obsadit Vaši nemovitost</strong> i mimo hlavní sezónu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">V rámci spolupráce s Chilerem získáte mj.:</p> 
                                                <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;margin-bottom:30px;padding-left:30"> 
                                                    <li style="margin-left:5px;list-style-position:inside">Propagaci Vaší nemovitosti zcela zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Masivní marketingovou podporu Vaší nabídky</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Neplatíte žádnou provizi</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Přímý kontakt mezi Vámi a zájemcem o ubytování</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside"><a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">...a mnohem více</a></li> 
                                                </ul> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero je živý projekt, za kterým stojí tým mladých energických lidí a který byl připravován více než rok. Chilero bude i nadále vyvíjeno tak, aby mělo jak pro uživatele, tak pro inzerenty co největší přidanou hodnotu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Svou nemovitost můžete přidat po kliknutí na tlačítko „Chci zjistit více“ nebo přes odkaz <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/pridatnabidkuzdarma/${emailType}</a>.</p>
                                                ${preklopeni} 
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>${odesilatel} z Chilero Team</p></br> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">E-mail: info@chilero.cz<br>Tel.: +420 705 119 260</p> 
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
                                                                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                            <div style="box-sizing:border-box">
                                                                                <div>
                                                                                    <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Chci zjistit více</a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr>
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr> 
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        if(err){
            console.log("Chyba při odesílání mail.sendOfferCopy");
            console.log(err);
        }
    });
}

mail.sendOfferFree = function(adresat, title, emailType, osloveni, jmeno, callback){
    let preklopeni = "";
    if(emailType === "p2102"){
        preklopeni = `<p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Nebo můžete využít časově omezenou možnost nechat si "překlopit" obsah Vašeho inzerátu z portálu E-chalupy.cz na portál Chilero našimi kolegy. Máte-li zájem využít této možnosti, klikněte prosím na následující odkaz: <a href="https://www.chilero.cz/souhlasimspreklopenim/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/souhlasimspreklopenim/${adresat}</a>.</p>`
    }
    let prvniRadek = `Dobrý den,`;
    if (osloveni == 2){
        prvniRadek = `Vážený pane ${jmeno},`;
    }
    if (osloveni == 3){
        prvniRadek = `Vážená paní ${jmeno},`;
    }
    const msg = {
        to: adresat,
        from: {
            email: 'info@chilero.cz',
            name: "Tomáš Navrátil"
        },
        subject: title,
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">${prvniRadek}</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">omlouvám se, že Vás ruším. Rád bych Vám však představil projekt, který by pro Vás mohl být zajímavý, neboť pronajímáte rekreační objekt ${title}. Níže si dovoluji zaslat Vám základní informace o novém českém projektu Chilero [čilero], který poskytuje prostor pro inzerci chat, chalup a apartmánů.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero (<a href="https://www.chilero.cz" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz</a>) je český start-up, který vznikl, protože si myslíme, že české chaty, chalupy a apartmány si zaslouží moderní prezentaci hodnou 21. století, s jejíž pomocí budou Vaše nemovitosti obsazeny v průběhu celého roku.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400"><strong>Oficiální spuštění</strong> portálu je plánováno na <strong>1. dubna 2020</strong> a nyní se nacházíme ve fázi oslovování potenciálních inzerentů. Ti, kteří přidají svou nabídku do 1. dubna 2020, získají možnost užívat portál <strong>zcela bezplatně po neomezenou dobu</strong>. Inzerenti registrovaní později si již budou muset vybrat některou z placených variant, které budou zveřejněny po spuštění portálu.</p>
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Věříme, že jsme připravili portál, který svým uživatelům nabídne moderní způsob, jak najít tu správnou chatu či apartmán pro pohodovou dovolenou. A Vám, jako inzerentovi, přinese řadu nových hostů a pomůže <strong>obsadit Vaši nemovitost</strong> i mimo hlavní sezónu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">V rámci spolupráce s Chilerem získáte mj.:</p> 
                                                <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;margin-bottom:30px;padding-left:30"> 
                                                    <li style="margin-left:5px;list-style-position:inside">Propagaci Vaší nemovitosti zcela zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Masivní marketingovou podporu Vaší nabídky</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Neplatíte žádnou provizi</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Přímý kontakt mezi Vámi a zájemcem o ubytování</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside"><a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">...a mnohem více</a></li> 
                                                </ul> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero je živý projekt, za kterým stojí tým mladých energických lidí a který byl připravován více než rok. Chilero bude i nadále vyvíjeno tak, aby mělo jak pro uživatele, tak pro inzerenty co největší přidanou hodnotu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Svou nemovitost můžete přidat po kliknutí na tlačítko „Chci zjistit více“ nebo přes odkaz <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/pridatnabidkuzdarma/${emailType}</a>.</p>
                                                ${preklopeni} 
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>Tomáš Navrátil<br>Chilero Team</p></br> 
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
                                                                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                            <div style="box-sizing:border-box">
                                                                                <div>
                                                                                    <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Chci zjistit více</a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr>
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr> 
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        callback(err);
    });
}

mail.sendOfferFree2 = function(adresat, title, emailType, callback){
    let prvniRadek = `Dobrý den,`;
    const msg = {
        to: adresat,
        from: {
            email: 'info@chilero.cz',
            name: "Tomáš Navrátil"
        },
        subject: title,
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">${prvniRadek}</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">omlouvám se, že Vás ruším. Rád bych Vám však představil projekt, který by pro Vás mohl být zajímavý, neboť pronajímáte rekreační objekt ${title}. Níže si dovoluji zaslat Vám základní informace o novém českém projektu Chilero [čilero], který poskytuje prostor pro inzerci chat, chalup a apartmánů.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero (<a href="https://www.chilero.cz" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz</a>) je český start-up, který vznikl, protože si myslíme, že české chaty, chalupy a apartmány si zaslouží moderní prezentaci hodnou 21. století, s jejíž pomocí budou Vaše nemovitosti obsazeny v průběhu celého roku.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400"><strong>Oficiální spuštění</strong> portálu je plánováno na <strong>1. dubna 2020</strong> a nyní se nacházíme ve fázi oslovování potenciálních inzerentů. Ti, kteří přidají svou nabídku do 1. dubna 2020, získají možnost užívat portál <strong>zcela bezplatně po neomezenou dobu</strong>. Inzerenti registrovaní později si již budou muset vybrat některou z placených variant, které budou zveřejněny po spuštění portálu.</p>
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Věříme, že jsme připravili portál, který svým uživatelům nabídne moderní způsob, jak najít tu správnou chatu či apartmán pro pohodovou dovolenou. A Vám, jako inzerentovi, přinese řadu nových hostů a pomůže <strong>obsadit Vaši nemovitost</strong> i mimo hlavní sezónu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">V rámci spolupráce s Chilerem získáte mj.:</p> 
                                                <ul style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;margin-bottom:30px;padding-left:30"> 
                                                    <li style="margin-left:5px;list-style-position:inside">Propagaci Vaší nemovitosti zcela zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Masivní marketingovou podporu Vaší nabídky</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Neplatíte žádnou provizi</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Přímý kontakt mezi Vámi a zájemcem o ubytování</li> 
                                                    <li style="margin-left:5px;list-style-position:inside">Systém pro správu pobytů zdarma</li> 
                                                    <li style="margin-left:5px;list-style-position:inside"><a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">...a mnohem více</a></li> 
                                                </ul> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Chilero je živý projekt, za kterým stojí tým mladých energických lidí a který byl připravován více než rok. Chilero bude i nadále vyvíjeno tak, aby mělo jak pro uživatele, tak pro inzerenty co největší přidanou hodnotu.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Svou nemovitost můžete přidat po kliknutí na tlačítko „Chci zjistit více“ nebo přes odkaz <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/pridatnabidkuzdarma/${emailType}</a>.</p>
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>Tomáš Navrátil<br>Chilero Team</p></br> 
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
                                                                        <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:#348eda;border-radius:2px;text-align:center" valign="top" bgcolor="#348EDA" align="center"> 
                                                                            <div style="box-sizing:border-box">
                                                                                <div>
                                                                                    <a href="https://www.chilero.cz/pridatnabidkuzdarma/${emailType}" style="box-sizing:border-box;border-color:#E2495B;font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:#E2495B;border:solid 1px #E2495B;border-radius:2px;font-size:14px;padding:12px 45px" target="_blank">Chci zjistit více</a>
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr>
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${adresat}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr> 
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        callback(err);
    });
}

mail.sendOfferReminder = function(user, callback){
    const msg = {
        to: user.Email,
        from: 'info@chilero.cz',
        subject: 'Posledních 24 hodin | CHILERO',
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Dobrý den,</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">před pár dny jsme Vám zaslali prezentaci nového portálu pro inzerci rekreačních objektů k pronájmu <a href="https://www.chilero.cz/" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz</a>.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Rádi bychom Vám připomněli, že Vaše možnost registrovat se a přidat nabídku na portálu Chilero za zvýhodněných podmínek uplyne zítra o půlnoci.</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Náš portál můžete vyzkoušet na měsíc zdarma po kliknutí na odkaz <a href="https://www.chilero.cz/informace/akcnicena/${user.EmailTyp}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/informace/akcnicena/${user.EmailTyp}</a></p> 
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>Jakub z Chilero Team</p></br> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">E-mail: info@chilero.cz<br>Tel.: +420 705 119 260</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">PS: Děkujeme za zvážení spolupráce s naším portálem. Pokud se rozhodnete této možnosti nevyužít, již Vás nebudeme kontaktovat.</p> 
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr> 
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${user.Email}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        callback(err);
    });
}

mail.sendOfferExtend = function(user, callback){
    const msg = {
        to: user.Email,
        from: 'info@chilero.cz',
        subject: 'Akční nabídka byla prodloužena | CHILERO',
        html: `<div style="box-sizing:border-box;display:block;max-width:1000px;margin:0 auto;padding:10px"> 
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
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">Dobrý den,</p> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">přidat nabídku zdarma na portál Chilero můžete do 1. 4. 2020 po kliknutí na odkaz <a href="https://www.chilero.cz/pridatnabidkuzdarma/akce" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">www.chilero.cz/pridatnabidkuzdarma/akce</a></p> 
                                                <p style="margin:0;margin-bottom:20px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">S přátelským pozdravem<br>Jakub z Chilero Team</p></br> 
                                                <p style="margin:0;margin-bottom:30px;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400">E-mail: info@chilero.cz<br>Tel.: +420 705 119 260</p> 
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
                        <td style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0" valign="top" align="center"><a href="https://www.chilero.cz" style="box-sizing:border-box;" target="_blank"><img src="https://res.cloudinary.com/dut0sxo27/image/upload/c_fill,h_55,q_auto:best/v1578906657/chilero_logo_text_black.png" height="36" alt="Chilero" style="max-width:100%;border-style:none;font-size:12px"></a> <p style="color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">České chaty a apartmány bez prostředníka</p> <p style="margin:0;color:#484848;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;font-size:12px;margin-bottom:5px">© Chilero s.r.o., IČ: 089 00 230 se sídlem Ztracená 335/19, 779 00 Olomouc, zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, sp. zn. C 81220</p></td>
                    </tr> 
                    <tr style="font-size:12px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;text-align:center;"> 
                        <td>
                           <a href="https://www.chilero.cz/chil/noMoreOffers/${user.Email}" style="box-sizing:border-box;color:#348eda;font-weight:400;text-decoration:none" target="_blank">Nepřeji si dostávat podobné e-maily</a>
                        </td>
                    </tr>
                </tbody>
            </table> 
        </div>  
    </div>`
    };

    sgMail.send(msg, (err)=>{
        callback(err);
    });
}


module.exports = mail;