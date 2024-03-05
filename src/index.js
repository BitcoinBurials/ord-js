import "./styles/index.css";

const h1 = document.createElement("h1");
h1.innerText = "Hello, I am some JavaScript in action!";
document.body.insertAdjacentElement("afterbegin", h1);

const req = async () => {
  const res = await fetch(
    "https://ordinals.com/r/metadata/3b0d02048e81b3086fe729b1c32e3b44e28e19dc69bba42f0632b866c5bd6ae0i0"
  );
  const body = await res.json();
  const codeBlock = document.createElement("code");
  codeBlock.innerText = body;
  document.body.insertAdjacentElement("beforeend", codeBlock);
};
window.addEventListener("DOMContentLoaded", req);
