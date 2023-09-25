export const sampleV2Template = `<html lang="en">
<head>
  <style>
    .line {
      text-align: center;
      font-family:'Lato';
      font-size: 2em;
    }

    .certTemp{
      float: right;
      padding-left:2em;
    }
  </style>
</head>
<body style="width: 900px">
  <div style="margin: 1em;border-radius: 5px;background-color: white;height: 600px;border: 3px solid #B275FF;">
    <div style="padding:1em;text-align:center;font-family: Lato;font-size: 4em;"> Certificate Title</div>
    <table width="100%">
      <tr>  
        <td>
          <div class="line">
            <div>Certified to</div>
            <div>
              <b>{{student_name}}</b>
            </div>
            <div>issued on</div>
            <div style="padding: 1em;font-family: 'Open Sans', sans-serif">
              {{ credential.issuancedate}}
            </div>
            <div>issued by </div>
            <div>Issuer Name</div>
          </div>
          </td>
          </tr>
          <td valign="bottom">
          <img class="certTemp" src="" id="qrcode" alt="qr_code" />
          {{dob}}{{gender}}
        </td>
    </table>
  </div>
  <div></div>
</body>
</html>`;