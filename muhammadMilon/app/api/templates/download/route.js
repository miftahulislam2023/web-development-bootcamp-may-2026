import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JSZip from "jszip";
import { exportTemplateFiles } from "@/utils/exportCode";
import { assertTemplateDownloadAccess } from "@/lib/template-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const access = await assertTemplateDownloadAccess(session?.user?.id, template);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.error || "Purchase required" },
        { status: access.status || 403 },
      );
    }

    const canvasData =
      template.canvasData && typeof template.canvasData === "object"
        ? template.canvasData
        : { sections: [] };

    const { html, css, js } = exportTemplateFiles(canvasData, { title: template.name });

    const zip = new JSZip();
    zip.file("index.html", html);
    zip.file("style.css", css);
    zip.file("script.js", js);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${template.slug || "template"}.zip"`,
      },
    });
  } catch (error) {
    console.error("[Template Download Error]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate download" },
      { status: 500 },
    );
  }
}
