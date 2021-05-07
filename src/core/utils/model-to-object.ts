export function modelToObject(_doc: any, ret: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, ...rest } = ret;
  return {
    id: _id,
    ...rest,
  };
}
