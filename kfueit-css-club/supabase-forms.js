/* ================================================================
   SUPABASE FORM HANDLERS
   ----------------------------------------------------------------
   Membership form aur Contact form ko Supabase database ke sath
   connect karta hai. Jab user form submit karta hai (aur validation
   pass ho jati hai), data seedha Supabase table mein chala jata hai.
   ================================================================ */

function showFormMessage(el, text, type) {
  if (!el) return;
  el.style.display = "block";
  el.textContent = text;
  el.style.padding = "12px 16px";
  el.style.marginBottom = "16px";
  el.style.borderRadius = "8px";
  el.style.fontWeight = "500";
  if (type === "success") {
    el.style.background = "#d1e7dd";
    el.style.color = "#0f5132";
    el.style.border = "1px solid #badbcc";
  } else {
    el.style.background = "#f8d7da";
    el.style.color = "#842029";
    el.style.border = "1px solid #f5c2c7";
  }
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = "Please wait...";
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------- MEMBERSHIP FORM ---------------- */
  const membershipForm = document.getElementById("membershipForm");
  if (membershipForm) {
    membershipForm.addEventListener("submit", async function (e) {
      // Agar built-in validation fail ho rahi hai to yahan kuch nahi karna
      if (!membershipForm.checkValidity()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const msgEl = document.getElementById("membershipFormMsg");
      const submitBtn = membershipForm.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true);

      const formData = new FormData(membershipForm);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        department: formData.get("department"),
        semester: formData.get("semester"),
        student_id: formData.get("student_id"),
        motivation: formData.get("motivation"),
      };

      try {
        const { error } = await supabaseClient
          .from("membership_applications")
          .insert([payload]);

        if (error) throw error;
showFormMessage(msgEl, "Thank you! Your application has been received.", "success");
        membershipForm.reset();
        membershipForm.classList.remove("was-validated");
        membershipForm.querySelectorAll(".is-valid").forEach(f => f.classList.remove("is-valid"));
      } catch (err) {
        console.error(err);
        showFormMessage(msgEl,"Something went wrong while submitting. Please try again.", "error");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    }, true); // capture phase: is listener ko pehle chalao
  }

  /* ---------------- CONTACT FORM ---------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      if (!contactForm.checkValidity()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const msgEl = document.getElementById("contactFormMsg");
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true);

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      };

      try {
        const { error } = await supabaseClient
          .from("contact_messages")
          .insert([payload]);

        if (error) throw error;

        showFormMessage(msgEl, "Thank you! Your application has been received.", "success");
        contactForm.reset();
        contactForm.classList.remove("was-validated");
        contactForm.querySelectorAll(".is-valid").forEach(f => f.classList.remove("is-valid"));
      } catch (err) {
        console.error(err);
        showFormMessage(msgEl, "Something went wrong while submitting. Please try again.", "error");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    }, true);
  }

});
