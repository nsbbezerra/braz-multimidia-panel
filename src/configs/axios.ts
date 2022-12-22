import axios from "axios";

const fetcher = axios.create({
  baseURL: "https://tshirt.nkinfo.com.br",
});

export { fetcher };
