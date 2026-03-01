// ----------------------------------------------------
// Import UI Alerts
// ----------------------------------------------------
import { displayMessage } from "../ui/index.js";

// ----------------------------------------------------
// Current Date
// ----------------------------------------------------
const currentDate = new Date();

// ----------------------------------------------------
// Week Days Data
// ----------------------------------------------------
export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ----------------------------------------------------
// Current Day Details
// ----------------------------------------------------
export const currentDay = weekdays[currentDate.getDay()];

// ----------------------------------------------------
// Full Week Details
// ----------------------------------------------------
export const week = currentDate.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

// ---------------------------------------------------------------
// Format Date
// ------------------------------------------------------------------
export function formatDate(dateStr) {
  const date = new Date(dateStr.replace(" ", "T"));
  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatted;
}

// ---------------------------------------------------------------
// Toggle Password Visibilty
// ------------------------------------------------------------------
export function togglePasswordVisibility($icon, type) {
  const $passwordInput =
    type === "password" ? $(".form-password") : $(".form-password-new");

  const isHidden = $passwordInput.attr("type") === "password";
  $passwordInput.attr("type", isHidden ? "text" : "password");

  $icon
    .removeClass(isHidden ? "fa-eye" : "fa-eye-slash")
    .addClass(isHidden ? "fa-eye-slash" : "fa-eye");
}

// ---------------------------------------------------------------
// Load Countries
// ---------------------------------------------------------------
export async function loadCountries() {
  const response = await fetch("./countries.json");
  const data = await response.json();
  const array = [];

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const { country_name, currency_code, phone_code, country_code } =
        data[key];
      array.push({
        name: country_name,
        currency: currency_code,
        code: ["+"].includes(phone_code) ? phone_code : `+${phone_code}`,
        abbr: country_code,
      });

      $(".form-country").append(
        `<option value="${country_name}">${country_name}</option>`
      );
    }
  }

  return array;
}

// ---------------------------------------------------------------
// Load States
// ---------------------------------------------------------------
export async function loadStates() {
  const response = await fetch("./states.json");
  const data = await response.json();
  const array = [];

  for (const key of data) {
    $(".form-state").append(
      `<option value="${key}">${key}</option>`
    );
    array.push(key);
  }

  return array;
}

// ---------------------------------------------------------------
// Load LGAs
// ---------------------------------------------------------------
export async function loadLGA() {
  const response = await fetch("./geolocation.json");
  const data = await response.json();
  const array = {};

  data.forEach((item) => { 
    const state = item.state;
    const lgas = item.lgas.map(lga => ({ name: lga.name }));
    // Store lgas by state
    array[state] = { lgas };
  })

  return array;
}

// ---------------------------------------------------------------
// Capitalize First Letters Of A Word
// ---------------------------------------------------------------
export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ----------------------------------------------------
// Share Content
// ----------------------------------------------------
export async function shareContent({
  title = "",
  text = "",
  url = "",
  imageUrl = "",
} = {}) {
  // Default to current page if no URL provided
  url = url || window.location.href;

  try {
    // If an image is provided, attempt to attach it
    if (imageUrl && navigator.canShare) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "product-image.jpg", { type: blob.type });

      const shareData = { title, text, url, files: [file] };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return displayMessage("Shared successfully with image!", "success");
      }
    }

    // If image sharing not supported, fallback to text+URL sharing
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return displayMessage("Shared successfully!", "success");
    }

    // Final fallback: copy the link
    await navigator.clipboard.writeText(url);
    displayMessage("Sharing not supported — link copied to clipboard!", "info");
  } catch (err) {
    displayMessage("Share canceled or failed", "warning");
  }
}

// ----------------------------------------------------
// Preview Document For Mails
// ----------------------------------------------------
export function previewMailDocument(input) {
  if (input.files && input.files[0]) {
    const extension = input.files[0].name.split(".").pop().toLowerCase();
    const sizeCal = input.files[0].size / 1024 / 1024;
    let message = null;

    switch (extension) {
      case "zip":
      case "jfif":
        displayMessage(
          "Selected file format not supported. Choose a file with either .jpg, .jpeg, .png, .pdf, .docx, .mp4 and .mp3 extension",
          "info"
        );
        message = 'Unsupported';
        break;
      case "jpg":
      case "jpeg":
      case "png":
      case "pdf":
      case "docx":
      case "mp3":
      case "mp4":
        displayMessage("Included attachment is supported", "success");
        message = 'Supported';
        break;
    }

    return message;
  }
}

// ----------------------------------------------------
// Copy Link
// ----------------------------------------------------
export function copyLink(link) {
  // Use clipboard API directly to copy the text
  navigator.clipboard
    .writeText(link)
    .then(() => {
      displayMessage("Link copied successfully", "success");
    })
    .catch((err) => {
      // console.error("Error copying link: ", err);
      displayMessage("Error copying link", "warning");
    });
} 

// ----------------------------------------------------
// Professional Registrations
// Send data to external service (Professional Dashboard)
// ----------------------------------------------------
export async function professionalRegister(type, user) {
  // Define API endpoints
  const userType = type.toLowerCase();
  if (!userType) {
    console.error("Invalid membership type");
    return;
  }

  // Get the appropriate API URL
  const apiUrl = getUrlEndpoint(userType);
  if (!apiUrl) {
    console.error("Invalid membership professional registration endpoint");
    return;
  }

  const formData = new FormData();

  // Build payload based on membership type
  switch (userType) {
    case "doctor":
    case "dermatologist":
    case "lawyer":
    case "therapist":
      formData.append("name", user.firstname + " " + user.lastname);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("country", user.country);
      break;

    case "freelancer":
      // Implement freelancing registration payload
      break;

    case "vendor":
      formData.append("avatar", "None");
      formData.append("firstname", user.firstname);
      formData.append("lastname", user.lastname);
      formData.append("email", user.email);
      formData.append("contact", user.contact);
      formData.append("country", user.country);
      formData.append("password", user.password);
      formData.append("role", "Vendor");
      formData.append("code", user.code);
      formData.append("abbr", "NG");
      formData.append("creator", "System");
      formData.append("currency", user.currency);
      formData.append("state", user.state);
      break;

    default:
      console.error("Unsupported membership type");
      break;
  }

  await fetch(apiUrl, {
    method: "POST",
    body: formData,
    cache: "no-cache",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    })
    .then((data) => {
      console.log("Data sent to API", data);
    })
    .catch((error) => {
      console.error("Error connecting to server:", error);
    });
}

// ----------------------------------------------------
// Get URL Endpoint
// ----------------------------------------------------
const getUrlEndpoint = (role) => {
  if (["doctor", "dermatologist", "lawyer", "therapist"].includes(role)) {
    return "https://bookings.mrsamase.com/api/v21/bks/register";
  }

  if (role === "freelancer") {
    return "https://freelance.mrsamase.com/api/v21/fls/register";
  }

  if (role === "vendor") {
    return "https://shop.mrsamase.com/api/user/register";
  }

  return null;
};

