import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const cookiesStore = cookies();
    const currentToken = cookiesStore.get("masdoomToken")?.value as string;

    const validToken = jwt.verify(currentToken, process.env.TOKEN_SECRET!);

    if (!validToken) {
      const response = NextResponse.json(
        { message: "token not vaild" },
        { status: 401 }
      );
      return response;
    }
    const response = NextResponse.json(
      { message: "token is valid ", token: currentToken },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
