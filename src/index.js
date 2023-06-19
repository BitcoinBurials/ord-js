import "./styles/index.css";

const h1 = document.createElement("h1");
h1.innerText = "Hello, I am something";
document.body.insertAdjacentElement("afterbegin", h1);
