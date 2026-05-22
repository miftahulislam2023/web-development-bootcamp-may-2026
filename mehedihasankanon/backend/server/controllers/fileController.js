{
  /*
    Add controllers: listFiles(userId), toggleFileAccess(fileId, userId), deleteFile(fileId, userId)
    Add routes to fileRouter.js:
    GET /api/files/get-all — List user's files (protected)
    PATCH /api/files/toggle-access/:fileId — Toggle PRIVATE↔PUBLIC (protected)
    DELETE /api/files/delete/:fileId — Delete file from DB & UploadThing (protected)
    */
}

/*
     
    model File {
    id         String         @id @default(uuid())
    name       String
    fileKey    String         @unique
    url        String
    size       Int
    type       String
    access     AccessLevel    @default(PRIVATE)
    ownerId    String
    folderId   String?
    createdAt  DateTime       @default(now())
    updatedAt  DateTime       @updatedAt
    folder     Folder?        @relation(fields: [folderId], references: [id])
    owner      User           @relation("FileOwner", fields: [ownerId], references: [id], onDelete: Cascade)
    sharedWith SharedAccess[]

    @@index([ownerId])
    @@index([fileKey])
    }

    
    */

import { prisma } from "../database/db.js";
import { deleteFileFromUploadThing, renameFileInUploadThing } from "../routes/uploadRouter.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middleware/jwt.js";

// list all files
export const listFiles = async (req, res) => {
  try {
    const { folderId } = req.query;

    const whereClause = {
      ownerId: req.user.id,
    };

    if (folderId === "root") {
      whereClause.folderId = null;
    } else if (folderId) {
      whereClause.folderId = folderId;
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    // map json to include necessary info
    const response = files.map((file) => ({
      id: file.id,
      name: file.name,
      fileKey: file.fileKey,
      url: file.url,
      size: file.size,
      type: file.type,
      access: file.access,
      folderId: file.folderId,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// toggle file access
export const toggleFileAccess = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // find file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // toggle access level
    const newAccess = file.access === "PRIVATE" ? "PUBLIC" : "PRIVATE";

    await prisma.file.update({
      where: { id: fileId },
      data: { access: newAccess },
    });

    res.json({
      message: "File access updated successfully",
      access: newAccess,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete file
export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // find file
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // delete from UploadThing
    await deleteFileFromUploadThing(file.fileKey);

    // delete from DB
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// rename file
export const renameFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "File name is required" });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.ownerId !== req.user.id) {
      return res.status(404).json({ error: "File not found" });
    }

    await renameFileInUploadThing({ key: file.fileKey, newName: name.trim() });

    await prisma.file.update({
      where: { id: fileId },
      data: { name: name.trim() },
    });

    res.json({ message: "File renamed successfully", name: name.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShareFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: "Stash not found" });
    }

    if (file.access === "PUBLIC") {
      return res.json(file);
    }

    // file is PRIVATE
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ error: "This stash is private or the link has changed." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.id === file.ownerId) {
        return res.json({ ...file, isOwner: true });
      } else {
        return res.status(403).json({ error: "This stash is private or the link has changed." });
      }
    } catch (err) {
      return res.status(403).json({ error: "This stash is private or the link has changed." });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchFiles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const files = await prisma.file.findMany({
      where: {
        ownerId: req.user.id,
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
