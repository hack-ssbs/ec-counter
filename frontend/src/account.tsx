import LoginForm from "./login";

const Account = () => {
  return (
    <>
      {window.localStorage.getItem("jwt") ? (
        <div className="flex flex-col container">
          <span className="text-3xl text-black block text-center mt-10">
            Account
          </span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2 mx-auto mt-5"
            onClick={() => {
              window.localStorage.removeItem("jwt");
              window.localStorage.removeItem("startTime");
              window.localStorage.removeItem("endTime");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default Account;
