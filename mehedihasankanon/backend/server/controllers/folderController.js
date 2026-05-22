import { prisma } from "../database/db.js";

export const listFolders = async (req, res) => {
  try {
    const { parentId } = req.query;

    const whereClause = {
      ownerId: req.user.id,
    };

    if (parentId === "root") {
      whereClause.parentId = null;
    } else if (parentId) {
      whereClause.parentId = parentId;
    }

    const folders = await prisma.folder.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    if (parentId) {
      const parent = await prisma.folder.findFirst({
        where: {
          id: parentId,
          ownerId: req.user.id,
        },
      });

      if (!parent) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        ownerId: req.user.id,
        parentId: parentId || null,
      },
    });

    res.status(201).json({ folder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, ownerId: req.user.id }
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { name: name.trim() },
    });

    res.json({ message: "Folder renamed successfully", name: name.trim() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, ownerId: req.user.id }
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const getAllFileKeys = async (currentFolderId) => {
      const keys = [];
      const files = await prisma.file.findMany({ where: { folderId: currentFolderId } });
      keys.push(...files.map(f => f.fileKey));

      const subfolders = await prisma.folder.findMany({ where: { parentId: currentFolderId } });
      for (const sub of subfolders) {
        keys.push(...(await getAllFileKeys(sub.id)));
      }
      return keys;
    };

    const fileKeysToDelete = await getAllFileKeys(folderId);

    // Dynamic import to avoid circular dependency issues if any
    const { deleteFileFromUploadThing } = await import("../routes/uploadRouter.js");

    if (fileKeysToDelete.length > 0) {
      await deleteFileFromUploadThing(fileKeysToDelete);
    }

    await prisma.folder.delete({
      where: { id: folderId }
    });

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
