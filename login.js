
const supabaseClient = window.supabaseClient;

let isSignup = false;

const form = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const nameGroup = document.getElementById("nameGroup");
const consentGroup = document.getElementById("consentGroup");
const submitBtn = document.getElementById("submitBtn");
const submitText = document.getElementById("submitText");
const message = document.getElementById("message");

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#22c55e" : "#ff5c7a";
}

function setMode(signup) {
  isSignup = signup;

  // Correctly show/hide signup-only fields.
  nameGroup.classList.toggle("hidden", !signup);
  consentGroup.classList.toggle("hidden", !signup);

  document.getElementById("name").required = signup;
  document.getElementById("consent").required = signup;

  submitText.textContent = signup ? "CREATE ACCOUNT" : "LOGIN";

  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);

  document.getElementById("password").autocomplete =
    signup ? "new-password" : "current-password";

  showMessage("");
}

loginTab.addEventListener("click", () => setMode(false));
signupTab.addEventListener("click", () => setMode(true));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabaseClient) {
    showMessage("Connection error. Check Supabase configuration.");
    return;
  }

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();

  if (isSignup && !document.getElementById("consent").checked) {
    showMessage("Please accept the privacy notice.");
    return;
  }

  submitBtn.disabled = true;
  showMessage("Please wait...");

  try {
    if (isSignup) {
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
        window.location.replace("./index.html");
      } else {
        showMessage(
          "Account created. Check your email to confirm, then sign in.",
          true
        );
      }
    } else {
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      if (!data.session) {
        showMessage("Login did not create a session. Please try again.");
        return;
      }

      showMessage("Login successful! Opening website...", true);
      window.location.replace("./index.html");
    }
  } catch (error) {
    showMessage(error.message || "Something went wrong.");
  } finally {
    submitBtn.disabled = false;
  }
});

// Start in Sign In mode.
// IMPORTANT: Do not redirect automatically from this file.
setMode(false);
