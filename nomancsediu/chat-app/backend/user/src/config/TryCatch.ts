const TryCatch = (func: Function) => (req: any, res: any, next: any) => {
    Promise.resolve(func(req, res, next)).catch(next);
};


export default TryCatch;