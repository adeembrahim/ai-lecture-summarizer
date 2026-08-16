import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_ZZajqMPM0",
      userPoolClientId: "28megnb3bo2ud0dcdoj95u50rf",
    },
  },
});

export default Amplify;
