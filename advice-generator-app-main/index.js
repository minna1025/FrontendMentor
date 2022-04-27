import Axios from "axios";

async function getAdvice() {
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getAdvice();
