import { Helmet } from "react-helmet-async";

const ErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>Error - 404</title>
        <meta name="description" content="An error occurred on Movie Matrix." />
      </Helmet>
      <div className="">
        <h1>Error - 404</h1>
      </div>
    </>
  );
};

export default ErrorPage;
