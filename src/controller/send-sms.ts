import axios from "axios";

const https = require('https');

export async function sendSMS(to, message, template_id) {
  //  to = '0988293040';
  //  message = '4875';
   template_id = 'otp';
  
  // const server = 'https://sms.yegara.com/api2/send';
  const server = 'https://api.geezsms.com/api/v1/sms/send';
  const username = 'addisticket';
  const password = 'xtaeuekKVbJG';
  
  // const postData = JSON.stringify({
  //   to: to,
  //   message: message,
  //   template_id: template_id,
  //   password: password,
  //   username: username
  // });

  const postBody = JSON.stringify({
    token: "mroL65wsSab3PoW3T0viEyzXCtDJPWFI",
    phone: to,
    // shortcode_id: template_id,
    msg: message,
    
  })
  const options = {
    hostname: server,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: postBody
  };
  
   await axios.post(server, postBody, {
      headers: {
        'Content-Type': 'application/json',
      },
   })
//     let data = '';
  
//     res.on('data', (chunk) => {
//       data += chunk;
//     });
  
//     res.on('end', () => {
//       console.log(data);
//     });
//   });
  
//   req.on('error', (error) => {
//     console.error(error);
//   });
  
//   req.write(postBody);
//   req.end();  
}



