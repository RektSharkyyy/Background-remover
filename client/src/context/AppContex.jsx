import { useAuth, useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { isSignedIn, getToken } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const loadCreditsData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });
      if (data.success) {
        setCredit(data.credits);
        console.log(data.credits);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        return openSignIn();
      }
      setImage(image);
      setResultImage(false);

      navigate("/result");
      const token = await getToken()

      const formData = new FormData
      image && formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/image/remove-bg', formData, { headers: { token } })

      if (data.success) {
        setResultImage(data.resultImage)
        data.creditsBalance && setCredit(data.creditsBalance)
      } else {
        toast.error(data.message)
        data.creditsBalance && setCredit(data.creditsBalance)
        if (data.creditsBalance === 0) {
          navigate('/buy')
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    backendUrl,
    image,
    setImage,
    resultImage,
    setResultImage,
    removeBg,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;