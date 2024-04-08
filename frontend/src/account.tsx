import { Button } from "./components/ui/button";
import LoginForm from "./login";

const Account = () => {
  return (
    <>
      {window.localStorage.getItem("jwt") ? (
        <div className="flex flex-col container max-w-52 m-auto">
          <span className="text-3xl text-black block text-center mt-10">
            Account
          </span>
          <Button
            className="max-w-72 m-auto mt-10"
            variant={"destructive"}
            onClick={() => {
              window.localStorage.removeItem("jwt");
              window.localStorage.removeItem("startTime");
              window.localStorage.removeItem("endTime");
              window.location.href = "/";
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <LoginForm />
      )}
    </>
  );
};

export default Account;
