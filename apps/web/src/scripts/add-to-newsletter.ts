import { actions } from "astro:actions";

export function addToNewsletter(form: HTMLFormElement) {
  const subscribeNewsletter = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(form);
    const { error } = await actions.addSubscriberToNewsletter(formData);

    if (error) {
      console.error("Error while creating a new subscriber contact", error);
      return;
    }
    const mailInput = form.querySelector(
      "input[type=email]",
    ) as HTMLInputElement;

    const submitButton = form.querySelector(
      "button[type=submit]",
    ) as HTMLButtonElement;

    // Hide input
    mailInput.disabled = true;
    mailInput.placeholder = "";

    // Change submit button style
    submitButton.disabled = true;
    submitButton.style.backgroundImage = "none";
    submitButton.textContent =
      "🎉 Vous êtes bien inscrit.e à notre newsletter !";

    // Reset form
    form.reset();
  };
  form.addEventListener("submit", subscribeNewsletter);
}
