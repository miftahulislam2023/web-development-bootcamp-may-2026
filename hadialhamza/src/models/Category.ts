import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
  icon: string;
  color: string;
  userId?: mongoose.Types.ObjectId;
  type: "income" | "expense" | "both";
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Icon name is required"],
      default: "Tag",
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      default: "text-primary",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // null means it's a system-defined category
    },
    type: {
      type: String,
      enum: ["income", "expense", "both"],
      default: "expense",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user cannot have two categories with the same name
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
