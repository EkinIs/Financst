export const PrivacyPolicy = () => {
  return (
    <div className="mx-auto my-4 px-4">
      <div className="p-6 md:p-8 rounded-2xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Financst respects your privacy and is committed to safeguarding your
          personal information. This overview explains how we collect, use, and
          protect the data you choose to share with us.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">What we collect</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We collect basic profile information, authentication credentials,
            and the watchlist entries you create. Usage metrics help us improve
            the product, but we never sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How we use data</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your information powers essential platform features such as secure
            login, personalized recommendations, and syncing your portfolio
            across devices. When required, anonymized analytics help us plan new
            functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Your controls</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You can update or delete data at any time from the settings area.
            For additional privacy requests, reach us via the contact form and
            we will respond promptly.
          </p>
        </section>
      </div>
    </div>
  );
};
