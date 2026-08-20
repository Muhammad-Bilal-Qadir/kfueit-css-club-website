/* ================================================================
   SUPABASE FORM HANDLERS
   ----------------------------------------------------------------
   Handles form submissions for Membership and Contact Us forms,
   inserting data directly into the connected Supabase tables.
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
      if (!membershipForm.checkValidity()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const msgEl = document.getElementById("membershipFormMsg");
      if (msgEl) msgEl.style.display = "none";

      const submitBtn = membershipForm.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true);

      const formData = new FormData(membershipForm);
      const payload = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        department: (formData.get("department") || "").toString(),
        semester: (formData.get("semester") || "").toString(),
        student_id: (formData.get("student_id") || "").toString().trim(),
        motivation: (formData.get("motivation") || "").toString().trim(),
      };

      try {
        if (!supabaseClient) {
          throw new Error("Supabase client is not initialized.");
        }

        const { data, error } = await supabaseClient
          .from("membership_applications")
          .insert([payload]);

        if (error) throw error;

        showFormMessage(
          msgEl,
          "Your membership application has been submitted successfully. Thank you for joining KFUEIT CSS Club!",
          "success"
        );
        membershipForm.reset();
        membershipForm.classList.remove("was-validated");
        membershipForm.querySelectorAll(".is-valid, .is-invalid").forEach(f => {
          f.classList.remove("is-valid");
          f.classList.remove("is-invalid");
        });
      } catch (err) {
        console.error("Membership form submission error:", err);
        showFormMessage(
          msgEl,
          "Unable to submit your application. Please try again.",
          "error"
        );
      } finally {
        setButtonLoading(submitBtn, false);
      }
    }, true);
  }

  /* ---------------- CONTACT FORM ---------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      if (!contactForm.checkValidity()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const msgEl = document.getElementById("contactFormMsg");
      if (msgEl) msgEl.style.display = "none";

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      setButtonLoading(submitBtn, true);

      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        subject: (formData.get("subject") || "").toString().trim(),
        message: (formData.get("message") || "").toString().trim(),
      };

      try {
        if (!supabaseClient) {
          throw new Error("Supabase client is not initialized.");
        }

        const { data, error } = await supabaseClient
          .from("contact_messages")
          .insert([payload]);

        if (error) throw error;

        showFormMessage(
          msgEl,
          "Your message has been sent successfully. We will get back to you soon.",
          "success"
        );
        contactForm.reset();
        contactForm.classList.remove("was-validated");
        contactForm.querySelectorAll(".is-valid, .is-invalid").forEach(f => {
          f.classList.remove("is-valid");
          f.classList.remove("is-invalid");
        });
      } catch (err) {
        console.error("Contact form submission error:", err);
        showFormMessage(
          msgEl,
          "Unable to send your message. Please try again.",
          "error"
        );
      } finally {
        setButtonLoading(submitBtn, false);
      }
    }, true);
  }

});
