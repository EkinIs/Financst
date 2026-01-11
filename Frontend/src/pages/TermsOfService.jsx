export const TermsOfService = () => {
  return (
    <div className="mx-auto my-4 px-4">
      <div className="p-6 md:p-8 rounded-2xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-300">
          These terms outline the acceptable use of the Financst platform. By
          creating an account you agree to follow the guidelines below so that
          we can keep the community safe and productive.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">Use of the platform</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Financst provides tools to help you research and organize
            investments. You must use accurate information, respect intellectual
            property, and never attempt to access another user&apos;s account or
            private data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">No financial advice</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Information surfaced through Financst is for educational purposes
            only and should not be considered investment advice. You are solely
            responsible for decisions made based on the data shown in the app.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Account termination</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Violations of these terms may lead to suspension or termination of
            your access. If you have questions, contact us and we&apos;ll be
            happy to review your case.
          </p>
        </section>
      </div>
    </div>
  );
};
