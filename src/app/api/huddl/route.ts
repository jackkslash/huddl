import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { huddlValidator } from "@/lib/validators/huddl";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = huddlValidator.parse(body);

    // check if huddl already exists
    const huddlExists = await db.huddl.findFirst({
      where: {
        name,
      },
    });

    if (huddlExists) {
      return new Response("Huddl already exists", { status: 409 });
    }

    // create huddl and associate it with the user
    const subreddit = await db.huddl.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        huddlId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not create huddl", { status: 500 });
  }
}
