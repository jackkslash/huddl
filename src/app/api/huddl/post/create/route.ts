import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { huddlSubscriptionValidator } from "@/lib/validators/huddl";
import { postValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { huddlId, title, content } = postValidator.parse(body);

    // check if user has already subscribed to subreddit
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        huddlId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subcribe to post", {
        status: 400,
      });
    }

    // create subreddit and associate it with the user
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        huddlId,
      },
    });

    return new Response(huddlId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not subscribe to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
