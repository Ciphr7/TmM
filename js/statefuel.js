const headers = new Headers();
headers.append("Content-Type", "application/json");

const body = `grant_type=password&username=truckmiles&password=#Qp7D4jqCAW2Um2t`;

const init = {
  method: "POST",
  headers,
  body,
};

fetch("https://locationdata.promiles.com/AXISv1/AXIS/Token ", init)
  .then((response) => {
    return response.json(); // or .text() or .blob() ...
  })
  .then((text) => {
    // text is the response body
  })
  .catch((e) => {
    // error in e.message
  });
