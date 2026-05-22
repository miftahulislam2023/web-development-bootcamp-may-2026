import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JSZip from "jszip";
import { exportTemplateFiles } from "@/utils/exportCode";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      select: { id: true, name: true, slug: true, canvasData: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const canvasData =
      project.canvasData && typeof project.canvasData === "object"
        ? project.canvasData
        : { sections: [] };

    const { html, css, js } = exportTemplateFiles(canvasData, { title: project.name });

    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("script.js", js);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${project.slug || "project"}.zip"`,
      },
    });
  } catch (error) {
    console.error("[Project Export Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to export project" },
      { status: 500 },
    );
  }
}
