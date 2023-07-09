import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        huddl: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map((sub) => sub.huddl.id);
  }

  try {
    const { limit, page, huddlName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        huddlName: z.string().nullish().optional(),
      })
      .parse({
        huddlName: url.searchParams.get("huddlName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (huddlName) {
      whereClause = {
        huddl: {
          name: huddlName,
        },
      };
    } else if (session) {
      whereClause = {
        huddl: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        huddl: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });

    return new Response(JSON.stringify(posts));
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
