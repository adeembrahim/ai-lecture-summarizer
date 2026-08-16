import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_ZZajqMPM0",
      userPoolClientId: "28megnb3bo2ud0dcdoj95u50rf",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
    },
  },
};

export default Amplify;