export async function postData(url, data = {}, token = "") {
  const headers = {
    "Content-Type": "application/json",
  };
  // si le jeton est passé en parametre
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  return response;
}

export async function getData(url, token = "") {
  const headers = {
    "Content-Type": "application/json",
  };
  // si le jeton est passé en parametre
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  return response;
}

export async function patchData(url, data = {}, token = "") {
  const headers = {
    "Content-Type": "application/json",
  };
  // si le jeton est passé en parametre
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });

  return response;
}
