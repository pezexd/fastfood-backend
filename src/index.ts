import { Context, Elysia } from "elysia";
import { auth } from "./auth";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};

const userMiddleware = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return {
      user: null,
      session: null,
    };
  }

  return {
    user: session.user,
    session: session.session,
  };
};

type User = typeof auth.$Infer.Session.user;
type Session = typeof auth.$Infer.Session.session;

const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session,
  };
};

const app = new Elysia()
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/**", betterAuthView)
  .get("/user", ({ user, session }) => userInfo(user, session))
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
