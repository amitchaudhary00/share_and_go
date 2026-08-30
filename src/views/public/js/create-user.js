const form = document.getElementById("createUserForm");
const submitBtn = document.getElementById("submitBtn");
const serverMessage = document.getElementById("serverMessage");

const fields = {
  name: { el: document.getElementById("name"), validate: (v) => v.trim().length > 0 },
  email: {
    el: document.getElementById("email"),
    validate: (v) => /^\S+@\S+\.\S+$/.test(v.trim()),
  },
  mobile: {
    el: document.getElementById("mobile"),
    validate: (v) => /^\+?[0-9]{7,15}$/.test(v.trim()),
  },
  password: { el: document.getElementById("password"), validate: (v) => v.length >= 8 },
};

function setFieldState(key, isValid) {
  fields[key].el.classList.toggle("is-invalid", !isValid);
}

function validateAll() {
  let allValid = true;
  for (const key in fields) {
    const isValid = fields[key].validate(fields[key].el.value);
    setFieldState(key, isValid);
    if (!isValid) allValid = false;
  }
  return allValid;
}

let attemptedSubmit = false;
Object.keys(fields).forEach((key) => {
  fields[key].el.addEventListener("input", () => {
    if (attemptedSubmit) setFieldState(key, fields[key].validate(fields[key].el.value));
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  attemptedSubmit = true;
  serverMessage.className = "mt-3";
  serverMessage.textContent = "";

  if (!validateAll()) return;

  const payload = {
    name: fields.name.el.value.trim(),
    email: fields.email.el.value.trim(),
    mobile: fields.mobile.el.value.trim(),
    password: fields.password.el.value,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    const res = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || data.success === false)
      throw new Error(data.message || "Something went wrong.");

    serverMessage.className = "mt-3 alert alert-success";
    serverMessage.textContent = "Account created! Please check your email to verify.";
    form.reset();
  } catch (err) {
    serverMessage.className = "mt-3 alert alert-danger";
    serverMessage.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  }
});
