
const supabaseClient = window.supabaseClient;

let isSignup = false;

const form = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const nameGroup = document.getElementById("nameGroup");
const consentGroup = document.getElementById("consentGroup");
const submitText = document.getElementById("submitText");
const message = document.getElementById("message");

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#22c55e" : "#ff5c7a";
}

function setMode(signup) {
  isSignup = signup;

  nameGroup.hidden = !signup;
  consentGroup.hidden = !signup;

  document.getElementById("name").required = signup;
  document.getElementById("consent").required = signup;

  submitText.textContent = signup ? "CREATE ACCOUNT" : "LOGIN";
  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);

  showMessage("");
}

loginTab.addEventListener("click", () => setMode(false));
signupTab.addEventListener("click", () => setMode(true));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = document.getElementById("submitBtn");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();

  button.disabled = true;
  showMessage("Please wait...");

  try {
    if (isSignup) {
      if (!document.getElementById("consent").checked) {
        showMessage("Please accept the privacy notice.");
        return;
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name }
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage("Account created! Opening website...", true);
        window.location.href = "./index.html";
      } else {
        showMessage(
          "Account created. Check your email to confirm, then log in.",
          true
        );
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("Login successful! Opening website...", true);
      window.location.href = "./index.html";
    }
  } catch (error) {
    showMessage(error.message || "Something went wrong.");
  } finally {
    button.disabled = false;
  }
});
window.location.href = "./index.html";
