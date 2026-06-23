export const transform = (_doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  return ret;
};
