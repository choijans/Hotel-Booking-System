const API_URL = "http://jwt-generator:4000"; // Replace if necessary

export const registerUser = async (username, password, role) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  return response.json();
};

export const loginUser = async (username, password) => {
  console.log("DWADWADWADAW");
  try{
    console.log(username, password)
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log(response)
    return response.json();
  }catch(err){
    throw err;
  }
};
