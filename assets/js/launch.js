// ----------------------------------------------------
// Import Configs
// ----------------------------------------------------
import { makeRequest } from "./core/index.js";
// ----------------------------------------------------
// Import UI Alerts
// ----------------------------------------------------
import { displayMessage } from "./ui/index.js";
// ----------------------------------------------------
// Import Validations
// ----------------------------------------------------
import { validateInput } from "./utils/index.js";

(function ($) {
  ("use strict");

  // ----- Configs ----- //
  const whatsappLink =
    "https://chat.whatsapp.com/CnQCoUk6yLYAFHpy7eVWZ8?mode=gi_t";

  // ----- Validate Inputs ----- //
  $(".form-control").each(function () {
    $(this).on("input blur", function () {
      validateInput(this);
    });
  });

  // ----- Subscribe To Notifications ----- //
  $(".btn-subscribe").on("click", function () {
    subscribe();
  });

  // ----- Secure A Spot ----- //
  $(".btn-secure").on("click", function () {
    manageButton($(this), "Processing...", true);

    // ----- Open Link Afer 2 Seconds ----- //
    setTimeout(() => {
      window.open(whatsappLink, "_blank", "noopener,noreferrer");
    }, 2000);

    // ----- Reset Button And Show Message ----- //
    setTimeout(() => {
      manageButton($(this), "Secure My Spot", false);
      displayMessage(
        "Thanks for securing your spot. We'll keep you updated",
        "success",
      );
    }, 4000);
  });

  // ----- Countdown Timer ----- //
  // COUNTDOWN (March 1, 2026 WAT)
  let countDownDate = new Date("March 10, 2026 23:59:59 GMT+0100").getTime();

  setInterval(function () {
    let now = new Date().getTime();
    let distance = countDownDate - now;

    let d = Math.floor(distance / (1000 * 60 * 60 * 24));
    let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let s = Math.floor((distance % (1000 * 60)) / 1000);

    $(".small b").text(`${d < 2 ? "0" + d : d} Days : ${h < 10 ? "0" + h : h} Hours : ${m < 10 ? "0" + m : m} Mins : ${s < 10 ? "0" + s : s} Secs`);
  }, 1000);

  // ------------------------------------------------- //
  // --------- HELPER FUNCTIONS DEFINITIONS ---------- //
  // ----------------------------------------------- //
  async function subscribe() {
    const email = validateInput($(".form-email"));

    if (!email) {
      displayMessage("Enter your email address", "info");
      return;
    } else {
      $(".btn-subscribe").text("Submitting...").prop("disabled", true);
      setTimeout(() => {
        $(".form-email").val("");
        $(".btn-subscribe").text("Subscribe").prop("disabled", false);
        displayMessage(
          "Thanks for subscribing. We'll keep you updated",
          "success",
        );
      }, 2000);
      /*
      manageButton($(".btn-subscribe"), "Processing...", true);

      try {
        // Prepare data
        const payload = { email: email };

        // Send payment request to backend
        const result = await makeRequest(
          /user/login`,
          "POST",
          payload
        );

        if (result.status === 200 && result.message === "Login successful") {
          displayMessage("Thanks for subscribing. We'll keep you updated", "success");
        } else {
          displayMessage(`${result.message}`, "info");
        }
      } catch (err) {
        displayMessage("Network error occured", "warning");
      }
      finally {
        manageButton($(".btn-subscribe"), "Subscribe", false);
      }
      */
    }
  }

  function manageButton(elem, text, state) {
    elem.text(text).prop("disabled", state);
  }
})(jQuery);
