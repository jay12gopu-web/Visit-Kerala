(() => {
    const initialise = () => {
    const page = document.querySelector('[data-enquiry-success]');
    if (!page) return;

    const title = document.getElementById('enquiry-success-title');
    const kicker = document.getElementById('enquiry-success-kicker');
    const message = document.getElementById('enquiry-success-message');
    const confirmed = new URLSearchParams(window.location.search).get('submitted') === '1'
        && title?.textContent.trim() === 'Trip Enquiry Sent';

    document.querySelectorAll('[data-confirmed-only]').forEach((element) => {
        element.hidden = !confirmed;
    });

    document.querySelectorAll('[data-unconfirmed-only]').forEach((element) => {
        element.hidden = confirmed;
    });

    page.classList.toggle('is-confirmed', confirmed);
    page.classList.toggle('is-unconfirmed', !confirmed);

    if (!confirmed) return;

    document.title = 'Enquiry Sent | Visit Kerala';
    kicker.textContent = 'Thank you!';
    title.textContent = 'Enquiry Sent!';
    message.textContent = 'Your Kerala journey just moved one step closer.';
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
    else initialise();
})();
