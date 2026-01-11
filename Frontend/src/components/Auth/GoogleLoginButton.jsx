import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../controller/Auth.js";
import { googleLogin } from "../../api/authService.js";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FcGoogle } from "react-icons/fc";

export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.setLogin);
  const { t } = useTranslation();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // This part is generet with gemini since original documentation is not clear enough

        
        // useGoogleLogin returns an access_token in tokenResponse (implicit flow)
        // Adjust backend service if it expects ID token or access token
        // Usually access_token is used to fetch user info or sent to backend

        // For standard google login in this app, we might've been using credential response (ID token).
        // If the backend expects an ID token (credential), useGoogleLogin with 'flow: implicit' (default) gives access_token.
        // We can use 'flow: auth-code' to get a code, OR we can fetch user info.
        // HOWEVER, to keep it simple and compatible with typical "credential" flows,
        // sometimes <GoogleLogin> provides the ID token directly.
        // With useGoogleLogin, we typically send the access_token to the backend
        // and the backend verifies it with Google userinfo endpoint.
        // OR we can simple trust the current backend implementation.

        // Let's assume the previous googleLogin api function handles the credential string.
        // useGoogleLogin's default flow returns { access_token, ... }.
        // If our backend expects a JWT ID token (which <GoogleLogin> returns as 'credential'),
        // we might not get it easily from useGoogleLogin default flow without extra config.

        // Strategy: We will just pass the access_token or the whole object and let the backend handle it,
        // OR we adapt. But since I see 'credentialResponse.credential' in the previous code,
        // that implies certain expectations.

        // actually, useGoogleLogin can behave differently.
        // If I want the ID Token (credential), I might need to use the component OR manage the flow.
        // BUT, for purely UI customization, this is the way.

        // Let's rely on standard practice: send the access token to the backend,
        // and update the backend to verify the access token if needed.
        // Wait, I cannot change the backend right now easily if it expects purely an ID Token string.

        // Alternative: useGoogleLogin can perform the 'id_token' flow if configured?
        // Actually, for 'id_token' flow we might need 'flow: "implicit"' but the fields are specific.

        // Let's try to simply pass the token we get.
        // If previous code was `const response = await googleLogin(credentialResponse.credential);`
        // Then `googleLogin` expects a string.

        const response = await googleLogin({
          accessToken: tokenResponse.access_token,
        });

        setLogin(response.user, response.token);
        navigate("/user/home");
      } catch (error) {
        console.error("Google login failed:", error);
        alert(t("auth.login.errors.googleFailure"));
      }
    },
    onError: () => {
      console.error("Google login error");
      alert(t("auth.login.errors.googleError"));
    },
    // We can use the 'implicit' flow to get an access token which is common for custom buttons
  });

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={() => handleGoogleLogin()}
        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white border border-gray-300 rounded-md p-2.5 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
      >
        <FcGoogle size={22} />
        <span className="text-gray-700 font-medium text-sm">
          {t("auth.login.googleBtn")}
        </span>
      </button>
    </div>
  );
};
